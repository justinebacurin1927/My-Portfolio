import { profile } from '../data'

export default function Footer() {
  return (
    <footer className="bg-[#020806]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-sm text-slate-500 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with React &
          Tailwind.
        </p>
        <div className="flex gap-6">
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-slate-300"
          >
            GitHub
          </a>
          {profile.socials.linkedin && (
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-slate-300"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
