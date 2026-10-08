import assert from 'node:assert/strict'
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import test from 'node:test'
import ts from 'typescript'
import {
  activityRange,
  createSnapshot,
  requirePrivateScope,
  writeSnapshot,
} from './sync-github-activity.mjs'

const source = readFileSync(new URL('../src/lib/github-activity.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 },
}).outputText
const activity = await import(
  `data:text/javascript;base64,${Buffer.from(`import.meta.env = { BASE_URL: '/My-Portfolio/' };\n${compiled}`).toString('base64')}`
)

function fixture() {
  const generatedAt = '2025-01-01T12:00:00.000Z'
  const viewer = {
    login: 'fixture-user',
    privateRepository: { name: 'DO_NOT_EXPORT' },
    credential: 'DO_NOT_EXPORT',
  }
  for (const period of ['last', 2024]) {
    const range = activityRange(period, generatedAt.slice(0, 10))
    const cursor = new Date(`${range.start}T12:00:00Z`)
    const days = []
    while (cursor.toISOString().slice(0, 10) <= range.end) {
      days.push({
        date: cursor.toISOString().slice(0, 10),
        contributionCount: 1,
        contributionLevel: 'FIRST_QUARTILE',
        repository: 'DO_NOT_EXPORT',
      })
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    viewer[`activity_${period}`] = {
      contributionCalendar: {
        totalContributions: days.length,
        weeks: [{ contributionDays: days }],
      },
    }
  }
  return { viewer, generatedAt, snapshot: createSnapshot(viewer, ['last', 2024], generatedAt) }
}

test('private sync requires an explicitly verified read:user or user scope', () => {
  for (const headers of [
    '',
    'X-OAuth-Scopes:',
    'X-OAuth-Scopes: repo, gist',
    'X-OAuth-Scopes: read:users',
    'X-OAuth-Scopes:\nOther: read:user',
  ]) {
    assert.throws(() => requirePrivateScope(headers))
  }
  requirePrivateScope('HTTP/2.0 200 OK\nX-OAuth-Scopes: repo, read:user\nOther: value')
  requirePrivateScope('x-oauth-scopes: user')
})

test('private export strips credentials and repository details from every day', () => {
  const { snapshot } = fixture()
  assert(!JSON.stringify(snapshot).includes('DO_NOT_EXPORT'))
  assert.deepEqual(Object.keys(snapshot), [
    'version',
    'username',
    'includesPrivate',
    'generatedAt',
    'through',
    'periods',
  ])
  for (const period of Object.values(snapshot.periods)) {
    assert.deepEqual(Object.keys(period), ['total', 'contributions'])
    for (const day of period.contributions)
      assert.deepEqual(Object.keys(day), ['date', 'count', 'level'])
  }
})

test('incomplete, invalid, or mismatched upstream activity cannot be published', () => {
  const { viewer, generatedAt } = fixture()
  for (const mutate of [
    (data) => data.activity_last.contributionCalendar.weeks[0].contributionDays.pop(),
    (data) => data.activity_last.contributionCalendar.totalContributions++,
    (data) => {
      data.activity_last.contributionCalendar.weeks[0].contributionDays[0].contributionCount = -1
    },
    (data) => {
      data.activity_last.contributionCalendar.weeks[0].contributionDays[0].date = '2024-02-30'
    },
  ]) {
    const copy = structuredClone(viewer)
    mutate(copy)
    assert.throws(() => createSnapshot(copy, ['last', 2024], generatedAt))
  }
})

test('snapshot writing ignores a preexisting public temporary-file symlink and cleans up', () => {
  const directory = mkdtempSync(join(tmpdir(), 'portfolio-security-'))
  try {
    mkdirSync(join(directory, 'public'))
    const protectedFile = join(directory, 'protected.txt')
    writeFileSync(protectedFile, 'unchanged')
    symlinkSync(protectedFile, join(directory, 'public', 'github-activity.json.tmp'))
    const target = pathToFileURL(join(directory, 'public', 'github-activity.json'))
    const { snapshot } = fixture()
    writeSnapshot(snapshot, target)
    assert.deepEqual(JSON.parse(readFileSync(target, 'utf8')), snapshot)
    assert.equal(readFileSync(protectedFile, 'utf8'), 'unchanged')
    assert(!readdirSync(directory).some((name) => name.startsWith('.github-activity-sync-')))
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

test('calendar rejects oversized arrays, duplicate dates, and unsafe count totals', () => {
  const { snapshot } = fixture()
  const valid = snapshot.periods.last
  assert.equal(activity.parseActivity(valid, 'last').includesPrivate, false)
  assert.throws(() =>
    activity.parseActivity({ contributions: Array(372).fill(valid.contributions[0]) }, 'last'),
  )
  assert.throws(() =>
    activity.parseActivity(
      { contributions: [valid.contributions[0], valid.contributions[0]] },
      'last',
    ),
  )
  assert.throws(() =>
    activity.parseActivity(
      {
        contributions: [
          { date: '2024-01-01', count: Number.MAX_SAFE_INTEGER, level: 1 },
          { date: '2024-01-02', count: Number.MAX_SAFE_INTEGER, level: 1 },
        ],
      },
      'last',
    ),
  )
})

test('private snapshots require the correct owner, canonical dates, and an exact range', () => {
  const { snapshot } = fixture()
  const parsed = activity.parseActivitySnapshot(snapshot, 'fixture-user', 'last')
  assert.equal(parsed.includesPrivate, true)
  assert.equal(parsed.through, '2025-01-01')
  for (const mutate of [
    (data) => {
      data.username = 'another-account'
    },
    (data) => {
      data.generatedAt = '2025-01-01T12:00:00Z'
    },
    (data) => {
      data.through = '2024-02-30'
      data.generatedAt = '2024-02-30T12:00:00.000Z'
    },
    (data) => {
      data.periods.last.contributions.push({ date: '2025-01-02', count: 0, level: 0 })
    },
    (data) => {
      data.periods.last.total++
    },
  ]) {
    const copy = structuredClone(snapshot)
    mutate(copy)
    assert.throws(() => activity.parseActivitySnapshot(copy, 'fixture-user', 'last'))
  }
})

test('calendar accepts valid JSON and cancels declared or streamed oversized bodies', async () => {
  assert.deepEqual(await activity.readActivityJson(new Response('{"ok":true}')), { ok: true })
  let canceled = false
  const declared = new Response(
    new ReadableStream({
      cancel() {
        canceled = true
      },
    }),
    { headers: { 'content-length': '1048577' } },
  )
  await assert.rejects(activity.readActivityJson(declared))
  assert(canceled)
  canceled = false
  const streamed = new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(1048577))
      },
      cancel() {
        canceled = true
      },
    }),
  )
  await assert.rejects(activity.readActivityJson(streamed))
  assert(canceled)
  assert.equal(streamed.body.locked, false)
})
