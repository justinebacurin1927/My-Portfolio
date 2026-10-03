import { profile } from '../data'

export default function Footer() {
  return (
    <footer id="footer" className="pixel-footer room-footer">
      <div className="room-footer-bar">
        <p>© {new Date().getFullYear()} {profile.name} // ROOM SESSION SAVED</p>
        <div className="room-footer-links">
          <span aria-hidden="true" className="room-footer-light" />
          <a href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a>
          {profile.socials.linkedin && (
            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          )}
        </div>
      </div>
    </footer>
  )
}
