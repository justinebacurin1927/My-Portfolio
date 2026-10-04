import { BoxGeometry, BufferGeometry, CanvasTexture, Color, EdgesGeometry, Float32BufferAttribute, Fog, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, NearestFilter, PerspectiveCamera, PlaneGeometry, Scene, SRGBColorSpace, WebGLRenderer } from 'three'
import { BLOCK, EYE_HEIGHT, WORLD_HEIGHT, WORLD_SIZE, getBlock, type BlockHit, type BlockId, type CraftPlayer, type CraftWorld } from './tinycraft'

const FACES = [
  { dir: [-1, 0, 0], corners: [[0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1]], shade: 0.72 },
  { dir: [1, 0, 0], corners: [[1, 0, 1], [1, 0, 0], [1, 1, 1], [1, 1, 0]], shade: 0.86 },
  { dir: [0, -1, 0], corners: [[0, 0, 1], [0, 0, 0], [1, 0, 1], [1, 0, 0]], shade: 0.52 },
  { dir: [0, 1, 0], corners: [[0, 1, 0], [0, 1, 1], [1, 1, 0], [1, 1, 1]], shade: 1 },
  { dir: [0, 0, -1], corners: [[1, 0, 0], [0, 0, 0], [1, 1, 0], [0, 1, 0]], shade: 0.76 },
  { dir: [0, 0, 1], corners: [[0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]], shade: 0.9 },
]
const blockTile = (block: BlockId, face: number) => block === BLOCK.grass ? face === 3 ? 0 : face === 2 ? 2 : 1 : block === BLOCK.dirt ? 2 : block === BLOCK.stone ? 3 : block === BLOCK.wood ? face === 2 || face === 3 ? 5 : 4 : block === BLOCK.leaves ? 6 : block === BLOCK.brick ? 7 : block === BLOCK.glass ? 8 : 9

function createBlockAtlas() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const context = canvas.getContext('2d')!
  let seed = 1234
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
  const palettes = [ ['#769a4e', '#82aa56', '#618443'], ['#876747', '#987651', '#745639'], ['#876747', '#987651', '#745639'], ['#929a9c', '#a9b0ad', '#78858c'], ['#9a7248', '#ad8955', '#755333'], ['#ba9662', '#caaa75', '#987244'], ['#47724d', '#59844d', '#355c45'], ['#aa6861', '#bc7b6c', '#8c4e50'], ['#b3dece', '#c9edde', '#75a99d'], ['#4d555d', '#636870', '#343e47'] ]
  palettes.forEach((colors, tile) => {
    const ox = tile % 4 * 16, oy = Math.floor(tile / 4) * 16
    if (tile === 8) {
      context.fillStyle = '#91beb2'
      context.fillRect(ox, oy, 16, 1); context.fillRect(ox, oy + 15, 16, 1); context.fillRect(ox, oy, 1, 16); context.fillRect(ox + 15, oy, 1, 16)
      context.fillStyle = '#d8f1dd'
      for (let i = 3; i < 11; i++) { context.fillRect(ox + i, oy + 13 - i, 1, 1); context.fillRect(ox + i + 2, oy + 13 - i, 1, 1) }
      return
    }
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      context.fillStyle = colors[random() < 0.6 ? 0 : random() < 0.5 ? 1 : 2]
      context.fillRect(ox + x, oy + y, 1, 1)
    }
    if (tile === 1) {
      context.fillStyle = '#769a4e'; context.fillRect(ox, oy, 16, 3)
      for (let x = 0; x < 16; x++) context.fillRect(ox + x, oy + 3, 1, Math.floor(random() * 3))
    }
    if (tile === 4) {
      context.fillStyle = '#735236'
      for (let x = 2; x < 16; x += 4) { context.fillRect(ox + x, oy, 1, 16); context.fillRect(ox + x + 1, oy + 3, 1, 7) }
    }
    if (tile === 5) {
      context.strokeStyle = '#8d673c'; context.lineWidth = 1
      for (let inset = 2; inset < 8; inset += 3) context.strokeRect(ox + inset + 0.5, oy + inset + 0.5, 15 - inset * 2, 15 - inset * 2)
    }
    if (tile === 7) {
      context.fillStyle = '#d0b395'
      for (let y = 3; y < 16; y += 4) { context.fillRect(ox, oy + y, 16, 1); for (let x = y % 8 === 3 ? 7 : 3; x < 16; x += 8) context.fillRect(ox + x, oy + y - 3, 1, 3) }
    }
  })
  const texture = new CanvasTexture(canvas)
  texture.magFilter = texture.minFilter = NearestFilter
  texture.generateMipmaps = false
  texture.colorSpace = SRGBColorSpace
  return texture
}

