export const WORLD_SIZE = 28
export const WORLD_HEIGHT = 18
export const PLAYER_HEIGHT = 1.72
export const EYE_HEIGHT = 1.56
export const PLAYER_RADIUS = 0.28
export const REACH = 6

export const BLOCK = {
  air: 0,
  grass: 1,
  dirt: 2,
  stone: 3,
  wood: 4,
  leaves: 5,
  brick: 6,
  glass: 7,
  bedrock: 8,
} as const
export type BlockId = (typeof BLOCK)[keyof typeof BLOCK]
export const BUILDING_BLOCKS = [
  BLOCK.grass,
  BLOCK.stone,
  BLOCK.wood,
  BLOCK.brick,
  BLOCK.glass,
  BLOCK.leaves,
] as const
export const BLOCK_NAMES: Record<BlockId, string> = {
  0: 'Air',
  1: 'Grass',
  2: 'Dirt',
  3: 'Stone',
  4: 'Wood',
  5: 'Leaves',
  6: 'Brick',
  7: 'Glass',
  8: 'Bedrock',
}
export type CraftWorld = { blocks: Uint8Array; revision: number; mined: number; placed: number }
export type CraftPlayer = {
  x: number
  y: number
  z: number
  yaw: number
  pitch: number
  velocityY: number
  grounded: boolean
}
export type BlockHit = {
  x: number
  y: number
  z: number
  block: BlockId
  normal: [number, number, number]
  distance: number
}
export type CraftInput = {
  forward: number
  strafe: number
  turn: number
  look: number
  jump: boolean
}

export const inWorld = (x: number, y: number, z: number) =>
  x >= 0 && x < WORLD_SIZE && y >= 0 && y < WORLD_HEIGHT && z >= 0 && z < WORLD_SIZE
export const blockIndex = (x: number, y: number, z: number) => (y * WORLD_SIZE + z) * WORLD_SIZE + x
export const getBlock = (world: CraftWorld, x: number, y: number, z: number): BlockId =>
  inWorld(x, y, z) ? (world.blocks[blockIndex(x, y, z)] as BlockId) : BLOCK.air

export function createCraftWorld(): CraftWorld {
  const world: CraftWorld = {
    blocks: new Uint8Array(WORLD_SIZE * WORLD_SIZE * WORLD_HEIGHT),
    revision: 0,
    mined: 0,
    placed: 0,
  }
  const put = (x: number, y: number, z: number, block: BlockId) => {
    if (inWorld(x, y, z)) world.blocks[blockIndex(x, y, z)] = block
  }
  for (let z = 0; z < WORLD_SIZE; z++)
    for (let x = 0; x < WORLD_SIZE; x++) {
      const clearing = x >= 8 && x <= 20 && z >= 7 && z <= 23
      const height = clearing
        ? 3
        : 3 + Math.max(0, Math.floor(1.2 * Math.sin(x * 0.34) + 1.4 * Math.cos(z * 0.29)))
      for (let y = 0; y <= height; y++)
        put(
          x,
          y,
          z,
          y === 0
            ? BLOCK.bedrock
            : y === height
              ? BLOCK.grass
              : y >= height - 1
                ? BLOCK.dirt
                : BLOCK.stone,
        )
    }
  // A small open-door cabin gives the clearing a useful first building project.
  for (let z = 9; z <= 14; z++)
    for (let x = 11; x <= 16; x++) {
      put(x, 3, z, BLOCK.wood)
      for (let y = 4; y <= 6; y++) {
        if (x !== 11 && x !== 16 && z !== 9 && z !== 14) continue
        if (z === 14 && (x === 13 || x === 14) && y <= 5) continue
        const window =
          y === 5 &&
          ((z === 14 && (x === 12 || x === 15)) ||
            (z === 9 && (x === 13 || x === 14)) ||
            ((x === 11 || x === 16) && (z === 11 || z === 12)))
        put(x, y, z, window ? BLOCK.glass : BLOCK.wood)
      }
    }
  for (let z = 8; z <= 15; z++) for (let x = 10; x <= 17; x++) put(x, 7, z, BLOCK.brick)
  for (let z = 9; z <= 14; z++) for (let x = 11; x <= 16; x++) put(x, 8, z, BLOCK.brick)
  for (const [x, z] of [
    [4, 6],
    [23, 5],
    [24, 21],
    [4, 23],
    [9, 3],
    [21, 13],
  ]) {
    let ground = 1
    while (getBlock(world, x, ground, z) !== BLOCK.air) ground++
    for (let y = ground; y < ground + 4; y++) put(x, y, z, BLOCK.wood)
    for (let dy = 2; dy <= 5; dy++)
      for (let dx = -2; dx <= 2; dx++)
        for (let dz = -2; dz <= 2; dz++) {
          if (Math.abs(dx) + Math.abs(dz) > (dy === 5 ? 1 : 3)) continue
          if (getBlock(world, x + dx, ground + dy, z + dz) === BLOCK.air)
            put(x + dx, ground + dy, z + dz, BLOCK.leaves)
        }
  }
  return world
}

