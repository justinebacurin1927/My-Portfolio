import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import {
  BOARD_SIZE,
  STEP_TIME,
  canTurn,
  createSnake,
  stepSnake,
  type Direction,
  type SnakeState,
} from '../../games/snake'

const keys: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
}
const BEST_KEY = 'justine-room-snake-best'

function readBest() {
  try {
    return Math.max(0, Number(localStorage.getItem(BEST_KEY)) || 0)
  } catch {
    return 0
  }
}

export default function SnakeGame({ active }: { active: boolean }) {
  const [game, setGame] = useState(createSnake)
  const [best, setBest] = useState(readBest)
  const gameRef = useRef(game)
  const queueRef = useRef<Direction[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controlRef = useRef<HTMLDivElement>(null)
  const swipeRef = useRef<{ x: number; y: number } | null>(null)

  const update = (next: SnakeState) => {
    gameRef.current = next
    setGame(next)
  }
  const pause = () => {
    if (gameRef.current.phase === 'playing') update({ ...gameRef.current, phase: 'paused' })
  }
  const start = () => {
    queueRef.current = []
    update({ ...createSnake(), phase: 'playing' })
    controlRef.current?.focus({ preventScroll: true })
  }
  const resume = () => {
    update({ ...gameRef.current, phase: 'playing' })
    controlRef.current?.focus({ preventScroll: true })
  }
  const turn = (direction: Direction) => {
    const current = queueRef.current.at(-1) ?? gameRef.current.direction
    if (
      gameRef.current.phase === 'playing' &&
      queueRef.current.length < 2 &&
      direction !== current &&
      canTurn(current, direction)
    )
      queueRef.current.push(direction)
  }

  useEffect(() => {
    if (!active) {
      if (gameRef.current.phase === 'playing') {
        const next = { ...gameRef.current, phase: 'paused' } as SnakeState
        gameRef.current = next
        setGame(next)
      }
      return
    }
    const timer = window.setInterval(() => {
      if (gameRef.current.phase !== 'playing' || document.hidden) return
      const next = stepSnake(gameRef.current, queueRef.current.shift())
      gameRef.current = next
      setGame(next)
    }, STEP_TIME)
    const onHidden = () => {
      if (document.hidden && gameRef.current.phase === 'playing') {
        const next = { ...gameRef.current, phase: 'paused' } as SnakeState
        gameRef.current = next
        setGame(next)
      }
    }
    document.addEventListener('visibilitychange', onHidden)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onHidden)
    }
  }, [active])

  useEffect(() => {
    if (game.score <= best) return
    setBest(game.score)
    try {
      localStorage.setItem(BEST_KEY, String(game.score))
    } catch {
      /* Storage is optional. */
    }
  }, [game.score, best])

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d')
    if (!context) return
    const size = 16
    context.fillStyle = '#101c22'
    context.fillRect(0, 0, 320, 320)
    for (let y = 0; y < BOARD_SIZE; y++)
      for (let x = 0; x < BOARD_SIZE; x++) {
        if ((x + y) % 2 === 0) {
          context.fillStyle = '#14262b'
          context.fillRect(x * size, y * size, size, size)
        }
      }
    if (game.food) {
      const { x, y } = game.food
      context.fillStyle = '#f5cf72'
      context.fillRect(x * size + 5, y * size + 2, 6, 12)
      context.fillRect(x * size + 2, y * size + 5, 12, 6)
      context.fillStyle = '#fff0b0'
      context.fillRect(x * size + 5, y * size + 5, 4, 4)
    }
    game.snake.forEach((cell, index) => {
      context.fillStyle = index === 0 ? '#bce987' : '#65af80'
      context.fillRect(cell.x * size + 1, cell.y * size + 1, 14, 14)
      context.fillStyle = index === 0 ? '#e0f5a7' : '#88c991'
      context.fillRect(cell.x * size + 2, cell.y * size + 2, 11, 3)
      if (index === 0) {
        const horizontal = game.direction === 'left' || game.direction === 'right'
        const edge = game.direction === 'left' || game.direction === 'up' ? 4 : 10
        context.fillStyle = '#172b32'
        for (const offset of [4, 10])
          context.fillRect(
            cell.x * size + (horizontal ? edge : offset),
            cell.y * size + (horizontal ? offset : edge),
            2,
            2,
          )
      }
    })
  }, [game])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLButtonElement && (event.key === ' ' || event.key === 'Enter'))
      return
    const direction = keys[event.key] ?? keys[event.key.toLowerCase()]
    if (direction) {
      event.preventDefault()
      turn(direction)
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      if (gameRef.current.phase === 'playing') pause()
      else if (gameRef.current.phase === 'paused') resume()
      else start()
    } else if (event.key.toLowerCase() === 'r') {
      event.preventDefault()
      start()
    } else if (event.key === 'Escape' && gameRef.current.phase === 'playing') {
      event.preventDefault()
      event.stopPropagation()
      pause()
    }
  }

  const finishSwipe = (event: PointerEvent) => {
    const start = swipeRef.current
    swipeRef.current = null
    if (!start) return
    const dx = event.clientX - start.x,
      dy = event.clientY - start.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 12) return
    turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up')
  }

  return (
    <div
      className="arcade-snake-layout"
      ref={controlRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="group"
      aria-label="Snake game"
      data-phase={game.phase}
    >
      <div className="arcade-snake-main">
        <div className="arcade-scorebar">
          <span>
            SCORE <strong>{String(game.score).padStart(3, '0')}</strong>
          </span>
          <span>
            BEST <strong>{String(best).padStart(3, '0')}</strong>
          </span>
        </div>
        <div
          className="arcade-snake-board"
          onPointerDown={(event) => {
            if (
              event.target !== canvasRef.current ||
              gameRef.current.phase !== 'playing' ||
              !event.isPrimary
            )
              return
            swipeRef.current = { x: event.clientX, y: event.clientY }
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerUp={finishSwipe}
          onPointerCancel={() => {
            swipeRef.current = null
          }}
        >
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            role="img"
            aria-label={`Snake board. Score ${game.score}.`}
          />
          {game.phase !== 'playing' && (
            <div className="arcade-board-cover">
              <span className="arcade-small-label">
                {game.phase === 'ready'
                  ? 'ROOM ARCADE'
                  : game.phase === 'paused'
                    ? 'TAKE YOUR TIME'
                    : 'ROUND COMPLETE'}
              </span>
              <h3>
                {game.phase === 'ready'
                  ? 'Snake'
                  : game.phase === 'paused'
                    ? 'Paused'
                    : game.phase === 'won'
                      ? 'Perfect game!'
                      : 'Game over'}
              </h3>
              <p>
                {game.phase === 'ready'
                  ? 'Chase the stars. Watch your tail.'
                  : game.phase === 'paused'
                    ? 'Your snake is waiting.'
                    : `You scored ${game.score} points.`}
              </p>
              <button
                type="button"
                className="arcade-action"
                onClick={game.phase === 'paused' ? resume : start}
              >
                {game.phase === 'paused'
                  ? 'Resume'
                  : game.phase === 'ready'
                    ? 'Play Snake'
                    : 'Play again'}
              </button>
            </div>
          )}
        </div>
        <p className="arcade-round-status" role="status">
          {game.phase === 'lost'
            ? `Game over. Final score: ${game.score}.`
            : game.phase === 'won'
              ? 'You filled the entire board!'
              : ''}
        </p>
      </div>
      <aside className="arcade-snake-controls">
        <h3>A little break.</h3>
        <p>Collect golden stars to grow. Avoid the walls and your own tail.</p>
        <div className="arcade-dpad" aria-label="Snake direction controls">
          {(['up', 'left', 'down', 'right'] as Direction[]).map((direction) => (
            <button
              type="button"
              key={direction}
              className={`arcade-direction arcade-direction--${direction}`}
              onClick={() => turn(direction)}
              disabled={game.phase !== 'playing'}
              aria-label={`Move ${direction}`}
            >
              {{ up: '↑', left: '←', down: '↓', right: '→' }[direction]}
            </button>
          ))}
        </div>
        <div className="arcade-game-actions">
          <button
            type="button"
            className="arcade-action arcade-action--quiet"
            disabled={game.phase !== 'playing' && game.phase !== 'paused'}
            onClick={game.phase === 'paused' ? resume : pause}
          >
            {game.phase === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button type="button" className="arcade-action arcade-action--quiet" onClick={start}>
            Restart
          </button>
        </div>
        <p className="arcade-key-hint">
          Arrows / WASD · Space to pause
          <br />
          Swipe the board on mobile.
        </p>
      </aside>
    </div>
  )
}
