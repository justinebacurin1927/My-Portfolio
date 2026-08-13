import { useState } from 'react'
import { FaUser } from 'react-icons/fa6'
import { profile } from '../data'

export default function Hero() {
  const [showOriginal, setShowOriginal] = useState(false)

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-16 px-6 py-24 sm:px-8 sm:py-32 md:flex-row md:justify-between">
      <div className="flex max-w-2xl flex-col items-start">
        <div className="pixel-status mb-6">
          <span className="pixel-status-dot" aria-hidden="true" />
          PLAYER_01 // AVAILABLE
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
          &gt; Hi, my name is
        </p>
        <h1 className="pixel-title text-5xl font-bold uppercase tracking-tight text-white sm:text-7xl">
          {profile.name}
        </h1>
        <h2 className="mt-4 text-2xl font-semibold uppercase leading-tight text-amber-300 sm:text-4xl">
          {profile.role}
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
          {profile.tagline}
        </p>

        <div className="mt-10 flex flex-wrap gap-5">
          <a href="#projects" className="pixel-button bg-indigo-500 px-6 py-3 font-bold uppercase text-white hover:bg-indigo-400">
            View work
          </a>
          <a href="#contact" className="pixel-button bg-cyan-300 px-6 py-3 font-bold uppercase text-slate-950 hover:bg-cyan-200">
            Contact
          </a>
          <a href={profile.resumeUrl} download className="pixel-button bg-amber-300 px-6 py-3 font-bold uppercase text-slate-950 hover:bg-amber-200">
            ↓ Resume
          </a>
        </div>
      </div>

      <div className="pixel-sun-stage relative shrink-0" aria-label="Profile portrait in a pixel sun frame">
        <div className="pixel-sun-rays" aria-hidden="true" />
        <div className="pixel-orbit pixel-orbit-outer" aria-hidden="true">
          <span className="pixel-orbit-dot" />
        </div>
        <div className="pixel-orbit pixel-orbit-inner" aria-hidden="true">
          <span className="pixel-orbit-dot pixel-orbit-dot-cyan" />
        </div>

        <div className="pixel-avatar-frame">
          <span className="pixel-corner pixel-corner-tl" aria-hidden="true" />
          <span className="pixel-corner pixel-corner-tr" aria-hidden="true" />
          <span className="pixel-corner pixel-corner-bl" aria-hidden="true" />
          <span className="pixel-corner pixel-corner-br" aria-hidden="true" />
          {profile.photo ? (
            <button
              type="button"
              className="pixel-avatar-toggle group"
              onClick={() => setShowOriginal((current) => !current)}
              aria-pressed={showOriginal}
              aria-label={
                showOriginal
                  ? 'Showing original portrait. Switch to pixel character.'
                  : 'Showing pixel character. Reveal original portrait.'
              }
            >
              <img
                key={showOriginal ? 'original' : 'pixel'}
                src={showOriginal ? profile.photo : profile.pixelPhoto}
                alt={
                  showOriginal
                    ? `Original portrait of ${profile.name}`
                    : `Pixel-art character portrait of ${profile.name}`
                }
                className={`pixel-avatar pixel-avatar-swap ${
                  showOriginal ? '' : 'pixel-avatar-art'
                }`}
              />
              <span className="pixel-reveal-hint" aria-hidden="true">
                {showOriginal ? '[ SHOW PIXEL ]' : '[ REVEAL PHOTO ]'}
              </span>
            </button>
          ) : (
            <div className="flex h-64 w-64 flex-col items-center justify-center gap-2 bg-slate-900 text-slate-400 sm:h-72 sm:w-72">
              <FaUser className="text-5xl" />
              <span className="text-sm uppercase">Insert portrait</span>
            </div>
          )}
        </div>
        <div className="pixel-avatar-caption" aria-live="polite">
          {showOriginal ? 'ORIGINAL.JPEG // CLICK: PIXEL' : 'PIXEL_AVATAR.WEBP // CLICK: REVEAL'}
        </div>
      </div>
    </section>
  )
}
