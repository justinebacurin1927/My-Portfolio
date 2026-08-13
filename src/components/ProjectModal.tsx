import { useEffect, useMemo, useRef } from 'react'
import {
  FaGithub,
  FaArrowUpRightFromSquare,
  FaSatellite,
  FaMeteor,
} from 'react-icons/fa6'
import type { Project } from '../data'
import BlurImage from './BlurImage'

type Props = {
  project: Project
  onClose: () => void
}

type Decor = {
  type: 'comet' | 'satellite' | 'asteroid'
  top: number
  duration: number
  delay: number
  size: number
}

export default function ProjectModal({ project, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Randomized space decor, regenerated each time a modal opens.
  const decor = useMemo<Decor[]>(() => {
    const types: Decor['type'][] = [
      'comet',
      'comet',
      'comet',
      'satellite',
      'asteroid',
      'asteroid',
    ]
    return Array.from({ length: 8 }, () => ({
      type: types[Math.floor(Math.random() * types.length)],
      top: Math.random() * 85 + 5,
      duration: Math.random() * 5 + 6,
      delay: Math.random() * 7,
      size: Math.random() * 0.9 + 1,
    }))
  }, [])

  // Scattered twinkling stars behind the panel.
  const stars = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 1.5 + 1,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.3,
      })),
    [],
  )

  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const dialog = dialogRef.current
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'Tab' || !dialog) return

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      )
      if (focusable.length === 0) {
        e.preventDefault()
        dialog.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    const focusFrame = requestAnimationFrame(() => {
      dialog?.querySelector<HTMLElement>(focusableSelector)?.focus()
    })

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      aria-describedby="project-modal-description"
      tabIndex={-1}
    >
      {/* backdrop */}
      <div
        className="pixel-modal-backdrop absolute inset-0"
        onClick={onClose}
      />

      {/* randomized space decor: comets, satellites & asteroids */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* twinkling stars */}
        {stars.map((s, i) => (
          <span
            key={`s${i}`}
            className="star pixel-star absolute"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}

        {decor.map((d, i) =>
          d.type === 'comet' ? (
            <span
              key={i}
              className="comet"
              style={{
                top: `${d.top}%`,
                animationDuration: `${d.duration}s`,
                animationDelay: `${d.delay}s`,
              }}
            />
          ) : (
            <span
              key={i}
              className={`space-drift ${
                d.type === 'satellite' ? 'text-slate-300/70' : 'text-slate-400/60'
              }`}
              style={{
                top: `${d.top}%`,
                fontSize: `${d.size}rem`,
                animationDuration: `${d.duration * 2.2}s`,
                animationDelay: `${d.delay}s`,
              }}
            >
              {d.type === 'satellite' ? <FaSatellite /> : <FaMeteor />}
            </span>
          ),
        )}
      </div>

      {/* panel */}
      <div className="pixel-modal-panel relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <div className="pixel-terminal-bar sticky top-0 z-20">
          <span>PROJECT_DATA.LOG</span>
          <span>READ_ONLY</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="pixel-button absolute right-3 top-11 z-10 flex h-8 w-8 items-center justify-center bg-red-500 text-white hover:bg-red-400"
        >
          ✕
        </button>

        {project.image ? (
          <BlurImage
            src={project.image}
            alt={`${project.title} screenshot`}
            className="aspect-video w-full"
          />
        ) : (
          <div className="pixel-placeholder flex aspect-video w-full items-center justify-center">
            <span className="font-mono text-sm text-slate-300">
              {project.title}
            </span>
          </div>
        )}

        <div className="p-6">
          <h3 id="project-modal-title" className="text-2xl font-bold uppercase text-white">
            {project.title}
          </h3>

          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="pixel-chip px-2 py-1 text-xs text-cyan-200">
                #{tag}
              </li>
            ))}
          </ul>

          <p
            id="project-modal-description"
            className="mt-4 text-sm leading-relaxed text-slate-300 justified"
          >
            {project.overview ?? project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="pixel-button inline-flex items-center gap-2 bg-slate-700 px-4 py-2 text-sm font-bold uppercase text-slate-100 hover:bg-slate-600"
              >
                <FaGithub className="text-base" /> GitHub
              </a>
            )}
            {project.demoStatus ? (
              <span
                aria-disabled="true"
                className="inline-flex cursor-not-allowed items-center gap-2 border-3 border-slate-950 bg-slate-800 px-4 py-2 text-sm font-bold uppercase text-slate-400"
                title="This project demo is not available yet"
              >
                <FaArrowUpRightFromSquare className="text-sm" aria-hidden="true" />
                {project.demoStatus}
              </span>
            ) : project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="pixel-button inline-flex items-center gap-2 bg-indigo-500 px-4 py-2 text-sm font-bold uppercase text-white hover:bg-indigo-400"
              >
                <FaArrowUpRightFromSquare className="text-sm" /> Live Demo
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