export function playerIntersectsBlock(player: CraftPlayer, x: number, y: number, z: number) {
  return (
    player.x + PLAYER_RADIUS > x &&
    player.x - PLAYER_RADIUS < x + 1 &&
    player.z + PLAYER_RADIUS > z &&
    player.z - PLAYER_RADIUS < z + 1 &&
    player.y + PLAYER_HEIGHT > y + 0.001 &&
    player.y < y + 1 - 0.001
  )
}

export function playerCollides(world: CraftWorld, player: CraftPlayer) {
  if (
    player.x < PLAYER_RADIUS ||
    player.z < PLAYER_RADIUS ||
    player.x > WORLD_SIZE - PLAYER_RADIUS ||
    player.z > WORLD_SIZE - PLAYER_RADIUS ||
    player.y < 1 ||
    player.y + PLAYER_HEIGHT > WORLD_HEIGHT
  )
    return true
  for (
    let y = Math.floor(player.y + 0.001);
    y <= Math.floor(player.y + PLAYER_HEIGHT - 0.001);
    y++
  ) {
    for (
      let z = Math.floor(player.z - PLAYER_RADIUS);
      z <= Math.floor(player.z + PLAYER_RADIUS);
      z++
    ) {
      for (
        let x = Math.floor(player.x - PLAYER_RADIUS);
        x <= Math.floor(player.x + PLAYER_RADIUS);
        x++
      ) {
        if (getBlock(world, x, y, z) !== BLOCK.air) return true
      }
    }
  }
  return false
}

export function spawnCraftPlayer(world: CraftWorld): CraftPlayer {
  const player: CraftPlayer = {
    x: 14.5,
    y: 4,
    z: 19.5,
    yaw: 0,
    pitch: -0.12,
    velocityY: 0,
    grounded: false,
  }
  for (let radius = 0; radius < WORLD_SIZE; radius++) {
    for (let dz = -radius; dz <= radius; dz++)
      for (let dx = -radius; dx <= radius; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== radius) continue
        const x = 14 + dx,
          z = 19 + dz
        if (!inWorld(x, 0, z)) continue
        for (let y = WORLD_HEIGHT - 2; y >= 1; y--) {
          if (!getBlock(world, x, y - 1, z)) continue
          Object.assign(player, { x: x + 0.5, y, z: z + 0.5 })
          if (!playerCollides(world, player)) return player
        }
      }
  }
  return player
}

