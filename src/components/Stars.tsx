import { useMemo } from 'react'

type Props = {
  count?: number
}

export default function Stars({ count = 140 }: Props) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const size = Math.random() * 2 + 1 // 1–3px
        return {
          top: Math.random() * 100,
          left: Math.random() * 100,
          size,
          opacity: Math.random() * 0.5 + 0.3,
          delay: Math.random() * 5,
          duration: Math.random() * 3 + 2, // 2–5s
          glow: size > 2.4,
        }
      }),
    [count],
  )

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="star absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            boxShadow: s.glow ? '0 0 6px 1px rgba(255,255,255,0.7)' : undefined,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
