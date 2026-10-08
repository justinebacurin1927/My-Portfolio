import { useEffect, useState, type MouseEvent } from 'react'
import { profile } from '../data'
import RoomPets from './RoomPets'
import RoomPhotoViewer, { type RoomPhoto } from './RoomPhotoViewer'
import PixelCalendarIcon from './PixelCalendarIcon'
import RoomDaylight from './RoomDaylight'
import type { RoomApp, RoomTheme } from '../types/room'

type Props = {
  onOpenApp: (target: RoomApp) => void
  roomTheme: RoomTheme
  onToggleTheme: () => void
}

const computerPath =
  'M35 11H248V16H252V28H263V131H252V161H215V179H60V161H30V33H33V17H35Z M22 181H223L235 216L230 221H11L8 216Z'
const moonPath =
  'M28 6H36V11H42V16H47V20H50V24H53V41H51V47H47V51H42V55H38V59H14V55H27V51H32V47H37V41H42V21H38V16H37V14H32V11H27V7H28Z'
const sunPath =
  'M30 15H42V19H48V25H52V39H48V45H42V49H30V45H24V39H20V25H24V19H30Z M33 3H39V11H33Z M33 53H39V61H33Z M5 29H14V35H5Z M58 29H67V35H58Z M13 11H19V17H13Z M53 11H59V17H53Z M13 47H19V53H13Z M53 47H59V53H53Z'
const pencilHolderPath =
  'M7 38H12V16H16V12H21V19H27V25H34V15H38V7H43V12H47V30H52V35H57V78H53V84H11V81H7Z'
const catPortrait = {
  src: `${import.meta.env.BASE_URL}photos/orange-cat-frame-pixel.webp`,
  alt: 'Pixel portrait of Orange, an orange tabby cat with her tongue out and a raised paw',
  label: 'Orange portrait',
  caption: 'Orange',
  aspectRatio: 2 / 3,
}
const cuddlingCatsPortrait = {
  src: `${import.meta.env.BASE_URL}photos/cuddling-cats-frame-pixel.webp`,
  alt: 'Pixel portrait of Orange sleeping with her arm around Zoro, a gray tabby cat',
  label: 'Orange and Zoro portrait',
  caption: 'Orange & Zoro',
  aspectRatio: 1,
}
const arkoPortrait = {
  src: `${import.meta.env.BASE_URL}brand/arko-frame-pixel-wall.png`,
  alt: 'Pixel-art ARKO logo in lime and black on a dark purple background',
  label: 'ARKO logo portrait',
  aspectRatio: 1122 / 1402,
}
const skyPanes = [
  {
    position: 'left-first',
    stars: [
      [27, 24, 0],
      [68, 58, -1.7],
      [87, 33, -3.2],
    ],
    comet: false,
  },
  {
    position: 'left-second',
    stars: [
      [32, 31, -0.9],
      [64, 15, -2.5],
      [72, 63, -4.1],
    ],
    comet: true,
  },
  {
    position: 'right-first',
    stars: [
      [52, 18, -1.3],
      [80, 68, -3.5],
      [18, 75, -2.1],
    ],
    comet: true,
  },
  {
    position: 'right-second',
    stars: [
      [72, 22, -2.8],
      [27, 72, -0.4],
      [91, 57, -4.6],
    ],
    comet: false,
  },
] as const
const roomClock = new Intl.DateTimeFormat('en-PH', {
  timeZone: 'Asia/Manila',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})

