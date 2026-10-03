import { useEffect, useRef, useState } from 'react'
import About from './About'
import Contact from './Contact'
import Projects from './Projects'
import Welcome from './Welcome'

export type RoomApp = 'welcome' | 'projects' | 'about' | 'contact'

type Props = {
  activeApp: RoomApp
  onClose: () => void
}

const appTitles: Record<RoomApp, string> = {
  welcome: 'WELCOME.TXT',
  projects: 'PROJECTS.EXE',
  about: 'ABOUT_ME.TXT',
  contact: 'CONTACT.EXE',
}

export default function RoomOverlay({ activeApp, onClose }: Props) {
  const [maximized, setMaximized] = useState(false)
  const windowRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (activeApp !== 'welcome') windowRef.current?.focus({ preventScroll: true })
  }, [activeApp])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  if (activeApp === 'welcome') {
    return <Welcome onClose={onClose} />
  }

  return (
    <div
      className="room-app-overlay"
      data-app={activeApp}
      data-maximized={maximized}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="room-overlay-window"
        ref={windowRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-overlay-title"
      >
        <header className="room-overlay-titlebar">
          <div>
            <span className="room-overlay-app-icon" aria-hidden="true" />
            <strong id="room-overlay-title">{appTitles[activeApp]}</strong>
          </div>
          <div className="room-overlay-controls">
            <span aria-hidden="true">—</span>
            <button
              type="button"
              onClick={() => setMaximized((current) => !current)}
              aria-label={maximized ? `Restore ${appTitles[activeApp]}` : `Maximize ${appTitles[activeApp]}`}
              title={maximized ? 'Restore' : 'Maximize'}
            >
              {maximized ? '❐' : '□'}
            </button>
            <button type="button" onClick={onClose} aria-label={`Close ${appTitles[activeApp]}`}>
              ×
            </button>
          </div>
        </header>

        <div className="room-overlay-content">
          {activeApp === 'projects' && <Projects embedded />}
          {activeApp === 'about' && <About embedded />}
          {activeApp === 'contact' && <Contact embedded />}
        </div>
      </section>
    </div>
  )
}
