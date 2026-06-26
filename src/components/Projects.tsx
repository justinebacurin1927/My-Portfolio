import { useState } from 'react'
import { projects } from '../data'
import type { Project } from '../data'
import Section from './Section'
import ProjectModal from './ProjectModal'

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <Section id="projects" className="max-w-6xl px-6 py-14 sm:px-12">
      <h2 className="mb-8 text-2xl font-bold text-white">Projects</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
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

      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </Section>
  )
}
