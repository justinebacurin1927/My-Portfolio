export type RoomApp = 'welcome' | 'projects' | 'about' | 'contact' | 'calendar'
export type RoomTheme = 'night' | 'day'

const roomApps = new Set<string>(['welcome', 'projects', 'about', 'contact', 'calendar'])

export function isRoomApp(value: string): value is RoomApp {
  return roomApps.has(value)
}
