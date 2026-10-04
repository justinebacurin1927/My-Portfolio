import { useState, type CSSProperties } from 'react'
import {
  FaArrowLeft,
  FaArrowUpRightFromSquare,
  FaFileCode,
  FaFolder,
  FaFolderOpen,
  FaGithub,
} from 'react-icons/fa6'
import { profile, projects } from '../data'
import BlurImage from './BlurImage'
import ArcadeIcon from './ArcadeIcon'
import { arcadeGames, arcadeTitles, type ArcadeGame } from '../games/catalog'
import ArcadeWindow from './ArcadeWindow'
import SocialIcon, { type SocialNetwork } from './SocialIcon'

const FEATURED_INDEX = Math.max(
  0,
  projects.findIndex((project) => project.image && project.fileType === 'APP'),
)
const DESKTOP_WALLPAPER = `url("${import.meta.env.BASE_URL}projects/pixel-landscape-desktop-16bit.webp")`
const PAPERCLIP_ASSISTANT = `${import.meta.env.BASE_URL}pixel-paperclip-assistant.png`
const DESKTOP_SOCIALS: { network: SocialNetwork; name: string; href: string }[] = [
  { network: 'facebook', name: 'Facebook', href: profile.socials.facebook },
  { network: 'linkedin', name: 'LinkedIn', href: profile.socials.linkedin },
]
const PROJECT_TIPS = [
  'Open the Projects folder, then select a file to preview it.',
  'Select a project file to see its screenshot, details, and technologies.',
  'Use View source or Live demo in a preview when those links are available.',
  'Minimize the explorer to return to the desktop. Use the taskbar to bring it back.',
  'Use Back in the explorer to return to the desktop.',
]

type Props = {
  embedded?: boolean
}

