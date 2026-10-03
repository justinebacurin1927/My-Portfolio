import type { ArcadeGame } from '../games/catalog'

export default function ArcadeIcon({ game }: { game: ArcadeGame }) {
  return <svg viewBox="0 0 32 32" shapeRendering="crispEdges" fill="none" aria-hidden="true">
    <path d="M4 2H28V4H30V28H28V30H4V28H2V4H4Z" fill={game === 'snake' ? '#183637' : '#352039'} stroke="#0e1424" strokeWidth="2" />
    <path d="M5 4H27V6H5Z" fill={game === 'snake' ? '#4f8070' : '#86545c'} />
    {game === 'snake' ? <>
      <path d="M7 9H17V12H10V18H20V14H26V23H7Z" fill="#8ed492" /><path d="M7 9H17V11H7ZM10 18H20V20H10Z" fill="#c3ed99" />
      <path d="M21 15H23V17H21ZM25 15H27V17H25Z" fill="#173033" /><path d="M21 6H24V9H27V12H24V15H21V12H18V9H21Z" fill="#f7d881" />
    </> : <>
      <path d="M9 11H12V8H20V11H23V14H25V23H22V26H10V23H7V14H9Z" fill="#b2545e" /><path d="M11 11H21V14H11Z" fill="#e68171" />
      <path d="M9 16H14V19H9ZM18 16H23V19H18Z" fill="#b6f0ce" /><path d="M12 22H20V24H12Z" fill="#321c38" />
    </>}
  </svg>
}
