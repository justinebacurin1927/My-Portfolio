import { useEffect, useState } from 'react'
import { getRoomLighting } from '../lib/roomLighting'

export default function useRoomClock() {
  const [lighting, setLighting] = useState(() => getRoomLighting(new Date()))

  useEffect(() => {
    let refreshTimer: number | undefined

    const refresh = () => {
      setLighting(getRoomLighting(new Date()))
      window.clearTimeout(refreshTimer)
      refreshTimer = window.setTimeout(refresh, 60_000 - (Date.now() % 60_000) + 50)
    }

    refresh()
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('focus', refresh)

    return () => {
      window.clearTimeout(refreshTimer)
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  return lighting
}
