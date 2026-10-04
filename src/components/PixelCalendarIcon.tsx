import { calendarToday } from '../lib/github-activity'

export default function PixelCalendarIcon() {
  const date = calendarToday()
  const month = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`)).toUpperCase()
  return <svg viewBox="0 0 64 74" fill="none" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
    <path d="M8 7H58V11H62V71H58V74H8Z" fill="#0c1020" />
    <path d="M4 5H56V9H60V67H56V71H4V67H0V9H4Z" fill="#262038" />
    <path d="M4 9H56V67H4Z" fill="#cdbb9b" />
    <path d="M4 9H56V24H4Z" fill="#365b49" />
    <path d="M4 9H56V12H4ZM4 12H7V24H4Z" fill="#719b77" />
    <path d="M7 27H53V63H7Z" fill="#eee1c1" />
    <path d="M7 63H49V66H7Z M49 60H53V63H49Z" fill="#a89479" />
    <path d="M13 1H19V13H13Z M41 1H47V13H41Z" fill="#171723" />
    <path d="M14 2H17V10H14Z M42 2H45V10H42Z" fill="#c6bbad" />
    <text x="30" y="21" textAnchor="middle" fill="#f2e7cc" fontFamily="Pixelify Sans Variable, monospace" fontSize="10">{month}</text>
    <text x="30" y="49" textAnchor="middle" fill="#3e3b42" fontFamily="Pixelify Sans Variable, monospace" fontSize="23">{Number(date.slice(8))}</text>
    {[0, 1, 2, 3, 4, 5, 6].map((column) => <rect key={column} x={10 + column * 6} y="55" width="4" height="4" fill={['#c6c5a9', '#789467', '#4c7955', '#315b49', '#779666', '#c6c5a9', '#aac191'][column]} />)}
    <path className="room-calendar-outline" d="M4 5H13V1H19V5H41V1H47V5H56V9H60V67H56V71H4V67H0V9H4Z" />
  </svg>
}
