import { useRef, useState } from 'react'
import About from './About'
import Contact from './Contact'
import Projects from './Projects'
import Welcome from './Welcome'
import GitHubCalendar from './GitHubCalendar'
import { useDialogFocus } from '../hooks/useDialogFocus'
import type { RoomApp } from '../types/room'

type Props = {
  activeApp: RoomApp
  onClose: () => void
}

const appTitles = {
  projects: 'DESKTOP.EXE',
  about: 'ABOUT_ME.TXT',
}

function AppWindow({ activeApp, onClose }: Props & { activeApp: 'projects' | 'about' }) {
  const [maximized, setMaximized] = useState(false)
  const windowRef = useRef<HTMLElement>(null)

  useDialogFocus(windowRef)

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
        onKeyDown={(event) => {
          if (event.key === 'Escape' && !event.defaultPrevented && !document.pointerLockElement)
            onClose()
        }}
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
              aria-label={
                maximized ? `Restore ${appTitles[activeApp]}` : `Maximize ${appTitles[activeApp]}`
              }
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
          {activeApp === 'projects' ? <Projects /> : <About />}
        </div>
      </section>
    </div>
  )
}

export default function RoomOverlay({ activeApp, onClose }: Props) {
  switch (activeApp) {
    case 'welcome':
      return <Welcome onClose={onClose} />
    case 'contact':
      return <Contact onClose={onClose} />
    case 'calendar':
      return <GitHubCalendar onClose={onClose} />
    default:
      return <AppWindow activeApp={activeApp} onClose={onClose} />
  }
}