function buildGeometry(world: CraftWorld) {
  const positions: number[] = [], normals: number[] = [], uvs: number[] = [], colors: number[] = [], indices: number[] = []
  for (let y = 0; y < WORLD_HEIGHT; y++) for (let z = 0; z < WORLD_SIZE; z++) for (let x = 0; x < WORLD_SIZE; x++) {
    const block = getBlock(world, x, y, z)
    if (!block) continue
    FACES.forEach(({ dir, corners, shade }, face) => {
      const neighbor = getBlock(world, x + dir[0], y + dir[1], z + dir[2])
      if (neighbor !== BLOCK.air && !(neighbor === BLOCK.glass && block !== BLOCK.glass)) return
      const tile = blockTile(block, face), tx = tile % 4, ty = Math.floor(tile / 4), offset = positions.length / 3
      corners.forEach((corner, index) => {
        positions.push(x + corner[0], y + corner[1], z + corner[2]); normals.push(...dir); colors.push(shade, shade, shade)
        const u = index % 2, v = Math.floor(index / 2)
        uvs.push((tx * 16 + 0.5 + u * 15) / 64, 1 - (ty * 16 + 15.5 - v * 15) / 64)
      })
      indices.push(offset, offset + 1, offset + 2, offset + 2, offset + 1, offset + 3)
    })
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geometry.setIndex(indices)
  geometry.computeBoundingSphere()
  return geometry
}

export function createCraftRenderer(canvas: HTMLCanvasElement, initialWorld: CraftWorld) {
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' })
  renderer.setPixelRatio(1)
  const scene = new Scene()
  scene.background = new Color('#b3c5d0'); scene.fog = new Fog('#b3c5d0', 18, 52)
  const camera = new PerspectiveCamera(72, 1, 0.05, 90)
  camera.rotation.order = 'YXZ'
  const texture = createBlockAtlas()
  const material = new MeshBasicMaterial({ map: texture, vertexColors: true, alphaTest: 0.5 })
  const terrain = new Mesh(buildGeometry(initialWorld), material)
  scene.add(terrain)
  const outlineGeometry = new EdgesGeometry(new BoxGeometry(1.008, 1.008, 1.008))
  const outlineMaterial = new LineBasicMaterial({ color: '#fff1c2', depthTest: true })
  const outline = new LineSegments(outlineGeometry, outlineMaterial)
  outline.visible = false; scene.add(outline)
  const decorations = new Group()
  const cloudMaterial = new MeshBasicMaterial({ color: '#e7e2cf' }), cloudGeometry = new BoxGeometry(1, 1, 1)
  for (const [x, z, scale] of [[-6, 0, 5], [17, -13, 6], [32, 13, 4], [4, 31, 5]]) {
    const cloud = new Mesh(cloudGeometry, cloudMaterial); cloud.position.set(x, 15.5, z); cloud.scale.set(scale, 0.6, 2.5); decorations.add(cloud)
    const puff = new Mesh(cloudGeometry, cloudMaterial); puff.position.set(x - 1, 16, z); puff.scale.set(scale * 0.6, 0.7, 2); decorations.add(puff)
  }
  const sunMaterial = new MeshBasicMaterial({ color: '#ffe4a0', fog: false }), sunGeometry = new BoxGeometry(2.5, 2.5, 0.5)
  const sun = new Mesh(sunGeometry, sunMaterial); sun.position.set(2, 18, -13); decorations.add(sun)
  const seaGeometry = new PlaneGeometry(150, 150), seaMaterial = new MeshBasicMaterial({ color: '#79a8b6' })
  const sea = new Mesh(seaGeometry, seaMaterial); sea.rotation.x = -Math.PI / 2; sea.position.set(14, -0.08, 14); decorations.add(sea)
  scene.add(decorations)
  let revision = initialWorld.revision, currentWorld = initialWorld, lost = false
  const onLost = (event: Event) => { event.preventDefault(); lost = true }
  const onRestored = () => { lost = false }
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)
  const resize = (width: number, height: number) => {
    if (width <= 0 || height <= 0) return
    const scale = Math.min(1, 640 / width, 400 / height)
    renderer.setSize(Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale)), false)
    camera.aspect = width / height; camera.updateProjectionMatrix()
  }
  const render = (world: CraftWorld, player: CraftPlayer, hit: BlockHit | null) => {
    if (lost) return false
    if (currentWorld !== world || revision !== world.revision) {
      terrain.geometry.dispose(); terrain.geometry = buildGeometry(world)
      currentWorld = world; revision = world.revision
    }
    camera.position.set(player.x, player.y + EYE_HEIGHT, player.z)
    camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ')
    outline.visible = Boolean(hit)
    if (hit) outline.position.set(hit.x + 0.5, hit.y + 0.5, hit.z + 0.5)
    renderer.render(scene, camera)
    return true
  }
  const dispose = () => {
    canvas.removeEventListener('webglcontextlost', onLost); canvas.removeEventListener('webglcontextrestored', onRestored)
    terrain.geometry.dispose(); material.dispose(); texture.dispose(); outlineGeometry.dispose(); outlineMaterial.dispose()
    cloudGeometry.dispose(); cloudMaterial.dispose(); sunGeometry.dispose(); sunMaterial.dispose(); seaGeometry.dispose(); seaMaterial.dispose()
    renderer.dispose()
  }
  return { resize, render, dispose }
}
