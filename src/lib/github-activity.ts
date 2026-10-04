export type ActivityDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export type ActivityPeriod = number | 'last'

export type ActivityData = {
  period: ActivityPeriod
  days: Record<string, ActivityDay>
  fetchedAt: number
  includesPrivate: boolean
  through?: string
  updatedAt?: string
}

const activityCache = new Map<string, ActivityData>()
const CACHE_DURATION = 60 * 60 * 1000
const MAX_ACTIVITY_DAYS = 371
const MAX_ACTIVITY_BYTES = 1024 * 1024

export function calendarDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10)
}

export function calendarToday() {
  return new Date().toISOString().slice(0, 10)
}

export function contributionRange(period: ActivityPeriod, today: string) {
  if (period !== 'last') return { start: calendarDate(period, 0, 1), end: calendarDate(period, 11, 31) }
  const start = new Date(`${today}T12:00:00Z`)
  start.setUTCDate(start.getUTCDate() - 364 - start.getUTCDay())
  return { start: start.toISOString().slice(0, 10), end: today }
}

export function contributionWeeks(start: string, end: string): (string | null)[][] {
  const cursor = new Date(`${start}T12:00:00Z`)
  const cells: (string | null)[] = Array(cursor.getUTCDay()).fill(null)
  while (cursor.toISOString().slice(0, 10) <= end) {
    cells.push(cursor.toISOString().slice(0, 10))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  while (cells.length % 7) cells.push(null)
  return Array.from({ length: cells.length / 7 }, (_, column) => cells.slice(column * 7, column * 7 + 7))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export async function readActivityJson(response: Response): Promise<unknown> {
  const declaredSize = Number(response.headers.get('content-length'))
  if (declaredSize > MAX_ACTIVITY_BYTES) {
    await response.body?.cancel().catch(() => {})
    throw new Error('GitHub activity could not be read.')
  }
  if (!response.body) throw new Error('GitHub activity could not be read.')
  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let size = 0
  let text = ''
  try {
    while (true) {
      const chunk = await reader.read()
      if (chunk.done) break
      size += chunk.value.byteLength
      if (size > MAX_ACTIVITY_BYTES) throw new Error('GitHub activity could not be read.')
      text += decoder.decode(chunk.value, { stream: true })
    }
    return JSON.parse(text + decoder.decode())
  } finally {
    await reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}

export function parseActivity(value: unknown, period: ActivityPeriod): ActivityData {
  if (!isRecord(value) || !Array.isArray(value.contributions) || value.contributions.length === 0
    || value.contributions.length > MAX_ACTIVITY_DAYS) {
    throw new Error('GitHub activity could not be read.')
  }

  const days: Record<string, ActivityDay> = {}
  let total = 0
  for (const day of value.contributions) {
    if (!isRecord(day) || !isCalendarDate(day.date)
      || (period !== 'last' && Number(day.date.slice(0, 4)) !== period)
      || !Number.isSafeInteger(day.count) || (day.count as number) < 0
      || !Number.isInteger(day.level) || (day.level as number) < 0 || (day.level as number) > 4) {
      throw new Error('GitHub activity could not be read.')
    }
    total += day.count as number
    if (!Number.isSafeInteger(total) || days[day.date]) {
      throw new Error('GitHub activity could not be read.')
    }
    days[day.date] = { date: day.date, count: day.count as number, level: day.level as ActivityDay['level'] }
  }
  return { period, days, fetchedAt: Date.now(), includesPrivate: false }
}

export function parseActivitySnapshot(value: unknown, username: string, period: ActivityPeriod): ActivityData {
  if (!isRecord(value) || value.version !== 1 || value.username !== username || value.includesPrivate !== true
    || typeof value.generatedAt !== 'string' || Number.isNaN(Date.parse(value.generatedAt))
    || new Date(value.generatedAt).toISOString() !== value.generatedAt
    || !isCalendarDate(value.through) || value.through !== value.generatedAt.slice(0, 10)
    || value.through > calendarToday() || !isRecord(value.periods)) {
    throw new Error('The contribution snapshot could not be read.')
  }
  const selected = value.periods[period]
  const data = parseActivity(selected, period)
  const range = contributionRange(period, value.through)
  const dates = contributionWeeks(range.start, range.end).flat().filter((date): date is string => date !== null)
  if (!isRecord(selected) || !Number.isSafeInteger(selected.total)
    || Object.keys(data.days).length !== dates.length || !dates.every((date) => data.days[date])
    || dates.reduce((sum, date) => sum + data.days[date].count, 0) !== selected.total) {
    throw new Error('The contribution snapshot is incomplete.')
  }
  return { ...data, includesPrivate: true, through: value.through, updatedAt: value.generatedAt }
}

export async function fetchActivity(username: string, period: ActivityPeriod, signal: AbortSignal, refresh = false): Promise<ActivityData> {
  const cacheKey = `${username}/${period}${period === 'last' ? `/${calendarToday()}` : ''}`
  const cached = activityCache.get(cacheKey)
  if (signal.aborted) throw new DOMException('Activity request canceled', 'AbortError')
  if (!refresh && cached && Date.now() - cached.fetchedAt < CACHE_DURATION) return cached

  const controller = new AbortController()
  const cancel = () => controller.abort()
  signal.addEventListener('abort', cancel, { once: true })
  const timeout = setTimeout(cancel, 12_000)
  try {
    // This same-origin file contains aggregate counts only. GitHub authentication
    // stays in the local sync/build script and never enters the browser bundle.
    try {
      const snapshot = await fetch(`${import.meta.env.BASE_URL}github-activity.json`, {
        signal: controller.signal, credentials: 'omit', cache: 'no-store', redirect: 'error',
      })
      if (snapshot.ok && snapshot.headers.get('content-type')?.includes('application/json')) {
        const activity = parseActivitySnapshot(await readActivityJson(snapshot), username, period)
        if (signal.aborted) throw new DOMException('Activity request canceled', 'AbortError')
        activityCache.set(cacheKey, activity)
        return activity
      }
    } catch {
      if (controller.signal.aborted) throw new DOMException('Activity request canceled', 'AbortError')
    }
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${period}`, {
      signal: controller.signal,
      credentials: 'omit',
    })
    if (!response.ok) throw new Error('GitHub activity is unavailable right now.')
    const activity = parseActivity(await readActivityJson(response), period)
    if (signal.aborted) throw new DOMException('Activity request canceled', 'AbortError')
    activityCache.set(cacheKey, activity)
    return activity
  } finally {
    clearTimeout(timeout)
    signal.removeEventListener('abort', cancel)
  }
}
