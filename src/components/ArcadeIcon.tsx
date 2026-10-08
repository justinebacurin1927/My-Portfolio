import type { ArcadeGame } from '../games/catalog'

const palettes = {
  snake: { background: '#16352d', edge: '#315e49', highlight: '#74a77a' },
  nightshift: { background: '#352332', edge: '#663b51', highlight: '#b37982' },
  tinycraft: { background: '#253944', edge: '#3e5962', highlight: '#8baa8c' },
}

export default function ArcadeIcon({ game }: { game: ArcadeGame }) {
  const palette = palettes[game]

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
      <path d="M10 6H52V10H54V50H50V54H12V50H8V10H10Z" fill={palette.edge} />
      <path d="M12 10H50V12H52V48H48V52H14V48H10V12H12Z" fill={palette.background} />
      <path d="M10 6H52V8H10ZM8 10H10V48H8Z" fill={palette.highlight} />
      <path d="M52 12H54V50H50V54H14V52H50V50H52Z" fill="#101c28" />

      {game === 'snake' ? (
        <>
          <path d="M14 18H30V30H18V42H44V34" stroke="#0b201e" strokeWidth="12" />
          <path d="M14 18H30V30H18V42H44V34" stroke="#74bd73" strokeWidth="8" />
          <path
            d="M14 14H32V16H14ZM26 18H28V26H26ZM18 26H26V28H18ZM14 32H16V42H14ZM18 38H42V40H18Z"
            fill="#b7e38d"
          />
          <path
            d="M28 20H32V24H28ZM20 28H24V32H20ZM16 34H20V36H16ZM24 40H28V44H24ZM34 40H38V44H34Z"
            fill="#4e9a62"
          />
          <path d="M40 26H50V28H54V38H50V40H38V36H36V30H40Z" fill="#0b201e" />
          <path d="M40 28H48V30H52V36H48V38H40V34H38V30H40Z" fill="#88cc7e" />
          <path d="M40 28H48V30H40ZM38 30H40V34H38Z" fill="#c5ed99" />
          <path d="M48 30H52V34H48Z" fill="#eff1bc" />
          <path d="M50 30H52V34H50Z" fill="#142a28" />
          <path d="M52 34H58V36H56V38H54V36H52Z" fill="#dc8979" />
          <path d="M40 10H46V14H50V20H46V24H40V20H36V14H40Z" fill="#123129" />
          <path d="M42 10H44V14H48V18H44V22H42V18H38V14H42Z" fill="#f6d789" />
          <path d="M42 12H44V16H42ZM40 14H42V16H40Z" fill="#fff1bf" />
        </>
      ) : game === 'tinycraft' ? (
        <>
          <path
            d="M28 8H36V10H40V12H44V14H48V16H52V18H56V42H52V44H48V46H44V48H40V50H36V52H28V50H24V48H20V46H16V44H12V42H8V18H12V16H16V14H20V12H24V10H28Z"
            fill="#101f29"
          />
          <path
            d="M12 22H16V24H20V26H24V28H28V30H32V48H28V46H24V44H20V42H16V40H12Z"
            fill="#a47b50"
          />
          <path
            d="M32 30H36V28H40V26H44V24H48V22H52V40H48V42H44V44H40V46H36V48H32Z"
            fill="#755b42"
          />
          <path
            d="M12 22H16V24H20V26H24V28H28V30H32V36H28V34H24V32H20V30H16V28H12Z"
            fill="#70974c"
          />
          <path
            d="M32 30H36V28H40V26H44V24H48V22H52V26H48V28H44V30H40V32H36V34H32Z"
            fill="#4a7b45"
          />
          <path
            d="M28 12H36V14H40V16H44V18H48V20H52V22H48V24H44V26H40V28H36V30H28V28H24V26H20V24H16V22H12V20H16V18H20V16H24V14H28Z"
            fill="#9cc567"
          />
          <path
            d="M28 12H36V14H28ZM24 14H28V16H24ZM20 16H24V18H20ZM16 18H20V20H16Z"
            fill="#d0e79a"
          />
          <path
            d="M28 16H34V18H28ZM20 20H26V22H20ZM34 20H42V22H34ZM28 24H36V26H28Z"
            fill="#7eab54"
          />
          <path d="M36 16H40V18H36ZM24 22H28V24H24ZM38 24H42V26H38Z" fill="#b8d882" />
          <path
            d="M14 30H18V32H14ZM22 34H28V36H22ZM18 38H22V40H18ZM26 40H30V44H26Z"
            fill="#d0a471"
          />
          <path d="M18 32H22V34H18ZM22 40H26V42H22ZM14 36H16V38H14Z" fill="#805c40" />
          <path d="M42 32H48V34H42ZM36 36H40V38H36ZM42 40H46V42H42Z" fill="#ac8459" />
          <path d="M48 28H50V30H48ZM38 40H40V44H38ZM34 34H36V36H34Z" fill="#514637" />
        </>
      ) : (
        <>
          <path
            d="M22 12H42V16H48V22H52V40H48V46H42V50H22V46H16V40H12V22H16V16H22Z M24 16V20H20V24H16V38H20V42H24V46H40V42H44V38H48V24H44V20H40V16Z"
            fill="#854257"
            fillRule="evenodd"
          />
          <path
            d="M30 10H34V20H30ZM30 42H34V52H30ZM10 28H20V32H10ZM44 28H54V32H44Z"
            fill="#ce7e7a"
          />
          <path d="M28 26H36V34H28Z" fill="#efa27e" />
          <path
            d="M14 22H42V24H48V26H52V34H46V36H36V48H32V52H22V46H24V36H14V32H10V26H14Z"
            fill="#101422"
          />
          <path d="M26 32H34V46H30V48H24V42H26Z" fill="#b7856a" />
          <path d="M30 36H34V46H30V48H26V46H30Z" fill="#795467" />
          <path d="M26 36H28V40H26ZM26 42H28V44H26Z" fill="#e2b58a" />
          <path d="M34 34H42V42H34V38H38V36H34Z" fill="#647584" />
          <path d="M14 24H40V26H48V28H50V32H44V34H28V32H14V30H12V26H14Z" fill="#a2b6b7" />
          <path d="M14 24H40V26H14ZM12 26H14V28H12Z" fill="#e0e6cf" />
          <path d="M14 30H28V32H44V34H28V34H14Z" fill="#5b7587" />
          <path d="M24 26H28V30H24ZM34 28H40V30H34ZM46 28H50V32H46Z" fill="#273343" />
          <path d="M40 22H44V26H40Z" fill="#aacd9b" />
          <path d="M14 26H20V28H14Z" fill="#7f9da9" />
        </>
      )}
    </svg>
  )
}
