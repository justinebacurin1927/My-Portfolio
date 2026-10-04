import { execFileSync } from 'node:child_process'
import { chmodSync, mkdtempSync, readFileSync, writeFileSync, renameSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = new URL('../', import.meta.url)
const levelNames = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE']
const usernamePattern = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i

function isCalendarDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(`${value}T12:00:00Z`))
    && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value
}

export function requirePrivateScope(headers) {
  const scopes = /^x-oauth-scopes:[ \t]*([^\r\n]*)$/im.exec(headers)?.[1].split(',').map((scope) => scope.trim()) ?? []
  if (!scopes.includes('read:user') && !scopes.includes('user')) {
    throw new Error('Private contribution access needs read:user. Run: gh auth refresh -h github.com -s read:user')
  }
}

export function activityRange(period, through) {
  if (!isCalendarDate(through) || (period !== 'last' && (!Number.isInteger(period) || period < 1970 || period > Number(through.slice(0, 4))))) {
    throw new Error('Invalid GitHub activity period.')
  }
  if (period !== 'last') return { start: `${period}-01-01`, end: `${period}-12-31` }
  const start = new Date(`${through}T12:00:00Z`)
  start.setUTCDate(start.getUTCDate() - 364 - start.getUTCDay())
  return { start: start.toISOString().slice(0, 10), end: through }
}

export function createSnapshot(viewer, periods, generatedAt) {
  if (!viewer || typeof viewer.login !== 'string' || !usernamePattern.test(viewer.login)
    || typeof generatedAt !== 'string' || Number.isNaN(Date.parse(generatedAt))
    || new Date(generatedAt).toISOString() !== generatedAt) {
    throw new Error('Invalid GitHub activity metadata.')
  }
  const through = generatedAt.slice(0, 10)
  const snapshot = { version: 1, username: viewer.login, includesPrivate: true, generatedAt, through, periods: {} }
  for (const period of periods) {
    const calendar = viewer[`activity_${period}`]?.contributionCalendar
    if (!calendar || !Array.isArray(calendar.weeks)) throw new Error('GitHub returned incomplete contribution activity.')
    const range = activityRange(period, through)
    const days = new Map()
    for (const week of calendar.weeks) {
      if (!Array.isArray(week.contributionDays)) throw new Error('GitHub returned incomplete contribution activity.')
      for (const day of week.contributionDays) {
        if (!day || !isCalendarDate(day.date)
          || !Number.isSafeInteger(day.contributionCount) || day.contributionCount < 0
          || !levelNames.includes(day.contributionLevel) || days.has(day.date)) {
          throw new Error('GitHub returned invalid contribution activity.')
        }
        if (day.date >= range.start && day.date <= range.end) {
          days.set(day.date, { date: day.date, count: day.contributionCount, level: levelNames.indexOf(day.contributionLevel) })
        }
      }
    }
    const cursor = new Date(`${range.start}T12:00:00Z`)
    const contributions = []
    while (cursor.toISOString().slice(0, 10) <= range.end) {
      const date = cursor.toISOString().slice(0, 10)
      const day = days.get(date)
      if (!day) throw new Error('GitHub returned incomplete contribution activity.')
      contributions.push(day)
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    const total = contributions.reduce((sum, day) => sum + day.count, 0)
    if (!Number.isSafeInteger(total) || !Number.isSafeInteger(calendar.totalContributions) || total !== calendar.totalContributions) {
      throw new Error('GitHub contribution totals do not match the daily activity.')
    }
    snapshot.periods[period] = { total, contributions }
  }
  return snapshot
}

export function writeSnapshot(snapshot, target = new URL('public/github-activity.json', root)) {
  // Prepare the complete export outside the served public directory. A unique
  // private directory also prevents concurrent builds from sharing a temp file.
  const targetPath = fileURLToPath(target)
  const temporaryDirectory = mkdtempSync(join(dirname(dirname(targetPath)), '.github-activity-sync-'))
  const temporary = join(temporaryDirectory, 'snapshot.json')
  try {
    writeFileSync(temporary, `${JSON.stringify(snapshot)}\n`, { flag: 'wx', mode: 0o600 })
    chmodSync(temporary, 0o644)
    renameSync(temporary, targetPath)
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true })
  }
}

export function syncActivity() {
  const profileSource = readFileSync(new URL('src/data.ts', root), 'utf8')
  const username = /github:\s*['"]https:\/\/github\.com\/([^/'"]+)/.exec(profileSource)?.[1]
  if (!username || !usernamePattern.test(username)) throw new Error('The portfolio GitHub username could not be read.')
  let authenticated
  try {
    authenticated = execFileSync('gh', ['api', '--include', 'user'], { encoding: 'utf8', timeout: 30_000, stdio: ['pipe', 'pipe', 'pipe'] }).replace(/\r/g, '')
  } catch {
    throw new Error('Sign into GitHub CLI first: gh auth login')
  }
  const boundary = authenticated.indexOf('\n\n')
  if (boundary < 0) throw new Error('GitHub account permissions could not be verified.')
  const headers = authenticated.slice(0, boundary)
  const account = JSON.parse(authenticated.slice(boundary + 2))
  if (typeof account.login !== 'string' || account.login.toLowerCase() !== username.toLowerCase()) throw new Error(`Sign into GitHub CLI as ${username} before syncing.`)
  requirePrivateScope(headers)
  const generatedAt = new Date().toISOString()
  const through = generatedAt.slice(0, 10)
  const currentYear = Number(through.slice(0, 4))
  if (typeof account.created_at !== 'string' || Number.isNaN(Date.parse(account.created_at))) throw new Error('GitHub account metadata could not be verified.')
  const firstYear = Number(account.created_at.slice(0, 4))
  if (firstYear < 1970 || firstYear > currentYear) throw new Error('GitHub account metadata could not be verified.')
  const periods = ['last', ...Array.from({ length: currentYear - firstYear }, (_, index) => currentYear - index - 1)]
  const fields = periods.map((period) => {
    const range = activityRange(period, through)
    return `activity_${period}: contributionsCollection(from: "${range.start}T00:00:00Z", to: "${range.end}T23:59:59Z") { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } }`
  }).join('\n')
  let response
  try {
    response = JSON.parse(execFileSync('gh', ['api', 'graphql', '--input', '-'], {
      input: JSON.stringify({ query: `query { viewer { login ${fields} } }` }),
      encoding: 'utf8', timeout: 60_000, stdio: ['pipe', 'pipe', 'pipe'],
    }))
  } catch {
    throw new Error('GitHub contribution activity could not be fetched. The existing snapshot was kept.')
  }
  if (response.errors || typeof response.data?.viewer?.login !== 'string' || response.data.viewer.login.toLowerCase() !== username.toLowerCase()) {
    throw new Error('GitHub contribution activity could not be fetched. The existing snapshot was kept.')
  }
  const snapshot = createSnapshot(response.data.viewer, periods, generatedAt)
  writeSnapshot(snapshot)
  console.log(`Synced ${snapshot.periods.last.total} public + private contributions for ${snapshot.username}. Only dates, counts, and activity levels were exported.`)
  return snapshot
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    syncActivity()
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'GitHub activity sync failed.')
    if (!process.argv.includes('--if-authorized')) process.exitCode = 1
  }
}
