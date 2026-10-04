import { lazy, Suspense, useEffect, useRef } from 'react'
import ArcadeIcon from './ArcadeIcon'
import { arcadeTitles, type ArcadeGame } from '../games/catalog'

const SnakeGame = lazy(() => import('./games/SnakeGame'))
const NightshiftGame = lazy(() => import('./games/NightshiftGame'))
const TinycraftGame = lazy(() => import('./games/TinycraftGame'))

type Props = { game: ArcadeGame; minimized: boolean; onMinimize: () => void; onClose: () => void }

export default function ArcadeWindow({ game, minimized, onMinimize, onClose }: Props) {
  const windowRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<Element | null>(null)

  useEffect(() => {
    triggerRef.current = document.querySelector(`.os-game-launcher[data-game="${game}"]`) ?? document.activeElement
    return () => {
      const trigger = triggerRef.current?.isConnected ? triggerRef.current : document.querySelector(`.os-game-launcher[data-game="${game}"]`)
      if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true })
    }
  }, [game])

  useEffect(() => {
    if (!minimized) windowRef.current?.focus({ preventScroll: true })
    else {
      const trigger = triggerRef.current?.isConnected ? triggerRef.current : document.querySelector(`.os-game-launcher[data-game="${game}"]`)
      if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true })
    }
  }, [minimized, game])

  return <div ref={windowRef} className="os-arcade-window" data-minimized={minimized} tabIndex={-1} role="region" aria-label={`${arcadeTitles[game]} game window`} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose() } }}>
    <header className="os-window-titlebar">
      <div className="arcade-window-title"><ArcadeIcon game={game} /><span>{arcadeTitles[game].toUpperCase()}.EXE</span></div>
      <div className="os-window-controls"><button type="button" onClick={onMinimize} aria-label={`Minimize ${arcadeTitles[game]}`}>—</button><button type="button" onClick={onClose} aria-label={`Close ${arcadeTitles[game]}`}>×</button></div>
    </header>
    <div className="os-arcade-content"><Suspense fallback={<p className="arcade-loading" role="status">Loading game…</p>}>
      {game === 'snake' ? <SnakeGame active={!minimized} /> : game === 'nightshift' ? <NightshiftGame active={!minimized} /> : <TinycraftGame active={!minimized} />}
    </Suspense></div>
  </div>
}
