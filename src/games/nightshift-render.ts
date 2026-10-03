import { castRay, EXIT, MAZE, remainingEnemies, type MazeState } from './nightshift'

const FOV = Math.PI / 3

export function createMazeArt() {
  const wall = document.createElement('canvas'); wall.width = wall.height = 32
  const context = wall.getContext('2d')!
  context.fillStyle = '#624857'; context.fillRect(0, 0, 32, 32)
  for (let row = 0; row < 4; row++) for (let column = -1; column < 3; column++) {
    const x = column * 16 + (row % 2 ? 8 : 0), y = row * 8
    context.fillStyle = '#342b3f'; context.fillRect(x, y, 16, 8)
    context.fillStyle = (row + column) % 2 ? '#76606a' : '#645361'; context.fillRect(x + 1, y + 1, 14, 6)
    context.fillStyle = '#947981'; context.fillRect(x + 2, y + 1, 12, 1)
  }
  const sentinel = document.createElement('canvas'); sentinel.width = 24; sentinel.height = 32
  const sprite = sentinel.getContext('2d')!
  sprite.fillStyle = '#281c31'; sprite.fillRect(4, 29, 16, 3)
  sprite.fillStyle = '#914654'; sprite.fillRect(4, 8, 16, 18); sprite.fillRect(2, 14, 20, 8); sprite.fillRect(6, 4, 12, 5)
  sprite.fillStyle = '#d77371'; sprite.fillRect(6, 6, 12, 6); sprite.fillRect(4, 12, 16, 4)
  sprite.fillStyle = '#663146'; sprite.fillRect(2, 18, 4, 7); sprite.fillRect(18, 18, 4, 7); sprite.fillRect(6, 24, 4, 6); sprite.fillRect(14, 24, 4, 6)
  sprite.fillStyle = '#211c35'; sprite.fillRect(5, 14, 6, 4); sprite.fillRect(13, 14, 6, 4); sprite.fillRect(9, 21, 6, 3)
  sprite.fillStyle = '#b0f5ce'; sprite.fillRect(6, 14, 4, 2); sprite.fillRect(14, 14, 4, 2)
  sprite.fillStyle = '#f6d397'; sprite.fillRect(10, 21, 2, 2); sprite.fillRect(13, 21, 2, 2)
  return { wall, sentinel }
}