export default function Hero({ onOpenApp, roomTheme, onToggleTheme }: Props) {
  const [roomTime, setRoomTime] = useState(() => roomClock.format(new Date()).toUpperCase())
  const [selectedPhoto, setSelectedPhoto] = useState<RoomPhoto | null>(null)
  const themeAction = roomTheme === 'night' ? 'Switch to day' : 'Switch to night'
  const themePath = roomTheme === 'night' ? moonPath : sunPath

  useEffect(() => {
    let refreshTimer: number | undefined

    const refreshTime = () => {
      setRoomTime(roomClock.format(new Date()).toUpperCase())
      window.clearTimeout(refreshTimer)
      refreshTimer = window.setTimeout(refreshTime, 60_000 - (Date.now() % 60_000) + 50)
    }

    refreshTime()
    document.addEventListener('visibilitychange', refreshTime)

    return () => {
      window.clearTimeout(refreshTimer)
      document.removeEventListener('visibilitychange', refreshTime)
    }
  }, [])

  const openRoomApp = (event: MouseEvent<HTMLAnchorElement>, target: RoomApp) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onOpenApp(target)
  }

  return (
    <section className="pixel-room-hero" aria-label="Justine's pixel developer room">
      <div className="pixel-room-scene">
        <div className="room-scene-art">
          <div className="room-window-effects room-window-effects--night" aria-hidden="true">
            {skyPanes.map(({ position, stars, comet }) => (
              <div className={`room-window-pane room-window-pane--${position}`} key={position}>
                {stars.map(([left, top, delay]) => (
                  <span
                    className="room-sky-star"
                    key={`${left}-${top}`}
                    style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }}
                  />
                ))}
                {comet && <span className="room-sky-comet" />}
              </div>
            ))}
          </div>
          <RoomDaylight />
          <a
            href="#projects"
            onClick={(event) => openRoomApp(event, 'projects')}
            className="room-object-link room-computer-hotspot"
            aria-label="Open Projects on the room computer"
          >
            <svg viewBox="0 0 280 230" aria-hidden="true">
              <path className="room-object-outline" d={computerPath} />
            </svg>
          </a>

          <button
            type="button"
            onClick={onToggleTheme}
            className="room-object-link room-theme-hotspot"
            aria-label={themeAction}
          >
            <svg viewBox="0 0 64 72" aria-hidden="true">
              <path className="room-object-halo" d={themePath} />
              <path className="room-object-outline" d={themePath} />
            </svg>
          </button>

          <a
            href="#about"
            onClick={(event) => openRoomApp(event, 'about')}
            className="room-object-link room-about-hotspot"
            aria-label="Open About me from the wall picture frame"
          >
            <span className="room-about-picture room-about-picture--night" aria-hidden="true" />
            <span className="room-about-picture room-about-picture--day" aria-hidden="true" />
            <img
              className="room-about-artwork"
              src={`${import.meta.env.BASE_URL}photos/paramore-frame-pixel.webp`}
              alt="Pixel-art group portrait of the band Paramore"
            />
          </a>

          <button
            className="room-cat-frame"
            type="button"
            aria-label="View Orange portrait full screen"
            onClick={() => setSelectedPhoto(catPortrait)}
          >
            <img className="room-cat-artwork" src={catPortrait.src} alt={catPortrait.alt} />
          </button>

          <button
            className="room-cat-frame room-cat-frame--cuddling"
            type="button"
            aria-label="View Orange and Zoro portrait full screen"
            onClick={() => setSelectedPhoto(cuddlingCatsPortrait)}
          >
            <img
              className="room-cat-artwork"
              src={cuddlingCatsPortrait.src}
              alt={cuddlingCatsPortrait.alt}
            />
          </button>

          <button
            type="button"
            className="room-studio-frame"
            aria-label="View ARKO logo portrait full screen"
            onClick={() => setSelectedPhoto(arkoPortrait)}
          >
            <img className="room-studio-artwork" src={arkoPortrait.src} alt={arkoPortrait.alt} />
          </button>

          <a
            href="#contact"
            onClick={(event) => openRoomApp(event, 'contact')}
            className="room-object-link room-contact-hotspot"
            aria-label="Write a letter from the pencil holder"
          >
            <svg viewBox="0 0 64 88" aria-hidden="true">
              <path className="room-object-halo" d={pencilHolderPath} />
              <path className="room-object-outline" d={pencilHolderPath} />
            </svg>
          </a>

          <a
            href="#calendar"
            onClick={(event) => openRoomApp(event, 'calendar')}
            className="room-object-link room-calendar-hotspot"
            aria-label="Open GitHub activity from the wall calendar"
          >
            <PixelCalendarIcon />
          </a>
        </div>

        <nav className="room-compact-controls" aria-label="Room controls">
          <a
            href="#about"
            onClick={(event) => openRoomApp(event, 'about')}
            className="room-compact-action"
          >
            About me
          </a>
          <a
            href="#calendar"
            onClick={(event) => openRoomApp(event, 'calendar')}
            className="room-compact-action room-compact-calendar"
            aria-label="Open GitHub activity calendar"
          >
            <PixelCalendarIcon />
          </a>
          <a
            href="#contact"
            onClick={(event) => openRoomApp(event, 'contact')}
            className="room-compact-action room-compact-contact"
            aria-label="Write me a letter"
          >
            <svg viewBox="0 0 16 12" fill="none" shapeRendering="crispEdges" aria-hidden="true">
              <path d="M1 1H15V11H1Z M2 2H4V4H6V6H10V4H12V2H14" stroke="currentColor" />
            </svg>
          </a>
          <button
            type="button"
            onClick={onToggleTheme}
            className="room-compact-action room-compact-theme"
            aria-label={themeAction}
          >
            <svg viewBox="0 0 72 72" aria-hidden="true">
              <path d={themePath} />
            </svg>
          </button>
        </nav>

        <a
          href="#welcome"
          onClick={(event) => openRoomApp(event, 'welcome')}
          className="room-wall-profile-frame"
          aria-label={`Open ${profile.name}'s welcome window`}
        >
          <img src={profile.pixelPhoto} alt={`Pixel portrait of ${profile.name}`} />
        </a>

        <RoomPets />

        <div className="room-scene-caption">JUSTINE'S ROOM // {roomTime} PHT</div>
      </div>
      {selectedPhoto && (
        <RoomPhotoViewer {...selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
    </section>
  )
}
