import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { profile } from '../data'
import PixelCalendarIcon from './PixelCalendarIcon'
import {
  calendarToday,
  contributionRange,
  contributionWeeks,
  fetchActivity,
  type ActivityData,
  type ActivityPeriod,
} from '../lib/github-activity'
import { useDialogFocus } from '../hooks/useDialogFocus'

type Props = { onClose: () => void }
type ActivityState = { status: 'loading' | 'ready' | 'error'; data?: ActivityData }
type Tooltip = { date: string; left: number; top: number }

const username = new URL(profile.socials.github).pathname.split('/').filter(Boolean)[0]
const dayFormat = new Intl.DateTimeFormat('en', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})
const monthFormat = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' })
const firstYear = Number(profile.githubJoinedAt.slice(0, 4))
const countLabel = (count: number) =>
  `${count.toLocaleString()} ${count === 1 ? 'contribution' : 'contributions'}`
const prettyDate = (date: string) => dayFormat.format(new Date(`${date}T12:00:00Z`))
const CONTRIBUTIONS_GUIDE =
  'https://docs.github.com/en/account-and-profile/concepts/contributions-on-your-profile'

export default function GitHubCalendar({ onClose }: Props) {
  const [today, setToday] = useState(calendarToday)
  const currentYear = Number(today.slice(0, 4))
  const [period, setPeriod] = useState<ActivityPeriod>('last')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [focusDate, setFocusDate] = useState(today)
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const [activity, setActivity] = useState<ActivityState>({ status: 'loading' })
  const [refreshVersion, setRefreshVersion] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)
  useDialogFocus(dialogRef)
  const gridRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const refreshPeriodRef = useRef<ActivityPeriod | null>(null)
  const focusAfterRenderRef = useRef(false)
  const years = Array.from(
    { length: currentYear - firstYear + 1 },
    (_, index) => currentYear - index,
  )
  const ready = activity.status === 'ready' && activity.data?.period === period
  const loading = activity.status === 'loading'
  const days = ready ? activity.data!.days : undefined
  const range = contributionRange(period, ready ? (activity.data!.through ?? today) : today)
  const weeks = contributionWeeks(range.start, range.end)
  const dates = weeks.flat().filter((date): date is string => date !== null)
  const total =
    ready && dates.every((date) => days?.[date])
      ? dates.reduce((sum, date) => sum + days![date].count, 0)
      : undefined
  const displayYear = period === 'last' ? currentYear : period
  const rangeLabel = period === 'last' ? 'in the last year' : `in ${period}`
  const monthLabels: { label: string; column: number }[] = []
  for (const date of dates) {
    if (date !== range.start && !date.endsWith('-01')) continue
    const column = weeks.findIndex((week) => week.includes(date))
    if (weeks.length - column < 3) continue
    if (monthLabels.length && column - monthLabels.at(-1)!.column < 3) monthLabels.pop()
    monthLabels.push({ label: monthFormat.format(new Date(`${date}T12:00:00Z`)), column })
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const refreshDay = () => {
      clearTimeout(timer)
      setToday(calendarToday())
      timer = setTimeout(refreshDay, 86_400_000 - (Date.now() % 86_400_000) + 50)
    }
    const refreshOnReturn = () => {
      if (!document.hidden) refreshDay()
    }
    refreshDay()
    document.addEventListener('visibilitychange', refreshOnReturn)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', refreshOnReturn)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const refresh = refreshPeriodRef.current === period
    refreshPeriodRef.current = null
    fetchActivity(username, period, controller.signal, refresh)
      .then((data) => {
        if (!controller.signal.aborted) setActivity({ status: 'ready', data })
      })
      .catch(() => {
        if (!controller.signal.aborted) setActivity({ status: 'error' })
      })
    return () => controller.abort()
  }, [period, refreshVersion, today])

  useEffect(() => {
    const scroll = scrollRef.current
    if (scroll) scroll.scrollLeft = period === 'last' ? scroll.scrollWidth : 0
  }, [period])

  useEffect(() => {
    if (focusDate < range.start || focusDate > range.end) setFocusDate(range.end)
    if (selectedDate && (selectedDate < range.start || selectedDate > range.end))
      setSelectedDate(null)
  }, [focusDate, selectedDate, range.start, range.end])

  useEffect(() => {
    if (!focusAfterRenderRef.current) return
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-calendar-date="${focusDate}"]`)
      ?.focus()
    focusAfterRenderRef.current = false
  }, [focusDate])

  const switchYear = (year: number) => {
    const nextPeriod = year === currentYear ? 'last' : year
    if (period === nextPeriod) return
    setPeriod(nextPeriod)
    setActivity({ status: 'loading' })
    setSelectedDate(null)
    setTooltip(null)
    setFocusDate(year === currentYear ? today : `${year}-01-01`)
  }

  const dayLabel = (date: string) =>
    `${days?.[date] ? countLabel(days[date].count) : loading ? 'Loading activity' : 'Activity unavailable'} on ${prettyDate(date)}`
  const showTooltip = (date: string, button: HTMLButtonElement) => {
    const box = button.getBoundingClientRect()
    setTooltip({
      date,
      left: Math.min(window.innerWidth - 140, Math.max(140, box.left + box.width / 2)),
      top: box.top - 9,
    })
  }

  const moveDayFocus = (event: KeyboardEvent<HTMLButtonElement>, date: string) => {
    const offsets: Record<string, number> = {
      ArrowLeft: -7,
      ArrowRight: 7,
      ArrowUp: -1,
      ArrowDown: 1,
    }
    const current = new Date(`${date}T12:00:00Z`)
    let offset = offsets[event.key]
    if (event.key === 'Home') offset = -current.getUTCDay()
    if (event.key === 'End') offset = 6 - current.getUTCDay()
    if (offset === undefined) return
    event.preventDefault()
    current.setUTCDate(current.getUTCDate() + offset)
    const next = current.toISOString().slice(0, 10)
    if (next < range.start || next > range.end) return
    focusAfterRenderRef.current = true
    setFocusDate(next)
  }

  const reload = () => {
    refreshPeriodRef.current = period
    setActivity({ status: 'loading' })
    setRefreshVersion((version) => version + 1)
    setTooltip(null)
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="github-calendar-dialog"
      aria-labelledby="github-calendar-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="github-calendar-sheet">
        <header className="github-calendar-header">
          <a href={profile.socials.github} target="_blank" rel="noopener noreferrer">
            <PixelCalendarIcon />
            <div>
              <h2 id="github-calendar-title">GITHUB_ACTIVITY.LOG</h2>
              <p>@{username}</p>
            </div>
          </a>
          <button type="button" onClick={onClose} aria-label="Close GitHub calendar" autoFocus>
            ×
          </button>
        </header>
        <div className="github-calendar-body">
          <nav className="github-calendar-years" aria-label="Contribution years">
            <span aria-hidden="true">YEAR</span>
            {years.map((year) => (
              <button
                type="button"
                key={year}
                aria-pressed={displayYear === year}
                onClick={() => switchYear(year)}
              >
                {year}
              </button>
            ))}
          </nav>
          <div className="github-calendar-main">
            <p className="github-calendar-total" aria-live="polite">
              {total !== undefined ? (
                <>
                  <strong>{total.toLocaleString()}</strong>
                  {` ${total === 1 ? 'contribution' : 'contributions'} ${rangeLabel}`}
                </>
              ) : loading ? (
                'Loading contributions…'
              ) : (
                `Contributions ${rangeLabel} unavailable`
              )}
            </p>
            <div className="github-calendar-chart-card">
              <div
                className="github-calendar-chart-scroll"
                ref={scrollRef}
                onScroll={() => setTooltip(null)}
              >
                <div
                  className="github-calendar-chart"
                  style={{ '--contribution-weeks': weeks.length } as CSSProperties}
                >
                  <div className="github-calendar-month-labels" aria-hidden="true">
                    {monthLabels.map(({ label, column }) => (
                      <span
                        key={`${label}-${column}`}
                        style={{ gridColumn: `${column + 1} / span 3` }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="github-calendar-weekday-labels" aria-hidden="true">
                    {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, index) => (
                      <span key={index}>{label}</span>
                    ))}
                  </div>
                  <div
                    className="github-calendar-grid"
                    ref={gridRef}
                    role="grid"
                    aria-label={`GitHub contributions ${rangeLabel}`}
                    aria-busy={loading}
                  >
                    {Array.from({ length: 7 }, (_, row) => (
                      <div className="github-calendar-activity-row" role="row" key={row}>
                        {weeks.map((week, column) => {
                          const date = week[row]
                          return (
                            <div
                              role="gridcell"
                              key={date ?? `blank-${column}`}
                              aria-selected={date ? date === selectedDate : undefined}
                            >
                              {date && (
                                <button
                                  type="button"
                                  data-calendar-date={date}
                                  data-level={days?.[date]?.level ?? 'unknown'}
                                  data-selected={date === selectedDate}
                                  aria-label={dayLabel(date)}
                                  aria-describedby={
                                    tooltip?.date === date ? 'github-calendar-tooltip' : undefined
                                  }
                                  tabIndex={date === focusDate ? 0 : -1}
                                  onMouseEnter={(event) => showTooltip(date, event.currentTarget)}
                                  onMouseLeave={() => setTooltip(null)}
                                  onFocus={(event) => {
                                    setFocusDate(date)
                                    showTooltip(date, event.currentTarget)
                                  }}
                                  onBlur={() => setTooltip(null)}
                                  onClick={() => {
                                    setSelectedDate(date)
                                    setFocusDate(date)
                                  }}
                                  onKeyDown={(event) => moveDayFocus(event, date)}
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <footer className="github-calendar-chart-footer">
                <a href={CONTRIBUTIONS_GUIDE} target="_blank" rel="noopener noreferrer">
                  About contributions ↗
                </a>
                <div className="github-calendar-legend">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <i key={level} data-level={level} aria-hidden="true" />
                  ))}
                  <span>More</span>
                </div>
              </footer>
            </div>
            {loading && (
              <p className="github-calendar-message" role="status">
                Loading GitHub activity…
              </p>
            )}
            {activity.status === 'error' && (
              <div className="github-calendar-message github-calendar-message--error" role="alert">
                <span>GitHub activity is unavailable right now.</span>
                <button type="button" onClick={reload}>
                  Try again
                </button>
              </div>
            )}
            {selectedDate && (
              <p className="github-calendar-day-detail" aria-live="polite" aria-atomic="true">
                {dayLabel(selectedDate)}
              </p>
            )}
          </div>
        </div>
        <footer className="github-calendar-footer">
          <span>
            {ready && activity.data?.includesPrivate && activity.data.updatedAt
              ? `Public + private activity · Updated ${prettyDate(activity.data.updatedAt.slice(0, 10))}`
              : 'Contribution activity visible on my GitHub profile'}
          </span>
          <button type="button" onClick={reload} disabled={loading}>
            Refresh
          </button>
        </footer>
      </section>
      {tooltip && (
        <div
          id="github-calendar-tooltip"
          className="github-calendar-tooltip"
          role="tooltip"
          style={{ left: tooltip.left, top: tooltip.top }}
        >
          {dayLabel(tooltip.date)}
        </div>
      )}
    </dialog>,
    document.body,
  )
}