export function drawMaze(context: CanvasRenderingContext2D, game: MazeState, art: ReturnType<typeof createMazeArt>) {
  const WIDTH = context.canvas.width, HEIGHT = context.canvas.height
  const projection = WIDTH / (2 * Math.tan(FOV / 2))
  context.imageSmoothingEnabled = false
  context.fillStyle = '#171221'; context.fillRect(0, 0, WIDTH, HEIGHT / 2)
  context.fillStyle = '#302732'; context.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT / 2)
  for (let y = HEIGHT / 2; y < HEIGHT; y += 8) {
    context.fillStyle = `rgba(4,5,13,${0.48 * (1 - (y - HEIGHT / 2) / (HEIGHT / 2))})`; context.fillRect(0, y, WIDTH, 8)
  }
  const depths = new Float64Array(WIDTH)
  const exitOpen = remainingEnemies(game) === 0
  for (let x = 0; x < WIDTH; x++) {
    const offset = Math.atan((2 * x / WIDTH - 1) * Math.tan(FOV / 2))
    const hit = castRay(game.player, game.player.angle + offset)
    const depth = hit.distance * Math.cos(offset); depths[x] = depth
    const height = Math.min(HEIGHT * 8, projection / depth)
    const top = Math.floor((HEIGHT - height) / 2)
    context.drawImage(art.wall, Math.floor(hit.u * 32), 0, 1, 32, x, top, 1, Math.ceil(height))
    context.fillStyle = `rgba(10,7,20,${Math.min(0.88, depth * 0.06 + (hit.side ? 0.18 : 0))})`; context.fillRect(x, top, 1, height)
    if (hit.x === 15 && hit.y === 16) {
      context.fillStyle = exitOpen ? '#82dfb0' : '#af5665'; context.fillRect(x, top + height * 0.18, 1, height * 0.62)
      if (Math.floor(hit.u * 8) % 2 === 0) { context.fillStyle = exitOpen ? '#244739' : '#482b3c'; context.fillRect(x, top + height * 0.18, 1, height * 0.62) }
    }
  }
  const visible = game.enemies.filter(enemy => enemy.health > 0).map(enemy => {
    const dx = enemy.x - game.player.x, dy = enemy.y - game.player.y
    const distance = Math.hypot(dx, dy)
    const angle = Math.atan2(Math.sin(Math.atan2(dy, dx) - game.player.angle), Math.cos(Math.atan2(dy, dx) - game.player.angle))
    return { enemy, distance, angle, depth: distance * Math.cos(angle) }
  }).filter(target => target.depth > 0.15 && Math.abs(target.angle) < FOV).sort((a, b) => b.depth - a.depth)
  for (const { enemy, angle, depth } of visible) {
    const height = Math.min(HEIGHT * 3, projection / depth * 0.8), width = height * 0.75
    const center = WIDTH / 2 * (1 + Math.tan(angle) / Math.tan(FOV / 2))
    const left = center - width / 2, top = HEIGHT / 2 + projection / depth / 2 - height
    for (let x = Math.max(0, Math.floor(left)); x < Math.min(WIDTH, left + width); x++) {
      if (depth >= depths[x]) continue
      const u = Math.min(23, Math.max(0, Math.floor((x - left) / width * 24)))
      context.drawImage(art.sentinel, u, 0, 1, 32, x, top, 1, height)
      if (enemy.hit > 0) { context.fillStyle = 'rgba(255,222,154,0.2)'; context.fillRect(x, top, 1, height) }
    }
  }
  // An original pixel blaster, drawn over the world.
  const recoil = game.shotFlash > 0 ? 7 : 0, bob = Math.sin(game.elapsed * 6) * 1.5
  const gunX = Math.floor(WIDTH / 2), gunY = Math.floor(HEIGHT - 56 + recoil + bob)
  context.fillStyle = '#261f30'; context.fillRect(gunX - 19, gunY + 22, 38, 38)
  context.fillStyle = '#685563'; context.fillRect(gunX - 13, gunY + 10, 26, 44)
  context.fillStyle = '#aaa4ac'; context.fillRect(gunX - 8, gunY, 16, 32)
  context.fillStyle = '#555261'; context.fillRect(gunX - 5, gunY + 3, 10, 25)
  context.fillStyle = '#b6e8ce'; context.fillRect(gunX - 4, gunY + 32, 8, 4)
  if (game.shotFlash > 0.055) { context.fillStyle = '#ffe1a3'; context.fillRect(gunX - 4, gunY - 14, 8, 16); context.fillRect(gunX - 12, gunY - 6, 24, 6) }
  context.fillStyle = '#f9ead6'; context.fillRect(WIDTH / 2 - 5, HEIGHT / 2, 3, 1); context.fillRect(WIDTH / 2 + 3, HEIGHT / 2, 3, 1); context.fillRect(WIDTH / 2, HEIGHT / 2 - 5, 1, 3); context.fillRect(WIDTH / 2, HEIGHT / 2 + 3, 1, 3)
  const mapSize = 3, mapX = WIDTH - MAZE[0].length * mapSize - 9, mapY = 9
  context.fillStyle = 'rgba(9,10,19,0.85)'; context.fillRect(mapX - 3, mapY - 3, 57, 57)
  for (let y = 0; y < MAZE.length; y++) for (let x = 0; x < MAZE[y].length; x++) { context.fillStyle = MAZE[y][x] === '1' ? '#867584' : '#252334'; context.fillRect(mapX + x * mapSize, mapY + y * mapSize, mapSize - 1, mapSize - 1) }
  context.fillStyle = exitOpen ? '#91edb3' : '#d29778'; context.fillRect(mapX + Math.floor(EXIT.x) * mapSize, mapY + Math.floor(EXIT.y) * mapSize, 3, 3)
  context.fillStyle = '#e2877e'; for (const enemy of game.enemies) if (enemy.health > 0) context.fillRect(mapX + Math.floor(enemy.x) * mapSize, mapY + Math.floor(enemy.y) * mapSize, 2, 2)
  context.fillStyle = '#e3ffff'; context.fillRect(mapX + game.player.x * mapSize - 1, mapY + game.player.y * mapSize - 1, 3, 3)
  context.strokeStyle = '#e3ffff'; context.beginPath(); context.moveTo(mapX + game.player.x * mapSize, mapY + game.player.y * mapSize); context.lineTo(mapX + game.player.x * mapSize + Math.cos(game.player.angle) * 5, mapY + game.player.y * mapSize + Math.sin(game.player.angle) * 5); context.stroke()
  if (game.damageFlash > 0) { context.fillStyle = `rgba(160,47,71,${game.damageFlash * 0.65})`; context.fillRect(0, 0, WIDTH, HEIGHT) }
}
