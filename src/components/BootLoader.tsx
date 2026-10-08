import { useEffect, useState } from 'react'

const MINIMUM_DISPLAY_TIME = 1350
const EXIT_TIME = 650

export default function BootLoader() {
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const startedAt = performance.now()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const minimumDisplayTime = reduceMotion ? 150 : MINIMUM_DISPLAY_TIME
    const exitTime = reduceMotion ? 30 : EXIT_TIME
    let exitTimer: ReturnType<typeof setTimeout> | undefined
    let removeTimer: ReturnType<typeof setTimeout> | undefined

    const finishLoading = () => {
      const remaining = Math.max(0, minimumDisplayTime - (performance.now() - startedAt))
      exitTimer = setTimeout(() => {
        setExiting(true)
        removeTimer = setTimeout(() => setVisible(false), exitTime)
      }, remaining)
    }

    if (document.readyState === 'complete') {
      finishLoading()
    } else {
      window.addEventListener('load', finishLoading, { once: true })
    }

    return () => {
      window.removeEventListener('load', finishLoading)
      if (exitTimer) clearTimeout(exitTimer)
      if (removeTimer) clearTimeout(removeTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="portfolio-loader"
      data-exiting={exiting}
      role="status"
      aria-live="polite"
      aria-label="Loading Justine Bacurin's portfolio"
    >
      <div className="boot-window">
        <div className="boot-window-bar">
          <span>JB_OS // BOOT_SEQUENCE</span>
          <span aria-hidden="true">● ● ●</span>
        </div>
        <div className="boot-window-body">
          <div className="boot-logo" aria-hidden="true">
            JB
          </div>
          <p>LOADING PORTFOLIO...</p>
          <div className="boot-progress-track" aria-hidden="true">
            <span />
          </div>
          <small>MOUNTING PROJECTS DRIVE</small>
        </div>
      </div>
    </div>
  )
}
