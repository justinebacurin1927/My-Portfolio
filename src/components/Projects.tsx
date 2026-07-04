import { useState, useRef } from 'react'
import { projects } from '../data'
import type { Project } from '../data'
import ProjectModal from './ProjectModal'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'

const PER_PAGE = 3

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)
  const [page, setPage] = useState(0)
  const dir = useRef<'left' | 'right'>('right')

  const totalPages = Math.ceil(projects.length / PER_PAGE)
  const start = page * PER_PAGE
  const visible = projects.slice(start, start + PER_PAGE)

  const goPrev = () => {
    dir.current = 'left'
    setPage((p) => Math.max(0, p - 1))
  }

  const goNext = () => {
    dir.current = 'right'
    setPage((p) => Math.min(totalPages - 1, p + 1))
  }

  const slideClass =
    dir.current === 'right' ? 'slide-from-right' : 'slide-from-left'

  return (
    <section id="projects" className="scroll-mt-20 px-4 pt-6 sm:px-6 sm:pt-8">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800/70 border-b-transparent bg-slate-900/40 px-6 py-14 shadow-xl shadow-black/30 backdrop-blur-sm sm:px-12">
        <h2 className="mb-8 text-2xl font-bold text-white">
          My Projects I built throughout my Journey
        </h2>

        <div
          key={page}
          className={`${slideClass} grid gap-6 sm:grid-cols-2 lg:grid-cols-3`}
        >
          {visible.map((project) => (
            <button
              type="button"
              key={project.title}
              onClick={() => setSelected(project)}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 text-left transition-colors hover:border-indigo-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-indigo-500/30 to-slate-800">
                  <span className="font-mono text-sm text-slate-300">
                    {project.title}
                  </span>
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold text-white">
                  {project.title}
                </h3>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="font-mono text-xs text-indigo-300">
                      {tag}
                    </li>
                  ))}
                </ul>

                <span className="mt-auto pt-5 text-sm font-medium text-indigo-300 transition-transform group-hover:translate-x-1">
                  View details →
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={goPrev}
              disabled={page === 0}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition-colors hover:border-indigo-500 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaArrowLeft />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    dir.current = i > page ? 'right' : 'left'
                    setPage(i)
                  }}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    i === page
                      ? 'w-7 bg-indigo-500'
                      : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={page === totalPages - 1}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition-colors hover:border-indigo-500 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaArrowRight />
            </button>
          </div>
        )}

        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </section>
  )
}
