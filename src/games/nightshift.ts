export type Point = { x: number; y: number }
export type Sentinel = Point & { id: number; health: number; cooldown: number; hit: number; path: Point[]; pathTimer: number }
export type MazePhase = 'ready' | 'playing' | 'paused' | 'lost' | 'won'
export type MazeState = {
  player: Point & { angle: number; health: number }
  enemies: Sentinel[]
  phase: MazePhase
  elapsed: number
  shotCooldown: number
  shotFlash: number
  damageFlash: number
}

export const MAZE = [
  '11111111111111111',
  '10000010000000001',
  '10111010111101001',
  '10001010000101001',
  '10101011110101001',
  '10100000000100001',
  '10111101111111011',
  '10000001000000001',
  '11110101011111001',
  '10000100010000001',
  '10111111010111011',
  '10000000010001001',
  '10101111011101001',
  '10100000000000001',
  '10111101111111001',
  '10000000000000001',
  '11111111111111111',
]
export const EXIT: Point = { x: 15.5, y: 15.5 }
export const isWall = (x: number, y: number) => MAZE[Math.floor(y)]?.[Math.floor(x)] !== '0'
export const remainingEnemies = (game: MazeState) => game.enemies.filter(enemy => enemy.health > 0).length

export function createMaze(): MazeState {
  return {
    player: { x: 1.5, y: 1.5, angle: 0, health: 100 },
    enemies: [{ x: 4.5, y: 1.5 }, { x: 3.5, y: 5.5 }, { x: 13.5, y: 7.5 }, { x: 7.5, y: 13.5 }, { x: 13.5, y: 15.5 }].map((point, id) => ({ ...point, id, health: 3, cooldown: 0, hit: 0, path: [], pathTimer: 0 })),
    phase: 'ready', elapsed: 0, shotCooldown: 0, shotFlash: 0, damageFlash: 0,
  }
}

export function castRay(origin: Point, angle: number) {
  const dx = Math.cos(angle), dy = Math.sin(angle)
  let x = Math.floor(origin.x), y = Math.floor(origin.y)
  const deltaX = Math.abs(1 / dx), deltaY = Math.abs(1 / dy)
  const stepX = dx < 0 ? -1 : 1, stepY = dy < 0 ? -1 : 1
  let sideX = (dx < 0 ? origin.x - x : x + 1 - origin.x) * deltaX
  let sideY = (dy < 0 ? origin.y - y : y + 1 - origin.y) * deltaY
  let side = 0
  for (let step = 0; step < 64; step++) {
    if (sideX < sideY) { sideX += deltaX; x += stepX; side = 0 }
    else { sideY += deltaY; y += stepY; side = 1 }
    if (isWall(x, y)) break
  }
  const distance = Math.max(0.001, side === 0 ? sideX - deltaX : sideY - deltaY)
  const hit = side === 0 ? origin.y + distance * dy : origin.x + distance * dx
  return { distance, x, y, side, u: hit - Math.floor(hit) }
}

export function hasLineOfSight(from: Point, to: Point) {
  return castRay(from, Math.atan2(to.y - from.y, to.x - from.x)).distance >= Math.hypot(to.x - from.x, to.y - from.y) - 0.05
}

export function findPath(from: Point, to: Point): Point[] {
  const start = { x: Math.floor(from.x), y: Math.floor(from.y) }
  const target = { x: Math.floor(to.x), y: Math.floor(to.y) }
  const key = (point: Point) => `${point.x},${point.y}`
  const queue = [start], parents = new Map<string, Point | null>([[key(start), null]])
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index]
    if (current.x === target.x && current.y === target.y) {
      const path: Point[] = []
      let cursor: Point | null = current
      while (cursor && key(cursor) !== key(start)) { path.unshift({ x: cursor.x + 0.5, y: cursor.y + 0.5 }); cursor = parents.get(key(cursor)) ?? null }
      return path
    }
    for (const next of [{ x: current.x + 1, y: current.y }, { x: current.x - 1, y: current.y }, { x: current.x, y: current.y + 1 }, { x: current.x, y: current.y - 1 }]) {
      if (!isWall(next.x, next.y) && !parents.has(key(next))) { parents.set(key(next), current); queue.push(next) }
    }
  }
  return []
}

