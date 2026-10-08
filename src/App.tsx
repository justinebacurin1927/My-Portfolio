import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import Hero from './components/Hero'
import BootLoader from './components/BootLoader'
import RoomOverlay from './components/RoomOverlay'
import { isRoomApp, type RoomApp, type RoomTheme } from './types/room'

const ROOM_WALLPAPERS = {
  night: `url("${import.meta.env.BASE_URL}pixel-developer-room-night-no-plant.webp")`,
  day: `url("${import.meta.env.BASE_URL}pixel-developer-room-day-no-plant.webp")`,
}

const getHashApp = (): RoomApp | null => {
  const hash = window.location.hash.slice(1)
  return isRoomApp(hash) ? hash : null
}

function App() {
  const [activeApp, setActiveApp] = useState<RoomApp | null>(getHashApp)
  const [roomTheme, setRoomTheme] = useState<RoomTheme>('night')

  useEffect(() => {
    const syncAppWithHistory = () => setActiveApp(getHashApp())
    window.addEventListener('hashchange', syncAppWithHistory)
    window.addEventListener('popstate', syncAppWithHistory)
    return () => {
      window.removeEventListener('hashchange', syncAppWithHistory)
      window.removeEventListener('popstate', syncAppWithHistory)
    }
  }, [])

  const openApp = useCallback((app: RoomApp) => {
    window.history.pushState(null, '', `#${app}`)
    setActiveApp(app)
  }, [])

  const closeApp = useCallback(() => {
    window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`)
    setActiveApp(null)
  }, [])

  const toggleRoomTheme = useCallback(() => {
    setRoomTheme((current) => (current === 'night' ? 'day' : 'night'))
  }, [])

  return (
    <div
      className="pixel-app relative isolate min-h-screen overflow-hidden text-slate-100 antialiased"
      data-intro-open={activeApp === 'welcome'}
      data-room-theme={roomTheme}
      style={
        {
          '--room-wallpaper': ROOM_WALLPAPERS[roomTheme],
          '--room-night-wallpaper': ROOM_WALLPAPERS.night,
          '--room-day-wallpaper': ROOM_WALLPAPERS.day,
        } as CSSProperties
      }
    >
      <BootLoader />
      <main className="room-main relative z-10">
        <Hero onOpenApp={openApp} roomTheme={roomTheme} onToggleTheme={toggleRoomTheme} />
        {activeApp && <RoomOverlay key={activeApp} activeApp={activeApp} onClose={closeApp} />}
      </main>
    </div>
  )
}

export default App
