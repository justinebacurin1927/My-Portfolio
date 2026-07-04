import { useMemo } from 'react'
import { FaUser } from 'react-icons/fa6'
import { profile } from '../data'

type Ray = {
  angle: number
  d: string
  fill: string
  opacity: number
}

export default function Hero() {
  const rays = useMemo<Ray[]>(
    () => [
      // Tall flame-like rays — sweeping curves that taper at the tip
      { angle: 0,   d: 'M-12,-140 C-18,-170 -22,-210 -10,-250 C-6,-280 -4,-295 0,-310 C4,-295 6,-280 10,-250 C22,-210 18,-170 12,-140 Z', fill: '#fbbf24', opacity: 0.35 },
      { angle: 30,  d: 'M-8,-140 C-12,-165 -14,-195 -6,-230 C-3,-255 -2,-265 0,-275 C2,-265 3,-255 6,-230 C14,-195 12,-165 8,-140 Z', fill: '#f59e0b', opacity: 0.25 },
      { angle: 60,  d: 'M-11,-140 C-16,-168 -20,-200 -9,-240 C-5,-268 -3,-282 0,-298 C3,-282 5,-268 9,-240 C20,-200 16,-168 11,-140 Z', fill: '#fbbf24', opacity: 0.3 },
      { angle: 90,  d: 'M-7,-140 C-10,-160 -12,-188 -5,-218 C-2,-240 -1,-250 0,-262 C1,-250 2,-240 5,-218 C12,-188 10,-160 7,-140 Z', fill: '#f59e0b', opacity: 0.2 },
      { angle: 120, d: 'M-13,-140 C-19,-172 -24,-208 -11,-248 C-7,-276 -4,-292 0,-306 C4,-292 7,-276 11,-248 C24,-208 19,-172 13,-140 Z', fill: '#fbbf24', opacity: 0.38 },
      { angle: 150, d: 'M-9,-140 C-13,-163 -15,-192 -7,-228 C-4,-252 -2,-264 0,-278 C2,-264 4,-252 7,-228 C15,-192 13,-163 9,-140 Z', fill: '#f59e0b', opacity: 0.22 },
      { angle: 180, d: 'M-11,-140 C-16,-168 -20,-200 -9,-240 C-5,-268 -3,-282 0,-298 C3,-282 5,-268 9,-240 C20,-200 16,-168 11,-140 Z', fill: '#fbbf24', opacity: 0.35 },
      { angle: 210, d: 'M-8,-140 C-11,-162 -13,-190 -6,-225 C-3,-248 -2,-258 0,-270 C2,-258 3,-248 6,-225 C13,-190 11,-162 8,-140 Z', fill: '#f59e0b', opacity: 0.2 },
      { angle: 240, d: 'M-12,-140 C-18,-170 -22,-210 -10,-250 C-6,-280 -4,-295 0,-310 C4,-295 6,-280 10,-250 C22,-210 18,-170 12,-140 Z', fill: '#fbbf24', opacity: 0.38 },
      { angle: 270, d: 'M-7,-140 C-10,-160 -12,-188 -5,-218 C-2,-240 -1,-250 0,-262 C1,-250 2,-240 5,-218 C12,-188 10,-160 7,-140 Z', fill: '#f59e0b', opacity: 0.2 },
      { angle: 300, d: 'M-13,-140 C-19,-172 -24,-208 -11,-248 C-7,-276 -4,-292 0,-306 C4,-292 7,-276 11,-248 C24,-208 19,-172 13,-140 Z', fill: '#fbbf24', opacity: 0.35 },
      { angle: 330, d: 'M-9,-140 C-13,-163 -15,-192 -7,-228 C-4,-252 -2,-264 0,-278 C2,-264 4,-252 7,-228 C15,-192 13,-163 9,-140 Z', fill: '#f59e0b', opacity: 0.22 },
      // Smaller interstitial rays in between
      { angle: 15,  d: 'M-5,-140 C-7,-155 -8,-172 -4,-195 C-2,-210 -1,-218 0,-225 C1,-218 2,-210 4,-195 C8,-172 7,-155 5,-140 Z', fill: '#f59e0b', opacity: 0.12 },
      { angle: 45,  d: 'M-5,-140 C-7,-155 -8,-172 -4,-195 C-2,-210 -1,-218 0,-225 C1,-218 2,-210 4,-195 C8,-172 7,-155 5,-140 Z', fill: '#fbbf24', opacity: 0.15 },
      { angle: 75,  d: 'M-4,-140 C-6,-152 -7,-168 -3,-190 C-2,-202 -1,-210 0,-218 C1,-210 2,-202 3,-190 C7,-168 6,-152 4,-140 Z', fill: '#f59e0b', opacity: 0.1 },
      { angle: 105, d: 'M-5,-140 C-7,-155 -8,-172 -4,-195 C-2,-210 -1,-218 0,-225 C1,-218 2,-210 4,-195 C8,-172 7,-155 5,-140 Z', fill: '#fbbf24', opacity: 0.12 },
      { angle: 135, d: 'M-5,-140 C-7,-155 -8,-172 -4,-195 C-2,-210 -1,-218 0,-225 C1,-218 2,-210 4,-195 C8,-172 7,-155 5,-140 Z', fill: '#f59e0b', opacity: 0.15 },
      { angle: 165, d: 'M-4,-140 C-6,-152 -7,-168 -3,-190 C-2,-202 -1,-210 0,-218 C1,-210 2,-202 3,-190 C7,-168 6,-152 4,-140 Z', fill: '#fbbf24', opacity: 0.1 },
      { angle: 195, d: 'M-5,-140 C-7,-155 -8,-172 -4,-195 C-2,-210 -1,-218 0,-225 C1,-218 2,-210 4,-195 C8,-172 7,-155 5,-140 Z', fill: '#f59e0b', opacity: 0.12 },
      { angle: 225, d: 'M-5,-140 C-7,-155 -8,-172 -4,-195 C-2,-210 -1,-218 0,-225 C1,-218 2,-210 4,-195 C8,-172 7,-155 5,-140 Z', fill: '#fbbf24', opacity: 0.15 },
      { angle: 255, d: 'M-4,-140 C-6,-152 -7,-168 -3,-190 C-2,-202 -1,-210 0,-218 C1,-210 2,-202 3,-190 C7,-168 6,-152 4,-140 Z', fill: '#f59e0b', opacity: 0.1 },
      { angle: 285, d: 'M-5,-140 C-7,-155 -8,-172 -4,-195 C-2,-210 -1,-218 0,-225 C1,-218 2,-210 4,-195 C8,-172 7,-155 5,-140 Z', fill: '#fbbf24', opacity: 0.12 },
      { angle: 315, d: 'M-5,-140 C-7,-155 -8,-172 -4,-195 C-2,-210 -1,-218 0,-225 C1,-218 2,-210 4,-195 C8,-172 7,-155 5,-140 Z', fill: '#f59e0b', opacity: 0.15 },
      { angle: 345, d: 'M-4,-140 C-6,-152 -7,-168 -3,-190 C-2,-202 -1,-210 0,-218 C1,-210 2,-202 3,-190 C7,-168 6,-152 4,-140 Z', fill: '#fbbf24', opacity: 0.1 },
    ],
    [],
  )

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

      {/* Sun-frame profile picture */}
      <div className="relative shrink-0">
        {/* Sun corona glow — pulsing */}
        <div
          className="corona-pulse absolute -inset-14 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(249,115,22,0.08) 40%, transparent 70%)',
          }}
        />
        <div
          className="corona-pulse absolute -inset-7 rounded-full blur-2xl"
          style={{
            animationDelay: '0.5s',
            background:
              'radial-gradient(circle, rgba(251,191,36,0.14) 0%, rgba(251,146,60,0.06) 50%, transparent 70%)',
          }}
        />

        {/* Thick sun rays — organic curved corona */}
        <div className="pointer-events-none absolute -inset-24 animate-[corona-spin_25s_linear_infinite]">
          <svg
            viewBox="-320 -320 640 640"
            className="h-full w-full"
            aria-hidden="true"
            style={{ filter: 'drop-shadow(0 0 14px rgba(251,191,36,0.25))' }}
          >
            {rays.map((r) => (
              <path
                key={r.angle}
                d={r.d}
                fill={r.fill}
                opacity={r.opacity}
                transform={`rotate(${r.angle})`}
              />
            ))}
          </svg>
        </div>

        {/* Outer orbital ring (slow CW) */}
        <div className="sun-orbit-slow pointer-events-none absolute -inset-16">
          <div className="h-full w-full rounded-full border border-dashed border-amber-400/20" />
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]" />
          <span className="absolute -bottom-1.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-orange-300 shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
        </div>

        {/* Inner orbital ring (reverse CCW) */}
        <div className="sun-orbit-slower pointer-events-none absolute -inset-10">
          <div className="h-full w-full rounded-full border border-dashed border-orange-400/15" />
          <span
            className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-yellow-300 shadow-[0_0_10px_rgba(253,224,71,0.6)]"
            style={{ marginTop: '-5.5rem' }}
          />
        </div>

        {/* Profile image */}
        {profile.photo ? (
          <img
            src={profile.photo}
            alt={profile.name}
            className="relative h-64 w-64 rounded-full object-cover ring-2 ring-amber-400/40 shadow-[0_0_30px_rgba(251,191,36,0.15)] sm:h-72 sm:w-72"
          />
        ) : (
          <div className="relative flex h-64 w-64 flex-col items-center justify-center gap-2 rounded-full border-2 border-dashed border-slate-700 bg-slate-900/40 text-slate-500 sm:h-72 sm:w-72">
            <FaUser className="text-5xl" />
            <span className="text-sm">Your photo</span>
          </div>
        )}
      </div>
    </section>
  )
}
