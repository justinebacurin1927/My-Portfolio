import type { RoomTheme } from '../types/room'

export const ROOM_TIME_ZONE = 'Asia/Manila'

const hourFormatter = new Intl.DateTimeFormat('en-PH', {
  timeZone: ROOM_TIME_ZONE,
  hour: '2-digit',
  hourCycle: 'h23',
})

const clockFormatter = new Intl.DateTimeFormat('en-PH', {
  timeZone: ROOM_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})

export function getRoomLighting(date: Date): { theme: RoomTheme; time: string } {
  const hour = Number(hourFormatter.formatToParts(date).find((part) => part.type === 'hour')?.value)
  const theme = hour >= 6 && hour < 16 ? 'day' : hour >= 16 && hour < 18 ? 'sunset' : 'night'

  return { theme, time: clockFormatter.format(date).toUpperCase() }
}

export function getNextRoomTheme(theme: RoomTheme): RoomTheme {
  return theme === 'day' ? 'sunset' : theme === 'sunset' ? 'night' : 'day'
}

export const roomThemeLabels: Record<RoomTheme, string> = {
  day: 'morning',
  sunset: 'sunset',
  night: 'night',
}
