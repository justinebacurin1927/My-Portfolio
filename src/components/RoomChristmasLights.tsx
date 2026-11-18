import type { CSSProperties } from 'react'

const windows = [
  { x: 380, y: 130, width: 328, height: 282 },
  { x: 832, y: 130, width: 336, height: 282 },
]
const colors = ['#ff777f', '#8aebba', '#ffe39a', '#8fcfff']

function Bulb({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g
      className="room-christmas-bulb"
      transform={`translate(${x} ${y})`}
      style={{ '--bulb-color': color } as CSSProperties}
    >
      <circle className="room-christmas-halo" cx="0" cy="10" r="13" />
      <path d="M-3 0H3V5H-3Z" fill="#274338" />
      <path d="M-3 4H3V6H5V13H3V16H-3V13H-5V6H-3Z" fill="#172c2a" />
      <path className="room-christmas-glass" d="M-2 5H2V7H4V12H2V14H-2V12H-4V7H-2Z" />
      <path d="M-2 7H0V11H-2Z" fill="#fff7dc" opacity="0.85" />
    </g>
  )
}

export default function RoomChristmasLights() {
  return (
    <svg
      className="room-christmas-lights"
      viewBox="0 0 1536 1024"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {windows.map(({ x, y, width, height }, windowIndex) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <path
            className="room-christmas-cable"
            d={`M0 ${height}V0 Q${width / 4} 46 ${width / 2} 0 Q${(width * 3) / 4} 46 ${width} 0 V${height}`}
          />
          {Array.from({ length: 14 }, (_, index) => {
            const t = (index + 0.5) / 14
            const u = (t * 2) % 1
            return (
              <Bulb
                key={`top-${index}`}
                x={t * width}
                y={92 * u * (1 - u)}
                color={colors[(index + windowIndex) % colors.length]}
              />
            )
          })}
          {[0, width].flatMap((side, sideIndex) =>
            [53, 106, 159, 212, 265].map((top, index) => (
              <Bulb
                key={`${side}-${top}`}
                x={side}
                y={top}
                color={colors[(index + sideIndex + windowIndex) % colors.length]}
              />
            )),
          )}
        </g>
      ))}
    </svg>
  )
}
