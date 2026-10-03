import type { ReactNode } from 'react'

type Props = {
  id?: string
  /** Tailwind classes for the inner panel (sizing, padding, alignment). */
  className?: string
  embedded?: boolean
  children: ReactNode
}

// An application-style panel layered over the shared pixel-room backdrop.
export default function Section({ id, className = '', embedded = false, children }: Props) {
  return (
    <section id={id} className={embedded ? 'room-embedded-section' : 'scroll-mt-20 px-4 py-6 sm:px-6 sm:py-8'}>
      <div
        className={`pixel-panel mx-auto ${className}`}
      >
        {children}
      </div>
    </section>
  )
}
