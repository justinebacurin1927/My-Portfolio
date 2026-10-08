import { useId, type CSSProperties } from 'react'

const windows = [
  { position: 'left', width: 282, firstPane: 136, secondPane: 152 },
  { position: 'right', width: 297, firstPane: 126, secondPane: 141 },
] as const

const leaves = [
  { height: 52, duration: 8.4, delay: -2.1, color: '#9baa53' },
  { height: 112, duration: 7.2, delay: -5.4, color: '#708b3f' },
  { height: 177, duration: 9.1, delay: -0.8, color: '#aab45a' },
  { height: 221, duration: 7.8, delay: -3.9, color: '#81994c' },
  { height: 263, duration: 9.6, delay: -7.2, color: '#b6ae5d' },
  { height: 291, duration: 8.8, delay: -4.6, color: '#708b3f' },
] as const

export default function RoomDaylight() {
  const id = useId()

  return (
    <div className="room-window-effects room-window-effects--day" aria-hidden="true">
      {windows.map(({ position, width, firstPane, secondPane }, windowIndex) => {
        const clipId = `${id}-${position}`

        return (
          <svg
            key={position}
            className={`room-day-window room-day-window--${position}`}
            viewBox={`0 0 ${width} 314`}
            shapeRendering="crispEdges"
            focusable="false"
            style={{ '--window-width': `${width}px` } as CSSProperties}
          >
            <defs>
              <clipPath id={clipId}>
                {[0, 163].flatMap((top) => [
                  <rect
                    key={`${top}-first`}
                    x="0"
                    y={top}
                    width={firstPane}
                    height={top === 0 ? 148 : 151}
                  />,
                  <rect
                    key={`${top}-second`}
                    x={secondPane}
                    y={top}
                    width={width - secondPane}
                    height={top === 0 ? 148 : 151}
                  />,
                ])}
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`}>
              {[82, 132, 245].map((height, index) => (
                <g
                  className="room-day-gust"
                  key={height}
                  style={
                    {
                      '--gust-y': `${height}px`,
                      animationDuration: `${6.2 + index * 1.3}s`,
                      animationDelay: `${-index * 2.4 - windowIndex * 3.1}s`,
                    } as CSSProperties
                  }
                >
                  <path d="M0 8H22V6H38V4H52V6H62V8H72 M12 14H29V12H45 M43 0H54V2H61" />
                </g>
              ))}
              {leaves.map(({ height, duration, delay, color }, index) => (
                <g
                  key={height}
                  className="room-day-leaf"
                  style={
                    {
                      '--leaf-y': `${height}px`,
                      '--leaf-color': color,
                      animationDuration: `${duration}s`,
                      animationDelay: `${delay - windowIndex * 2.7}s`,
                    } as CSSProperties
                  }
                >
                  <g className="room-day-leaf-turn" style={{ animationDelay: `${-index * 0.6}s` }}>
                    <path
                      d="M0 5H2V3H5V1H11V0H15V4H13V7H10V9H5V8H2V6H0Z M-2 7H1V6H3V7H1V8H-2Z"
                      fill="#455c36"
                    />
                    <path d="M2 4H5V2H11V1H14V4H12V6H9V8H5V7H2Z" fill="var(--leaf-color)" />
                    <path d="M5 3H10V2H12V3H10V4H5Z" fill="#d0da87" />
                    <path d="M2 6H5V5H8V4H11V3H12" stroke="#536b36" strokeWidth="1" fill="none" />
                  </g>
                </g>
              ))}
            </g>
          </svg>
        )
      })}
    </div>
  )
}
