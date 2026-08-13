import { useState, useRef } from 'react'
import { projects } from '../data'
import type { Project } from '../data'
import ProjectModal from './ProjectModal'
import BlurImage from './BlurImage'
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
      <div className="pixel-panel mx-auto max-w-6xl px-6 py-14 sm:px-12">
        <div className="pixel-section-label mb-6">02 // PROJECT_LOG</div>
        <h2 className="mb-8 text-3xl font-bold uppercase text-white">
          Selected projects
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
              className="pixel-card group flex flex-col overflow-hidden text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
            >
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

                <span className="mt-auto pt-5 text-sm font-bold uppercase tracking-wider text-cyan-300">
                  [ View details ]
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="mt-10 flex items-center justify-center gap-6"
            role="navigation"
            aria-label="Project pages"
          >
            <button
              type="button"
              onClick={goPrev}
              disabled={page === 0}
              aria-label="Previous project page"
              className="pixel-button flex h-10 w-10 items-center justify-center bg-slate-800 text-slate-200 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
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
                  className={`h-3 w-3 border-2 border-slate-950 transition-all ${
                    i === page
                      ? 'w-8 bg-cyan-300'
                      : 'bg-slate-700 hover:bg-indigo-400'
                  }`}
                  aria-label={`Page ${i + 1}`}
                  aria-current={i === page ? 'page' : undefined}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={page === totalPages - 1}
              aria-label="Next project page"
              className="pixel-button flex h-10 w-10 items-center justify-center bg-slate-800 text-slate-200 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
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
