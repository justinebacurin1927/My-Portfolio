import { useState, useEffect } from 'react'

const links = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

type Props = {
  activeSection?: string
}

export default function Navbar({ activeSection = '' }: Props) {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="pixel-nav sticky top-0 z-50">
      {/* Scroll progress bar */}
      <div className="absolute top-0 left-0 h-1 w-full bg-slate-900">
        <div
          className="h-full bg-cyan-300 transition-[width] duration-100 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#" className="pixel-logo text-lg font-bold uppercase text-white">
          <span className="text-cyan-300">&gt;</span> JB_PORTFOLIO
          <span className="animate-pulse text-amber-300">_</span>
        </a>

        <ul className="hidden gap-8 text-sm font-medium text-slate-300 sm:flex">
          {links.map((link) => {
            const isActive = activeSection === link.href.slice(1)
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'location' : undefined}
                  className={`pixel-nav-link transition-colors hover:text-cyan-300 ${
                    isActive ? 'text-cyan-300' : 'text-slate-300'
                  }`}
                  style={
                    isActive ? { textShadow: '0 0 12px rgba(99,102,241,0.5)' } : undefined
                  }
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="pixel-button bg-indigo-500 px-3 py-1 text-white sm:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && (
        <ul
          id="mobile-navigation"
          className="pixel-mobile-menu flex flex-col gap-4 px-6 py-4 text-sm font-medium text-slate-300 sm:hidden"
        >
          {links.map((link) => {
            const isActive = activeSection === link.href.slice(1)
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'location' : undefined}
                  className={`block transition-colors hover:text-white ${
                    isActive ? 'text-white' : 'text-slate-300'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </header>
  )
}
