import type { ReactNode } from 'react'

type Props = {
  id?: string
  /** Tailwind classes for the inner panel (sizing, padding, alignment). */
  className?: string
  children: ReactNode
}

// A frosted panel that visually separates each section from the starfield.
export default function Section({ id, className = '', children }: Props) {
  return (
    <section id={id} className="scroll-mt-20 px-4 py-6 sm:px-6 sm:py-8">
      <div
        className={`mx-auto rounded-3xl border border-slate-800/70 bg-slate-900/40 shadow-xl shadow-black/30 backdrop-blur-sm ${className}`}
      >
        {children}
      </div>
    </section>
  )
}