export function moveActor(actor: Point, dx: number, dy: number, radius = 0.2) {
  const canOccupy = (x: number, y: number) => !isWall(x - radius, y - radius) && !isWall(x + radius, y - radius) && !isWall(x - radius, y + radius) && !isWall(x + radius, y + radius)
  if (canOccupy(actor.x + dx, actor.y)) actor.x += dx
  if (canOccupy(actor.x, actor.y + dy)) actor.y += dy
}

export function stepMaze(game: MazeState, seconds: number, input: { forward: number; strafe: number; turn: number }) {
  if (game.phase !== 'playing') return
  const dt = Math.min(0.04, Math.max(0, seconds))
  game.elapsed += dt
  game.shotCooldown = Math.max(0, game.shotCooldown - dt)
  game.shotFlash = Math.max(0, game.shotFlash - dt)
  game.damageFlash = Math.max(0, game.damageFlash - dt)
  game.player.angle += input.turn * dt * 2.2
  const magnitude = Math.max(1, Math.hypot(input.forward, input.strafe))
  const forward = input.forward / magnitude * dt * 2.5, strafe = input.strafe / magnitude * dt * 2.5
  moveActor(game.player, Math.cos(game.player.angle) * forward - Math.sin(game.player.angle) * strafe, Math.sin(game.player.angle) * forward + Math.cos(game.player.angle) * strafe)

  for (const enemy of game.enemies) {
    if (enemy.health <= 0) continue
    enemy.cooldown = Math.max(0, enemy.cooldown - dt)
    enemy.hit = Math.max(0, enemy.hit - dt)
    const distance = Math.hypot(enemy.x - game.player.x, enemy.y - game.player.y)
    if (distance > 8) continue
    if (distance < 0.65 && hasLineOfSight(enemy, game.player)) {
      if (enemy.cooldown === 0) { game.player.health = Math.max(0, game.player.health - 10); game.damageFlash = 0.25; enemy.cooldown = 1.1 }
    } else {
      enemy.pathTimer -= dt
      if (enemy.pathTimer <= 0) { enemy.path = findPath(enemy, game.player); enemy.pathTimer = 0.7 }
      const target = hasLineOfSight(enemy, game.player) ? game.player : enemy.path[0]
      if (target) {
        const dx = target.x - enemy.x, dy = target.y - enemy.y, length = Math.hypot(dx, dy)
        if (length < 0.12) enemy.path.shift()
        else moveActor(enemy, dx / length * Math.min(length, dt * 0.72), dy / length * Math.min(length, dt * 0.72), 0.16)
      }
    }
  }
  if (game.player.health <= 0) game.phase = 'lost'
  else if (remainingEnemies(game) === 0 && Math.hypot(game.player.x - EXIT.x, game.player.y - EXIT.y) < 0.8) game.phase = 'won'
}

export function fireMaze(game: MazeState) {
  if (game.phase !== 'playing' || game.shotCooldown > 0) return false
  game.shotCooldown = 0.22
  game.shotFlash = 0.12
  const targets = game.enemies.filter(enemy => {
    if (enemy.health <= 0) return false
    const dx = enemy.x - game.player.x, dy = enemy.y - game.player.y
    const distance = Math.hypot(dx, dy)
    const angle = Math.atan2(Math.sin(Math.atan2(dy, dx) - game.player.angle), Math.cos(Math.atan2(dy, dx) - game.player.angle))
    return distance < 12 && Math.abs(angle) <= Math.atan2(0.32, distance) + 0.025 && hasLineOfSight(game.player, enemy)
  }).sort((a, b) => Math.hypot(a.x - game.player.x, a.y - game.player.y) - Math.hypot(b.x - game.player.x, b.y - game.player.y))
  if (targets[0]) { targets[0].health--; targets[0].hit = 0.16 }
  return true
}
