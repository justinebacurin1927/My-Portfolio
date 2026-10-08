import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import PantherScratch from './PantherScratch'

type PantherState = 'watching' | 'leaving' | 'away' | 'returning'

const CHOPPER_HEAD_UP_MS = 2_000
const PANTHER_TRAVEL_MS = 1_800
const PET_IMAGES = {
  chopper: `${import.meta.env.BASE_URL}pets/chopper-sprites.webp`,
  pantherSitting: `${import.meta.env.BASE_URL}pets/panther-sitting.webp`,
  pantherFront: `${import.meta.env.BASE_URL}pets/panther-walk-front-natural.webp`,
  pantherBack: `${import.meta.env.BASE_URL}pets/panther-walk-back-natural.webp`,
}

function PetShadow() {
  return (
    <svg
      className="room-pet-shadow"
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14 3H78V5H90V8H98V15H90V19H78V21H14V19H6V16H0V9H6V6H14Z" opacity="0.2" />
      <path d="M20 6H76V8H86V10H92V15H82V18H20V16H10V10H20Z" opacity="0.3" />
      <path d="M26 9H70V10H80V14H72V16H24V14H16V11H26Z" opacity="0.5" />
    </svg>
  )
}

export default function RoomPets() {
  const [chopperAwake, setChopperAwake] = useState(false)
  const [pantherState, setPantherState] = useState<PantherState>('watching')
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const groupRef = useRef<HTMLDivElement>(null)
  const pantherRef = useRef<HTMLButtonElement>(null)
  const pantherDelay = reducedMotion ? 0 : PANTHER_TRAVEL_MS
  const returnPanther = useCallback(() => {
    setPantherState((state) => (state === 'away' ? 'returning' : state))
  }, [])

  useEffect(() => {
    Object.values(PET_IMAGES).forEach((src) => {
      const image = new Image()
      image.src = src
    })
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(preference.matches)
    preference.addEventListener('change', updateMotion)
    return () => preference.removeEventListener('change', updateMotion)
  }, [])

  useEffect(() => {
    if (!chopperAwake) return
    const timer = window.setTimeout(() => setChopperAwake(false), CHOPPER_HEAD_UP_MS)
    return () => window.clearTimeout(timer)
  }, [chopperAwake])

  useEffect(() => {
    if (pantherState === 'watching' || pantherState === 'away') return
    const next: Record<Exclude<PantherState, 'watching' | 'away'>, PantherState> = {
      leaving: 'away',
      returning: 'watching',
    }
    const timer = window.setTimeout(() => setPantherState(next[pantherState]), pantherDelay)
    return () => window.clearTimeout(timer)
  }, [pantherState, pantherDelay])

  const sendPantherOutside = () => {
    if (pantherState !== 'watching' || !pantherRef.current) return
    if (document.activeElement === pantherRef.current)
      groupRef.current?.focus({ preventScroll: true })
    setPantherState('leaving')
  }

  return (
    <div
      className="room-pets"
      ref={groupRef}
      tabIndex={-1}
      role="group"
      aria-label="Chopper and Panther"
      style={
        {
          '--chopper-sprites': `url("${PET_IMAGES.chopper}")`,
          '--panther-sitting': `url("${PET_IMAGES.pantherSitting}")`,
          '--panther-front': `url("${PET_IMAGES.pantherFront}")`,
          '--panther-back': `url("${PET_IMAGES.pantherBack}")`,
        } as CSSProperties
      }
    >
      {pantherState === 'away' && (
        <PantherScratch reducedMotion={reducedMotion} onComplete={returnPanther} />
      )}
      <button
        className="room-pet room-pet--chopper"
        type="button"
        data-state={chopperAwake ? 'awake' : 'sleeping'}
        aria-label={chopperAwake ? 'Chopper is settling back to sleep' : 'Chopper: lift his head'}
        aria-disabled={chopperAwake}
        onClick={() => {
          if (!chopperAwake) setChopperAwake(true)
        }}
      >
        <PetShadow />
        <span className="room-pet-sprite" aria-hidden="true" />
        <span className="room-pet-name" aria-hidden="true">
          Chopper
        </span>
        {!chopperAwake && (
          <span className="room-pet-sleep-cloud" aria-hidden="true">
            <svg viewBox="0 0 96 64" shapeRendering="crispEdges">
              <path d="M20 12H28V6H44V2H60V6H72V12H82V20H88V34H82V42H46V48H34V54H26V42H14V36H8V22H14V12Z" />
            </svg>
            <span className="room-pet-sleep-text">
              <span>z</span>
              <span>Z</span>
              <span>Z</span>
            </span>
          </span>
        )}
      </button>

      <button
        ref={pantherRef}
        className="room-pet room-pet--panther"
        type="button"
        data-state={pantherState}
        aria-label={
          pantherState === 'watching' ? 'Panther: let him explore' : 'Panther is exploring'
        }
        aria-disabled={pantherState !== 'watching'}
        aria-hidden={pantherState === 'away'}
        tabIndex={pantherState === 'watching' ? 0 : -1}
        onClick={sendPantherOutside}
        style={
          {
            '--panther-travel-time': `${reducedMotion ? 0 : PANTHER_TRAVEL_MS}ms`,
          } as CSSProperties
        }
      >
        <PetShadow />
        <span className="room-pet-sprite" aria-hidden="true" />
        <span className="room-pet-name" aria-hidden="true">
          Panther
        </span>
        {(pantherState === 'watching' || pantherState === 'leaving') && (
          <svg
            className="room-pet-nose-detail"
            viewBox="0 0 6 10"
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            <path fill="#708253" d="M0 0H4V2H6V8H4V10H0V8H2V6H0Z" />
            <path fill="#d5e598" d="M1 0H3V3H5V7H3V9H1V7H3V5H1Z" />
            <path fill="#f4f7cf" d="M1 0H2V3H1ZM3 4H4V6H3Z" />
          </svg>
        )}
      </button>
    </div>
  )
}
