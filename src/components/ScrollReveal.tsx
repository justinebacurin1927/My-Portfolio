import { type CSSProperties, type ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

type Props = {
  children: ReactNode
  /** Delay in ms before the animation starts */
  delay?: number
  className?: string
}

export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
}: Props) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
