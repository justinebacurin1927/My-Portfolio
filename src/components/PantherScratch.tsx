import { useEffect, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

// Trace each tapered contour on a small pixel grid so the curves fit the room art.
function pixelClaw(points: [number, number][]) {
  let [x, y] = points[0]
  let path = `M${x} ${y}`

  for (const [targetX, targetY] of points.slice(1).concat([points[0]])) {
    const startX = x
    const startY = y
    const steps = Math.max(Math.abs(targetX - x), Math.abs(targetY - y))

    for (let step = 1; step <= steps; step++) {
      const nextX = Math.round(startX + ((targetX - startX) * step) / steps)
      const nextY = Math.round(startY + ((targetY - startY) * step) / steps)
      if (nextX !== x) path += `H${nextX}`
      if (nextY !== y) path += `V${nextY}`
      x = nextX
      y = nextY
    }
  }

  return `${path}Z`
}

const CLAWS = [
  {
    delay: 20,
    path: pixelClaw([
      [92, 9],
      [91, 17],
      [87, 26],
      [87, 29],
      [83, 36],
      [83, 39],
      [77, 48],
      [73, 53],
      [73, 55],
      [67, 60],
      [61, 64],
      [60, 67],
      [53, 71],
      [45, 75],
      [43, 78],
      [33, 81],
      [24, 84],
      [18, 84],
      [8, 86],
      [17, 82],
      [27, 79],
      [35, 75],
      [38, 75],
      [44, 71],
      [49, 68],
      [50, 66],
      [57, 62],
      [65, 57],
      [67, 54],
      [71, 50],
      [75, 44],
      [77, 42],
      [80, 35],
      [84, 29],
      [88, 20],
    ]),
  },
  {
    delay: 90,
    path: pixelClaw([
      [108, 17],
      [108, 26],
      [104, 37],
      [104, 41],
      [99, 49],
      [99, 53],
      [92, 63],
      [86, 68],
      [85, 71],
      [77, 77],
      [69, 83],
      [66, 83],
      [58, 89],
      [50, 92],
      [47, 92],
      [38, 95],
      [23, 98],
      [38, 92],
      [45, 88],
      [49, 88],
      [56, 84],
      [62, 80],
      [64, 77],
      [73, 72],
      [78, 68],
      [83, 63],
      [87, 56],
      [91, 50],
      [96, 42],
      [99, 35],
      [103, 27],
    ]),
  },
  {
    delay: 160,
    path: pixelClaw([
      [117, 35],
      [116, 46],
      [112, 57],
      [112, 61],
      [107, 69],
      [106, 72],
      [99, 79],
      [92, 86],
      [90, 89],
      [81, 96],
      [74, 99],
      [71, 100],
      [61, 105],
      [50, 107],
      [40, 109],
      [53, 104],
      [60, 99],
      [65, 99],
      [72, 95],
      [80, 90],
      [82, 87],
      [89, 81],
      [93, 76],
      [96, 69],
      [101, 62],
      [104, 55],
      [108, 48],
      [111, 43],
    ]),
  },
]

export default function PantherScratch({
  reducedMotion,
  onComplete,
}: {
  reducedMotion: boolean
  onComplete: () => void
}) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, reducedMotion ? 600 : 1_100)
    return () => window.clearTimeout(timer)
  }, [reducedMotion, onComplete])

  return createPortal(
    <div className="panther-scratch-overlay" data-reduced-motion={reducedMotion} aria-hidden="true">
      <div className="panther-impact-frame" />
      <div className="panther-scratch-marks">
        {CLAWS.map(({ path, delay }) => (
          <svg
            key={delay}
            className="panther-claw"
            viewBox="0 0 128 128"
            shapeRendering="crispEdges"
            style={{ '--slash-delay': `${delay}ms` } as CSSProperties}
          >
            <g>
              <path className="panther-claw-shadow" d={path} transform="translate(1 1)" />
              <path className="panther-claw-cut" d={path} />
              <path
                className="panther-claw-highlight"
                d={path}
                transform="translate(-0.35 -0.35)"
              />
            </g>
          </svg>
        ))}
      </div>
    </div>,
    document.body,
  )
}
