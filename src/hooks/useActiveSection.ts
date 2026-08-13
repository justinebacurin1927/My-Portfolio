import { useEffect, useState } from 'react'

const SECTIONS = ['about', 'projects', 'contact']

export function useActiveSection() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      // Tune these margins so the "active" zone sits in the upper-middle of the viewport
      { rootMargin: '-40% 0px -55% 0px' },
    )

    for (const id of SECTIONS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return active
}