export function stepCraftPlayer(
  world: CraftWorld,
  player: CraftPlayer,
  elapsed: number,
  input: CraftInput,
) {
  const dt = Math.min(0.04, Math.max(0, elapsed))
  player.yaw += input.turn * dt * 1.8
  player.pitch = Math.max(-1.45, Math.min(1.45, player.pitch + input.look * dt * 1.6))
  const length = Math.max(1, Math.hypot(input.forward, input.strafe)),
    speed = (4.2 * dt) / length
  const dx = (-Math.sin(player.yaw) * input.forward + Math.cos(player.yaw) * input.strafe) * speed
  const dz = (-Math.cos(player.yaw) * input.forward - Math.sin(player.yaw) * input.strafe) * speed
  player.x += dx
  if (playerCollides(world, player)) player.x -= dx
  player.z += dz
  if (playerCollides(world, player)) player.z -= dz
  if (input.jump && player.grounded) {
    player.velocityY = 7.4
    player.grounded = false
  }
  player.velocityY = Math.max(-18, player.velocityY - 20 * dt)
  const oldY = player.y
  player.y += player.velocityY * dt
  if (playerCollides(world, player)) {
    player.y =
      player.velocityY < 0
        ? Math.floor(oldY + 0.001)
        : Math.ceil(oldY + PLAYER_HEIGHT - 0.001) - PLAYER_HEIGHT
    player.grounded = player.velocityY < 0
    player.velocityY = 0
  } else player.grounded = false
}

export function craftViewDirection(player: CraftPlayer): [number, number, number] {
  const cos = Math.cos(player.pitch)
  return [-Math.sin(player.yaw) * cos, Math.sin(player.pitch), -Math.cos(player.yaw) * cos]
}

export function targetCraftBlock(
  world: CraftWorld,
  player: CraftPlayer,
  reach = REACH,
): BlockHit | null {
  const origin = [player.x, player.y + EYE_HEIGHT, player.z],
    direction = craftViewDirection(player)
  const cell = origin.map(Math.floor),
    step = direction.map((value) => (value < 0 ? -1 : 1))
  const delta = direction.map((value) => (value === 0 ? Infinity : Math.abs(1 / value)))
  const maximum = direction.map((value, axis) =>
    value === 0
      ? Infinity
      : ((step[axis] > 0 ? cell[axis] + 1 : cell[axis]) - origin[axis]) / value,
  )
  let distance = 0,
    normal: [number, number, number] = [0, 0, 0]
  while (distance <= reach) {
    const [x, y, z] = cell,
      block = getBlock(world, x, y, z)
    if (block !== BLOCK.air) return { x, y, z, block, normal, distance }
    const axis =
      maximum[0] < maximum[1] ? (maximum[0] < maximum[2] ? 0 : 2) : maximum[1] < maximum[2] ? 1 : 2
    distance = maximum[axis]
    cell[axis] += step[axis]
    maximum[axis] += delta[axis]
    normal = [0, 0, 0]
    normal[axis] = -step[axis]
  }
  return null
}

export function mineCraftBlock(world: CraftWorld, hit: BlockHit | null): string {
  if (!hit) return 'Aim at a nearby block to mine.'
  if (hit.block === BLOCK.bedrock) return 'Bedrock keeps the island together.'
  if (getBlock(world, hit.x, hit.y, hit.z) !== hit.block) return 'Aim at a nearby block to mine.'
  world.blocks[blockIndex(hit.x, hit.y, hit.z)] = BLOCK.air
  world.revision++
  world.mined++
  return `Mined ${BLOCK_NAMES[hit.block].toLowerCase()}.`
}

export function placeCraftBlock(
  world: CraftWorld,
  player: CraftPlayer,
  hit: BlockHit | null,
  block: BlockId,
): string {
  if (!hit) return 'Aim at a nearby block to build.'
  if (!(BUILDING_BLOCKS as readonly number[]).includes(block)) return 'Choose a building block.'
  const x = hit.x + hit.normal[0],
    y = hit.y + hit.normal[1],
    z = hit.z + hit.normal[2]
  if (!inWorld(x, y, z) || y === 0) return 'That is the edge of this little world.'
  if (getBlock(world, x, y, z) !== BLOCK.air) return 'That space is already filled.'
  if (playerIntersectsBlock(player, x, y, z)) return 'Step back to leave room for that block.'
  world.blocks[blockIndex(x, y, z)] = block
  world.revision++
  world.placed++
  return `Placed ${BLOCK_NAMES[block].toLowerCase()}.`
}
