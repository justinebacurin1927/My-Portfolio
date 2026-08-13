import { profile } from '../data'

export default function Footer() {
  return (
    <footer id="footer" className="pixel-footer">
      <div className="pixel-crowd-footer">
        <img
          src={`${import.meta.env.BASE_URL}footer-plush-crowd.webp`}
          alt="A crowd of different pixel-art stuffed toys"
          loading="lazy"
          decoding="async"
          className="pixel-crowd-image"
        />
        <div className="pixel-crowd-credit">
          <p>© {new Date().getFullYear()} {profile.name} // React + Tailwind</p>
          <span aria-hidden="true">|</span>
          <div className="flex gap-4">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            {profile.socials.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
