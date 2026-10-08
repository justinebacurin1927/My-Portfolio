import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa6'

export type SocialNetwork = 'facebook' | 'linkedin'

export default function SocialIcon({ network }: { network: SocialNetwork }) {
  const facebook = network === 'facebook'
  const Glyph = facebook ? FaFacebookF : FaLinkedinIn

  return (
    <svg
      viewBox="0 0 64 64"
      shapeRendering="crispEdges"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 6H56V10H60V58H56V62H12V58H8V10H12Z" fill="#080e1b" />
      <path d="M8 2H54V6H58V54H54V58H8V54H4V6H8Z" fill="#0a1320" />
      <path d="M10 6H52V10H54V50H50V54H12V50H8V10H10Z" fill={facebook ? '#12467d' : '#13445c'} />
      <path d="M12 10H50V12H52V48H48V52H14V48H10V12H12Z" fill={facebook ? '#1877f2' : '#0a66c2'} />
      <path d="M10 6H52V8H10ZM8 10H10V48H8Z" fill={facebook ? '#87baff' : '#7dbbdb'} />
      <path d="M52 12H54V50H50V54H14V52H50V50H52Z" fill="#102c46" />
      <Glyph
        x={facebook ? 13 : 16}
        y={facebook ? 12 : 17}
        size={facebook ? 37 : 31}
        fill="#f4f7ef"
      />
    </svg>
  )
}