export default function Projects({ embedded = false }: Props) {
  const [folderOpen, setFolderOpen] = useState(false)
  const [windowMinimized, setWindowMinimized] = useState(false)
  const [windowMaximized, setWindowMaximized] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(FEATURED_INDEX)
  const [tipIndex, setTipIndex] = useState(0)
  const [arcadeGame, setArcadeGame] = useState<ArcadeGame | null>(null)
  const [arcadeMinimized, setArcadeMinimized] = useState(false)
  const selected = projects[selectedIndex]

  const openFolder = () => {
    if (arcadeGame) setArcadeMinimized(true)
    if (!folderOpen) setSelectedIndex(FEATURED_INDEX)
    setFolderOpen(true)
    setWindowMinimized(false)
  }

  const openGame = (game: ArcadeGame) => {
    if (folderOpen) setWindowMinimized(true)
    setArcadeGame(game)
    setArcadeMinimized(false)
  }

  const closeWindow = () => {
    setFolderOpen(false)
    setWindowMinimized(false)
    setWindowMaximized(false)
  }

  return (
    <section id="projects" className={embedded ? 'room-embedded-section room-projects-app' : 'scroll-mt-20 px-4 py-10 sm:px-6 sm:py-16'}>
      <div className={embedded ? 'h-full' : 'mx-auto max-w-6xl'}>
        {!embedded && (
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="pixel-section-label mb-5">01 // PROJECT_ARCHIVE</div>
              <h2 className="font-mono text-3xl font-bold uppercase text-white sm:text-5xl">
                Open my project files
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-400 sm:text-right">
              Explore the systems, experiments, and interfaces I have built. Open a
              file to inspect the project and its source.
            </p>
          </div>
        )}

        <div
          className="os-desktop"
          data-folder-open={folderOpen}
          data-window-minimized={windowMinimized}
          data-window-maximized={windowMaximized}
          style={{ '--os-wallpaper': DESKTOP_WALLPAPER } as CSSProperties}
        >
          {(!folderOpen || windowMinimized) && (
            <div className="os-desktop-home">
              <div className="os-desktop-status" aria-hidden="true">
                <span>JB_OS</span>
                <span>DESKTOP // {projects.length} PROJECTS · {arcadeGames.length} GAMES</span>
              </div>

              <div className="os-desktop-icons">
              <button
                type="button"
                onClick={openFolder}
                className="os-folder-launcher group"
                aria-label={`Open Projects folder containing ${projects.length} projects`}
              >
                <span className="os-folder-icon" aria-hidden="true">
                  <FaFolder />
                  <span>{projects.length}</span>
                </span>
                <strong>PROJECTS</strong>
                <span className="os-open-prompt">[ CLICK TO OPEN ]</span>
              </button>
              {arcadeGames.map((game) => <button type="button" key={game} data-game={game} onClick={() => openGame(game)} className="os-folder-launcher os-game-launcher" aria-label={`Play ${arcadeTitles[game]}`}>
                <span className="os-game-icon"><ArcadeIcon game={game} /></span>
                <strong>{arcadeTitles[game].toUpperCase()}</strong>
              </button>)}
              {DESKTOP_SOCIALS.filter(({ href }) => href).map(({ network, name, href }) => <a key={network} href={href} target="_blank" rel="noopener noreferrer" className="os-folder-launcher os-social-launcher" data-social={network} aria-label={`Open ${profile.name}'s ${name} profile in a new tab`}>
                <span className="os-game-icon"><SocialIcon network={network} /></span>
                <strong>{name.toUpperCase()}</strong>
              </a>)}
              </div>

              <div className="os-desktop-help">
                <button
                  type="button"
                  className="os-paperclip-button"
                  onClick={() => setTipIndex((current) => (current + 1) % PROJECT_TIPS.length)}
                  aria-label={`Show next tip. Tip ${tipIndex + 1} of ${PROJECT_TIPS.length}.`}
                  title="Click for another tip"
                >
                  <img
                    src={PAPERCLIP_ASSISTANT}
                    alt=""
                    className="pixel-paperclip-assistant"
                  />
                </button>
                <span className="os-tip-label">TIP_{String(tipIndex + 1).padStart(2, '0')}</span>
                <p aria-live="polite">{PROJECT_TIPS[tipIndex]}</p>
                <span className="os-tip-hint" aria-hidden="true">CLICK CLIP FOR MORE</span>
              </div>
            </div>
          )}

          {folderOpen && (
            <div
              className="os-window"
              data-minimized={windowMinimized}
              data-maximized={windowMaximized}
            >
              <div className="os-window-titlebar">
                <div className="flex items-center gap-2">
                  <FaFolderOpen aria-hidden="true" />
                  <span>PROJECT_EXPLORER.EXE</span>
                </div>
                <div className="os-window-controls">
                  <button
                    type="button"
                    onClick={() => setWindowMinimized(true)}
                    aria-label="Minimize Project Explorer"
                    title="Minimize"
                  >
                    —
                  </button>
                  <button
                    type="button"
                    onClick={() => setWindowMaximized((current) => !current)}
                    aria-label={windowMaximized ? 'Restore Project Explorer' : 'Maximize Project Explorer'}
                    title={windowMaximized ? 'Restore' : 'Maximize'}
                  >
                    {windowMaximized ? '❐' : '□'}
                  </button>
                  <button
                    type="button"
                    onClick={closeWindow}
                    aria-label="Close Project Explorer"
                    title="Close"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="os-window-menu" aria-hidden="true">
                <span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span><span>Help</span>
              </div>

              <div className="os-window-toolbar">
                <button type="button" onClick={closeWindow} className="os-back-button">
                  <FaArrowLeft aria-hidden="true" />
                  <span>Back</span>
                </button>
                <div className="os-address-bar" aria-label="Current folder">
                  <span>Address</span>
                  <b>›</b>
                  <span>JB_OS</span>
                  <b>›</b>
                  <span>Desktop</span>
                  <b>›</b>
                  <strong>Projects</strong>
                </div>
                <span className="os-item-count">{projects.length} files</span>
              </div>

              <div className="os-explorer-layout">
                <aside className="os-sidebar" aria-label="Project locations">
                  <p>QUICK ACCESS</p>
                  <button type="button" className="is-active" aria-current="page">
                    <FaFolderOpen aria-hidden="true" /> Projects
                  </button>
                  <div className="os-storage-meter">
                    <span>PORTFOLIO DRIVE</span>
                    <div><i /></div>
                    <small>{projects.length} builds available</small>
                  </div>
                </aside>

                <div className="os-explorer-content">
                  <div className="os-files" role="group" aria-label="Project files">
                    {projects.map((project, index) => {
                      const isSelected = selectedIndex === index
                      return (
                        <button
                          type="button"
                          key={project.fileName}
                          onClick={() => setSelectedIndex(index)}
                          className={`os-project-file ${isSelected ? 'is-selected' : ''}`}
                          aria-pressed={isSelected}
                        >
                          <span className="os-project-file-icon" aria-hidden="true">
                            <FaFileCode />
                            <small>{project.fileType}</small>
                          </span>
                          <strong>{project.fileName}</strong>
                          <span>{project.tags.slice(0, 2).join(' · ')}</span>
                        </button>
                      )
                    })}
                  </div>

                  <article className="os-preview" aria-live="polite">
                    <div className="os-preview-kicker">
                      <span>FILE PREVIEW</span>
                      <span>{String(selectedIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
                    </div>

                    {selected.image ? (
                      <BlurImage
                        key={selected.image}
                        src={selected.image}
                        alt={`${selected.title} screenshot`}
                        className="os-preview-image"
                        aspectRatio={selected.imageAspectRatio}
                      />
                    ) : (
                      <div className="os-preview-placeholder">
                        <FaFileCode aria-hidden="true" />
                        <span>PREVIEW_NOT_AVAILABLE.PNG</span>
                      </div>
                    )}

                    <div className="os-preview-body">
                      <p className="os-file-path">PROJECTS/{selected.fileName}</p>
                      <h3>{selected.title}</h3>
                      <p>{selected.overview ?? selected.description}</p>

                      <ul aria-label="Technologies used">
                        {selected.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>

                      <div className="os-preview-actions">
                        {selected.repo && (
                          <a href={selected.repo} target="_blank" rel="noreferrer">
                            <FaGithub aria-hidden="true" /> View source
                          </a>
                        )}
                        {selected.demoStatus ? (
                          <span aria-disabled="true">{selected.demoStatus}</span>
                        ) : selected.link ? (
                          <a href={selected.link} target="_blank" rel="noreferrer">
                            <FaArrowUpRightFromSquare aria-hidden="true" /> {selected.linkLabel ?? 'Live demo'}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </div>
              </div>

              <div className="os-window-statusbar">
                <span>{selected.fileName} selected</span>
                <span>SOURCE: {selected.repo ? 'AVAILABLE' : 'PRIVATE'}</span>
              </div>
            </div>
          )}

          {arcadeGame && <ArcadeWindow key={arcadeGame} game={arcadeGame} minimized={arcadeMinimized} onMinimize={() => setArcadeMinimized(true)} onClose={() => { setArcadeGame(null); setArcadeMinimized(false) }} />}

          <div className="os-taskbar">
            <button type="button" className="os-start-button" onClick={openFolder}>
              <span className="os-start-mark" aria-hidden="true"><i /><i /><i /><i /></span>
              Start
            </button>
            <div className="os-quick-launch">
              <button type="button" onClick={openFolder} aria-label="Open Projects">
                <FaFolder aria-hidden="true" />
              </button>
            </div>
            {folderOpen && (
              <button
                type="button"
                className="os-task-button"
                data-active={!windowMinimized}
                aria-pressed={!windowMinimized}
                onClick={() => { if (windowMinimized && arcadeGame) setArcadeMinimized(true); setWindowMinimized((current) => !current) }}
              >
                <FaFolderOpen aria-hidden="true" /> Projects
              </button>
            )}
            {arcadeGame && <button type="button" className="os-task-button os-task-button--arcade" data-active={!arcadeMinimized} aria-pressed={!arcadeMinimized} onClick={() => { if (arcadeMinimized && folderOpen) setWindowMinimized(true); setArcadeMinimized((current) => !current) }}><ArcadeIcon game={arcadeGame} />{arcadeTitles[arcadeGame]}</button>}
            <div className="os-system-tray">
              <span aria-hidden="true" /> ONLINE
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
