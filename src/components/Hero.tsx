import { FaUser } from 'react-icons/fa6'
import { profile } from '../data'

export default function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-24 sm:px-8 sm:py-32 md:flex-row md:justify-between">
      <div className="flex flex-col items-start">
      <p className="mb-4 font-mono text-sm text-indigo-400">Hi, my name is</p>
      <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
        {profile.name}
      </h1>
      <h2 className="mt-3 text-2xl font-semibold text-slate-400 sm:text-4xl">
        {profile.role}
      </h2>
      <p className="mt-6 max-w-xl text-lg text-slate-400">{profile.tagline}</p>

      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="#projects"
          className="rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-400"
        >
          View my work
        </a>
        <a
          href="#contact"
          className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
        >
          Get in touch
        </a>
        <a
          href={profile.resumeUrl}
          download
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a.75.75 0 0 1 .75.75v6.638l1.96-2.158a.75.75 0 1 1 1.08 1.04l-3.25 3.5a.75.75 0 0 1-1.08 0l-3.25-3.5a.75.75 0 1 1 1.08-1.04l1.96 2.158V3.75A.75.75 0 0 1 10 3Z"
              clipRule="evenodd"
            />
            <path d="M3.5 12.75a.75.75 0 0 1 .75.75v2.25a.5.5 0 0 0 .5.5h10.5a.5.5 0 0 0 .5-.5V13.5a.75.75 0 0 1 1.5 0v2.25a2 2 0 0 1-2 2H4.75a2 2 0 0 1-2-2V13.5a.75.75 0 0 1 .75-.75Z" />
          </svg>
          Resume
        </a>
      </div>
      </div>

      {/* Picture placeholder (set profile.photo to use a real image) */}
      <div className="shrink-0">
        {profile.photo ? (
          <img
            src={profile.photo}
            alt={profile.name}
            className="h-64 w-64 rounded-full object-cover ring-2 ring-indigo-500/40 sm:h-72 sm:w-72"
          />
        ) : (
          <div className="flex h-64 w-64 flex-col items-center justify-center gap-2 rounded-full border-2 border-dashed border-slate-700 bg-slate-900/40 text-slate-500 sm:h-72 sm:w-72">
            <FaUser className="text-5xl" />
            <span className="text-sm">Your photo</span>
          </div>
        )}
      </div>
    </section>
  )
}
