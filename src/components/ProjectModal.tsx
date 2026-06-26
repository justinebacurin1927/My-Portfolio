import { useEffect, useMemo } from 'react'
import {
  FaGithub,
  FaArrowUpRightFromSquare,
  FaSatellite,
  FaMeteor,
} from 'react-icons/fa6'
import type { Project } from '../data'

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* randomized space decor: comets, satellites & asteroids */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* nebula glows */}
        <div className="absolute -left-16 top-0 h-60 w-60 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -right-12 bottom-0 h-72 w-72 rounded-full bg-fuchsia-600/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-44 w-44 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />

        {/* twinkling stars */}
        {stars.map((s, i) => (
          <span
            key={`s${i}`}
            className="star absolute rounded-full bg-white"
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
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
        >
          ✕
        </button>

        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-indigo-500/30 to-slate-800">
            <span className="font-mono text-sm text-slate-300">
              {project.title}
            </span>
          </div>
        )}

        <div className="p-6">
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>

          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="font-mono text-xs text-indigo-300">
                {tag}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            {project.overview ?? project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
              >
                <FaGithub className="text-base" /> GitHub
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
              >
                <FaArrowUpRightFromSquare className="text-sm" /> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
