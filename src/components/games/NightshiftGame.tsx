import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import {
  createMaze,
  fireMaze,
  remainingEnemies,
  stepMaze,
  type MazeState,
} from '../../games/nightshift'
import { createMazeArt, drawMaze } from '../../games/nightshift-render'

const snapshot = (game: MazeState) => ({
  phase: game.phase,
  health: game.player.health,
  remaining: remainingEnemies(game),
  seconds: Math.floor(game.elapsed),
})

export default function NightshiftGame({ active }: { active: boolean }) {
  const worldRef = useRef(createMaze())
  const [hud, setHud] = useState(() => snapshot(worldRef.current))
  const [captured, setCaptured] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const keysRef = useRef(new Set<string>())
  const wasLockedRef = useRef(false)
  const dragRef = useRef<{ x: number } | null>(null)
  const artRef = useRef<ReturnType<typeof createMazeArt> | null>(null)
  const dirtyRef = useRef(true)

  const publish = () => {
    const next = snapshot(worldRef.current)
    setHud((previous) =>
      previous.phase === next.phase &&
      previous.health === next.health &&
      previous.remaining === next.remaining &&
      previous.seconds === next.seconds
        ? previous
        : next,
    )
    dirtyRef.current = true
  }
  const releaseMouse = () => {
    if (document.pointerLockElement === canvasRef.current) document.exitPointerLock()
  }
  const captureMouse = () => {
    const canvas = canvasRef.current
    if (!canvas || !window.matchMedia('(pointer: fine)').matches || !canvas.requestPointerLock)
      return
    try {
      Promise.resolve(canvas.requestPointerLock()).catch(() => {
        /* Drag and arrow keys remain available. */
      })
    } catch {
      /* Pointer lock is optional. */
    }
  }
  const pause = () => {
    if (worldRef.current.phase === 'playing') worldRef.current.phase = 'paused'
    keysRef.current.clear()
    releaseMouse()
    publish()
  }
  const start = () => {
    worldRef.current = createMaze()
    worldRef.current.phase = 'playing'
    keysRef.current.clear()
    canvasRef.current?.focus({ preventScroll: true })
    publish()
    captureMouse()
  }
  const resume = () => {
    worldRef.current.phase = 'playing'
    canvasRef.current?.focus({ preventScroll: true })
    publish()
    captureMouse()
  }
  const shoot = () => {
    if (fireMaze(worldRef.current)) publish()
  }

  useEffect(() => {
    if (!active) {
      pause()
      return
    }
    const canvas = canvasRef.current,
      context = canvas?.getContext('2d')
    if (!canvas || !context) return
    artRef.current ??= createMazeArt()
    const heldKeys = keysRef.current
    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) {
        const resolution = Math.min(240, Math.max(72, Math.round((384 * height) / width)))
        if (canvas.height !== resolution) {
          canvas.height = resolution
          dirtyRef.current = true
        }
      }
    })
    resizeObserver.observe(canvas)
    let frameId = 0,
      previousTime = 0,
      previousHudTime = 0
    const frame = (time: number) => {
      const dt = previousTime ? (time - previousTime) / 1000 : 0
      previousTime = time
      const keys = heldKeys,
        world = worldRef.current
      if (world.phase === 'playing' && !document.hidden) {
        const input = {
          forward:
            Number(keys.has('w') || keys.has('arrowup')) -
            Number(keys.has('s') || keys.has('arrowdown')),
          strafe: Number(keys.has('d')) - Number(keys.has('a')),
          turn: Number(keys.has('arrowright')) - Number(keys.has('arrowleft')),
        }
        const elapsed = Math.min(0.15, Math.max(0, dt)),
          steps = Math.max(1, Math.ceil(elapsed / 0.035))
        for (let step = 0; step < steps; step++) {
          stepMaze(world, elapsed / steps, input)
          if (keys.has('fire')) fireMaze(world)
        }
        if (world.phase !== 'playing') {
          keys.clear()
          releaseMouse()
          publish()
        }
        drawMaze(context, world, artRef.current!)
        if (time - previousHudTime > 100) {
          previousHudTime = time
          publish()
        }
      } else if (dirtyRef.current) {
        drawMaze(context, world, artRef.current!)
        dirtyRef.current = false
      }
      frameId = requestAnimationFrame(frame)
    }
    const mouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement === canvas && worldRef.current.phase === 'playing')
        worldRef.current.player.angle += event.movementX * 0.0035
    }
    const onLock = () => {
      const locked = document.pointerLockElement === canvas
      setCaptured(locked)
      if (wasLockedRef.current && !locked) pause()
      wasLockedRef.current = locked
    }
    const onHidden = () => {
      if (document.hidden) pause()
    }
    frameId = requestAnimationFrame(frame)
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('pointerlockchange', onLock)
    document.addEventListener('visibilitychange', onHidden)
    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('pointerlockchange', onLock)
      document.removeEventListener('visibilitychange', onHidden)
      heldKeys.clear()
      wasLockedRef.current = false
      releaseMouse()
    }
  }, [active])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLButtonElement && (event.key === ' ' || event.key === 'Enter'))
      return
    const key = event.key.toLowerCase()
    if (
      ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)
    ) {
      event.preventDefault()
      if (worldRef.current.phase === 'playing') keysRef.current.add(key === ' ' ? 'fire' : key)
    } else if (key === 'escape' || key === 'p') {
      event.preventDefault()
      event.stopPropagation()
      pause()
    }
  }
  const moveLook = (event: PointerEvent<HTMLCanvasElement>) => {
    if (
      !dragRef.current ||
      document.pointerLockElement === canvasRef.current ||
      worldRef.current.phase !== 'playing'
    )
      return
    worldRef.current.player.angle += (event.clientX - dragRef.current.x) * 0.009
    dragRef.current.x = event.clientX
  }
  const hold = (event: PointerEvent<HTMLButtonElement>, key: string) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    keysRef.current.add(key)
  }
  const playing = hud.phase === 'playing'
  const moveButton = (key: string, label: string, symbol: string, direction: string) => (
    <button
      type="button"
      className={`arcade-direction arcade-direction--${direction}`}
      disabled={!playing}
      aria-label={label}
      onPointerDown={(event) => hold(event, key)}
      onPointerUp={() => keysRef.current.delete(key)}
      onPointerCancel={() => keysRef.current.delete(key)}
      onLostPointerCapture={() => keysRef.current.delete(key)}
    >
      {symbol}
    </button>
  )

  return (
    <div
      className="arcade-nightshift"
      ref={groupRef}
      tabIndex={0}
      role="group"
      aria-label="Nightshift maze shooter"
      data-phase={hud.phase}
      onKeyDown={onKeyDown}
      onKeyUp={(event) =>
        keysRef.current.delete(event.key === ' ' ? 'fire' : event.key.toLowerCase())
      }
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) keysRef.current.clear()
      }}
    >
      <div className="nightshift-main">
        <div className="arcade-scorebar nightshift-scorebar">
          <span>
            HEALTH <strong data-health={hud.health}>{hud.health}</strong>
          </span>
          <span>
            SENTINELS <strong>{hud.remaining}</strong>
          </span>
          <span>
            TIME{' '}
            <strong>
              {Math.floor(hud.seconds / 60)}:{String(hud.seconds % 60).padStart(2, '0')}
            </strong>
          </span>
        </div>
        <div className="nightshift-viewport">
          <canvas
            ref={canvasRef}
            width={384}
            height={240}
            tabIndex={0}
            role="img"
            aria-label="First-person maze view. Drag to look; use the movement and fire controls."
            onPointerDown={(event) => {
              if (!playing) return
              canvasRef.current?.focus({ preventScroll: true })
              if (document.pointerLockElement === canvasRef.current) {
                if (event.button === 0) shoot()
              } else {
                dragRef.current = { x: event.clientX }
                event.currentTarget.setPointerCapture(event.pointerId)
              }
            }}
            onPointerMove={moveLook}
            onPointerUp={() => {
              dragRef.current = null
            }}
            onPointerCancel={() => {
              dragRef.current = null
            }}
            onContextMenu={(event) => event.preventDefault()}
          />
          {!playing && (
            <div className="arcade-board-cover nightshift-cover">
              <span className="arcade-small-label">
                {hud.phase === 'ready'
                  ? 'THE NIGHT SHIFT STARTS HERE'
                  : hud.phase === 'paused'
                    ? 'ON A BREAK'
                    : 'SHIFT REPORT'}
              </span>
              <h3>
                {hud.phase === 'ready'
                  ? 'Nightshift'
                  : hud.phase === 'paused'
                    ? 'Paused'
                    : hud.phase === 'won'
                      ? 'Shift complete!'
                      : 'Lights out.'}
              </h3>
              <p>
                {hud.phase === 'ready'
                  ? 'Clear 5 sentinels. Find the green exit.'
                  : hud.phase === 'paused'
                    ? 'Resume when you are ready.'
                    : hud.phase === 'won'
                      ? `All clear in ${hud.seconds} seconds.`
                      : 'The sentinels got you. Try another run.'}
              </p>
              <button
                type="button"
                className="arcade-action"
                onClick={hud.phase === 'paused' ? resume : start}
              >
                {hud.phase === 'paused'
                  ? 'Resume Nightshift'
                  : hud.phase === 'ready'
                    ? 'Play Nightshift'
                    : 'Play again'}
              </button>
            </div>
          )}
        </div>
        <p className="nightshift-objective" role="status">
          {hud.phase === 'won'
            ? 'You made it out!'
            : hud.phase === 'lost'
              ? 'Shift ended. Try again.'
              : hud.remaining === 0
                ? 'Exit open. Follow the green map marker.'
                : `${hud.remaining} sentinels left. Exit locked.`}
        </p>
      </div>
      <aside className="nightshift-controls">
        <button
          type="button"
          className="arcade-action nightshift-fire"
          disabled={!playing}
          onClick={shoot}
          onPointerDown={(event) => {
            hold(event, 'fire')
            shoot()
          }}
          onPointerUp={() => keysRef.current.delete('fire')}
          onPointerCancel={() => keysRef.current.delete('fire')}
          onLostPointerCapture={() => keysRef.current.delete('fire')}
        >
          Fire <span aria-hidden="true">✦</span>
        </button>
        <div className="arcade-dpad" aria-label="Maze movement controls">
          {moveButton('w', 'Walk forward', '↑', 'up')}
          {moveButton('a', 'Strafe left', '←', 'left')}
          {moveButton('s', 'Walk backward', '↓', 'down')}
          {moveButton('d', 'Strafe right', '→', 'right')}
        </div>
        <div className="arcade-game-actions">
          <button
            type="button"
            className="arcade-action arcade-action--quiet"
            disabled={hud.phase !== 'playing' && hud.phase !== 'paused'}
            onClick={hud.phase === 'paused' ? resume : pause}
          >
            {hud.phase === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button type="button" className="arcade-action arcade-action--quiet" onClick={start}>
            Restart
          </button>
        </div>
        <p className="arcade-key-hint">
          WASD to move · ← → to turn
          <br />
          {captured ? 'Space / click to fire' : 'Space / Fire to shoot'}
          <br />
          {captured ? 'Mouse to aim · Esc to pause' : 'Drag the view to aim'}
        </p>
      </aside>
    </div>
  )
}
