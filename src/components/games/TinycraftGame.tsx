import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { BLOCK, BLOCK_NAMES, BUILDING_BLOCKS, WORLD_SIZE, createCraftWorld, mineCraftBlock, placeCraftBlock, spawnCraftPlayer, stepCraftPlayer, targetCraftBlock, type BlockId } from '../../games/tinycraft'
import { createCraftRenderer } from '../../games/tinycraft-render'

type Phase = 'ready' | 'playing' | 'paused' | 'unavailable'
type Runtime = { wake: () => void; stop: () => void }
const COLORS: Record<number, string> = { 1: '#82a756', 3: '#9da4a0', 4: '#af8451', 5: '#547a4b', 6: '#b77165', 7: '#a9d8ca' }

export default function TinycraftGame({ active }: { active: boolean }) {
  const [session] = useState(() => { const world = createCraftWorld(); return { world, player: spawnCraftPlayer(world) } })
  const worldRef = useRef(session.world), playerRef = useRef(session.player)
  const canvasRef = useRef<HTMLCanvasElement>(null), runtimeRef = useRef<Runtime | null>(null)
  const keysRef = useRef(new Set<string>()), activeRef = useRef(active), phaseRef = useRef<Phase>('ready')
  const selectedRef = useRef<BlockId>(BLOCK.grass), wasLockedRef = useRef(false)
  const dragRef = useRef<{ x: number; y: number } | null>(null), dirtyRef = useRef(true)
  const [phase, setPhase] = useState<Phase>('ready'), [selected, setSelected] = useState<BlockId>(BLOCK.grass)
  const [captured, setCaptured] = useState(false), [confirmReset, setConfirmReset] = useState(false)
  const [status, setStatus] = useState('Build anything. Blocks are unlimited.')
  const [hud, setHud] = useState({ mined: 0, placed: 0, target: '', position: '' })

  const refresh = () => { dirtyRef.current = true; runtimeRef.current?.wake() }
  const updateHud = () => {
    const world = worldRef.current, player = playerRef.current, hit = targetCraftBlock(world, player)
    const next = { mined: world.mined, placed: world.placed, target: hit ? `${hit.x},${hit.y},${hit.z}:${hit.block}` : '', position: `${player.x.toFixed(2)},${player.y.toFixed(2)},${player.z.toFixed(2)}` }
    setHud(previous => previous.mined === next.mined && previous.placed === next.placed && previous.target === next.target && previous.position === next.position ? previous : next)
  }
  const releaseMouse = () => { if (document.pointerLockElement === canvasRef.current) document.exitPointerLock() }
  const changePhase = (next: Phase) => { phaseRef.current = next; setPhase(next); refresh() }
  const pause = () => {
    if (phaseRef.current === 'playing') changePhase('paused')
    keysRef.current.clear(); dragRef.current = null; releaseMouse()
  }
  const captureMouse = () => {
    const canvas = canvasRef.current
    if (!canvas || !window.matchMedia('(pointer: fine)').matches || !canvas.requestPointerLock) return
    try { Promise.resolve(canvas.requestPointerLock()).catch(() => { /* Keyboard and drag controls work without mouse capture. */ }) } catch { /* Optional browser capability. */ }
  }
  const play = () => {
    if (phaseRef.current === 'unavailable') return
    keysRef.current.clear(); setConfirmReset(false); changePhase('playing')
    canvasRef.current?.focus({ preventScroll: true }); captureMouse()
  }
  const selectBlock = (block: BlockId) => { selectedRef.current = block; setSelected(block) }
  const jump = () => {
    if (phaseRef.current === 'playing' && playerRef.current.grounded) {
      playerRef.current.velocityY = 7.4; playerRef.current.grounded = false
    }
  }
  const act = (action: 'mine' | 'place') => {
    if (phaseRef.current !== 'playing' || !activeRef.current) return
    const world = worldRef.current, player = playerRef.current, hit = targetCraftBlock(world, player)
    setStatus(action === 'mine' ? mineCraftBlock(world, hit) : placeCraftBlock(world, player, hit, selectedRef.current))
    updateHud(); refresh()
  }
  const returnToSpawn = () => {
    playerRef.current = spawnCraftPlayer(worldRef.current); keysRef.current.clear()
    setStatus('Back at the clearing.'); updateHud(); refresh()
  }
  const newWorld = () => {
    worldRef.current = createCraftWorld(); playerRef.current = spawnCraftPlayer(worldRef.current)
    setStatus('A fresh little world. Make it yours.'); updateHud(); play()
  }

  useEffect(() => {
    activeRef.current = active
    if (!active) { pause(); runtimeRef.current?.stop() }
    else refresh()
  }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let view: ReturnType<typeof createCraftRenderer>
    try { view = createCraftRenderer(canvas, worldRef.current) } catch {
      phaseRef.current = 'unavailable'; setPhase('unavailable'); return
    }
    const heldKeys = keysRef.current
    let frameId = 0, previousTime = 0, lastHudTime = 0
    const frame = (time: number) => {
      frameId = 0
      const playing = phaseRef.current === 'playing' && activeRef.current && !document.hidden
      if (playing) {
        const elapsed = previousTime ? Math.min(0.12, (time - previousTime) / 1000) : 0
        const input = {
          forward: Number(heldKeys.has('w')) - Number(heldKeys.has('s')),
          strafe: Number(heldKeys.has('d')) - Number(heldKeys.has('a')),
          turn: Number(heldKeys.has('arrowleft')) - Number(heldKeys.has('arrowright')),
          look: Number(heldKeys.has('arrowup')) - Number(heldKeys.has('arrowdown')),
          jump: heldKeys.has(' '),
        }
        const steps = Math.max(1, Math.ceil(elapsed / 0.025))
        for (let step = 0; step < steps; step++) stepCraftPlayer(worldRef.current, playerRef.current, elapsed / steps, input)
      }
      previousTime = playing ? time : 0
      if (playing || dirtyRef.current) {
        const rendered = view.render(worldRef.current, playerRef.current, targetCraftBlock(worldRef.current, playerRef.current))
        dirtyRef.current = false
        if (!rendered) { pause(); setStatus('The 3D view was interrupted. Resume to try again.'); return }
      }
      if (time - lastHudTime > 100 || !playing) { updateHud(); lastHudTime = time }
      if (playing) frameId = requestAnimationFrame(frame)
    }
    const wake = () => { if (!frameId && activeRef.current) frameId = requestAnimationFrame(frame) }
    const stop = () => { cancelAnimationFrame(frameId); frameId = 0; previousTime = 0 }
    runtimeRef.current = { wake, stop }
    const observer = new ResizeObserver(([entry]) => { view.resize(entry.contentRect.width, entry.contentRect.height); refresh() })
    observer.observe(canvas)
    const mouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== canvas || phaseRef.current !== 'playing') return
      playerRef.current.yaw -= event.movementX * 0.003
      playerRef.current.pitch = Math.max(-1.45, Math.min(1.45, playerRef.current.pitch - event.movementY * 0.003))
    }
    const onLock = () => {
      const locked = document.pointerLockElement === canvas
      setCaptured(locked)
      if (wasLockedRef.current && !locked) pause()
      wasLockedRef.current = locked
    }
    const onHidden = () => { if (document.hidden) pause() }
    const onBlur = () => pause()
    document.addEventListener('mousemove', mouseMove); document.addEventListener('pointerlockchange', onLock)
    document.addEventListener('visibilitychange', onHidden); window.addEventListener('blur', onBlur)
    wake()
    return () => {
      stop(); observer.disconnect(); runtimeRef.current = null
      document.removeEventListener('mousemove', mouseMove); document.removeEventListener('pointerlockchange', onLock)
      document.removeEventListener('visibilitychange', onHidden); window.removeEventListener('blur', onBlur)
      heldKeys.clear(); wasLockedRef.current = false; releaseMouse(); view.dispose()
    }
  }, [])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLButtonElement && (event.key === ' ' || event.key === 'Enter')) return
    const key = event.key.toLowerCase()
    if (key === 'escape' || key === 'p') { event.preventDefault(); event.stopPropagation(); pause(); return }
    if (confirmReset) return
    if (key >= '1' && key <= '6') { event.preventDefault(); selectBlock(BUILDING_BLOCKS[Number(key) - 1]); return }
    if (phaseRef.current !== 'playing') return
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) { event.preventDefault(); keysRef.current.add(key) }
    if (key === 'e' || key === 'q') { event.preventDefault(); if (!event.repeat) act(key === 'e' ? 'mine' : 'place') }
  }
  const hold = (event: PointerEvent<HTMLButtonElement>, key: string) => {
    event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); keysRef.current.add(key)
  }
  const moveButton = (key: string, label: string, symbol: string, direction: string) => <button type="button" className={`arcade-direction arcade-direction--${direction}`} disabled={phase !== 'playing'} aria-label={label} onPointerDown={(event) => hold(event, key)} onPointerUp={() => keysRef.current.delete(key)} onPointerCancel={() => keysRef.current.delete(key)} onLostPointerCapture={() => keysRef.current.delete(key)}>{symbol}</button>

  return <div className="arcade-tinycraft" role="group" aria-label="Tinycraft block building game" tabIndex={0} data-phase={phase} data-position={hud.position} data-target={hud.target} onKeyDown={onKeyDown} onKeyUp={(event) => keysRef.current.delete(event.key.toLowerCase())} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) keysRef.current.clear() }}>
    <div className="tinycraft-main">
      <div className="arcade-scorebar tinycraft-scorebar"><span>CREATIVE <strong>{WORLD_SIZE} × {WORLD_SIZE}</strong></span><span>MINED <strong>{hud.mined}</strong></span><span>BUILT <strong>{hud.placed}</strong></span></div>
      <div className="tinycraft-viewport">
        <canvas ref={canvasRef} tabIndex={0} role="img" aria-label="First-person block world. Drag to look around; aim the crosshair at a block to mine or build." onContextMenu={(event) => event.preventDefault()} onPointerDown={(event) => {
          if (phase !== 'playing') return
          event.currentTarget.focus({ preventScroll: true })
          if (document.pointerLockElement === canvasRef.current) { if (event.button === 0 || event.button === 2) act(event.button === 0 ? 'mine' : 'place') }
          else { dragRef.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId) }
        }} onPointerMove={(event) => {
          const drag = dragRef.current
          if (!drag || document.pointerLockElement === canvasRef.current || phase !== 'playing') return
          playerRef.current.yaw -= (event.clientX - drag.x) * 0.007
          playerRef.current.pitch = Math.max(-1.45, Math.min(1.45, playerRef.current.pitch - (event.clientY - drag.y) * 0.007))
          dragRef.current = { x: event.clientX, y: event.clientY }
        }} onPointerUp={() => { dragRef.current = null }} onPointerCancel={() => { dragRef.current = null }} onLostPointerCapture={() => { dragRef.current = null }} />
        {phase === 'playing' && <span className="tinycraft-crosshair" aria-hidden="true">+</span>}
        {(phase !== 'playing' || confirmReset) && <div className="arcade-board-cover tinycraft-cover">
          <span className="arcade-small-label">YOUR LITTLE BLOCK WORLD</span>
          <h3>{confirmReset ? 'A fresh world?' : phase === 'ready' ? 'Tinycraft' : phase === 'unavailable' ? '3D unavailable' : 'Paused'}</h3>
          <p>{confirmReset ? 'This replaces what you have built in this session.' : phase === 'unavailable' ? 'This browser could not start the 3D view. Try a browser with WebGL enabled.' : phase === 'ready' ? 'Explore, mine, and build. Six materials, endless ideas.' : 'Your world is waiting right here.'}</p>
          {phase !== 'unavailable' && <div className="tinycraft-cover-actions">{confirmReset ? <><button type="button" className="arcade-action arcade-action--quiet" onClick={play}>Keep building</button><button type="button" className="arcade-action" onClick={newWorld}>New world</button></> : <button type="button" className="arcade-action" onClick={play}>{phase === 'ready' ? 'Play Tinycraft' : 'Resume Tinycraft'}</button>}</div>}
        </div>}
      </div>
      <div className="tinycraft-hotbar" aria-label="Building materials">
        {BUILDING_BLOCKS.map((block, index) => <button key={block} type="button" aria-label={`Select ${BLOCK_NAMES[block].toLowerCase()} (${index + 1})`} aria-pressed={selected === block} className="tinycraft-slot" data-block={block} onClick={() => selectBlock(block)} style={{ '--block-color': COLORS[block] } as CSSProperties}><span className="tinycraft-block-chip" aria-hidden="true" /><span>{BLOCK_NAMES[block]}</span><kbd aria-hidden="true">{index + 1}</kbd></button>)}
      </div>
      <p className="tinycraft-status" role="status">{status}</p>
    </div>
    <aside className="tinycraft-controls">
      <div className="arcade-dpad" aria-label="Block world movement controls">{moveButton('w', 'Walk forward', '↑', 'up')}{moveButton('a', 'Strafe left', '←', 'left')}{moveButton('s', 'Walk backward', '↓', 'down')}{moveButton('d', 'Strafe right', '→', 'right')}</div>
      <div className="tinycraft-build-actions"><button type="button" className="arcade-action" disabled={phase !== 'playing'} onClick={() => act('mine')}>Mine</button><button type="button" className="arcade-action" disabled={phase !== 'playing'} onClick={() => act('place')}>Place</button><button type="button" className="arcade-action arcade-action--quiet" disabled={phase !== 'playing'} onPointerDown={(event) => { hold(event, ' '); jump() }} onPointerUp={() => keysRef.current.delete(' ')} onPointerCancel={() => keysRef.current.delete(' ')} onLostPointerCapture={() => keysRef.current.delete(' ')} onClick={jump}>Jump</button></div>
      <div className="tinycraft-tools"><button type="button" className="arcade-action arcade-action--quiet" disabled={phase === 'ready' || phase === 'unavailable'} onClick={phase === 'paused' ? play : pause}>{phase === 'paused' ? 'Resume' : 'Pause'}</button><button type="button" className="arcade-action arcade-action--quiet" disabled={phase === 'unavailable'} onClick={() => { pause(); setConfirmReset(true) }}>New world</button></div>
      <button type="button" className="tinycraft-home" disabled={phase === 'unavailable'} onClick={returnToSpawn}>Back to spawn</button>
      <p className="arcade-key-hint tinycraft-key-hint">WASD to walk · Space to jump<br />Arrows to look · 1–6 blocks<br />{captured ? 'Left click: mine · Right click: place' : 'E: mine · Q: place · Drag to look'}<br />Esc to pause</p>
      <p className="tinycraft-touch-hint">Drag to look. Aim + at a block, then Mine or Place.</p>
    </aside>
  </div>
}
