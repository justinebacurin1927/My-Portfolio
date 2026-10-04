import { profile } from '../data'

export default function ArkoIcon() {
  return <svg viewBox="0 0 64 64" shapeRendering="crispEdges" fill="none" aria-hidden="true" focusable="false">
    <path d="M12 6H56V10H60V58H56V62H12V58H8V10H12Z" fill="#080e1b" />
    <path d="M8 2H54V6H58V54H54V58H8V54H4V6H8Z" fill="#0a1320" />
    <path d="M10 6H52V10H54V50H50V54H12V50H8V10H10Z" fill="#4b642b" />
    <path d="M12 10H50V12H52V48H48V52H14V48H10V12H12Z" fill="#000" />
    <path d="M10 6H52V8H10ZM8 10H10V48H8Z" fill="#c5fa3d" />
    <path d="M52 12H54V50H50V54H14V52H50V50H52Z" fill="#26371b" />
    <image href={profile.studio.logo} x="10" y="10" width="40" height="40" />
  </svg>
}
