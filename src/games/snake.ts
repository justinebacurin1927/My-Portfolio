export const BOARD_SIZE = 20
export const STEP_TIME = 140
export type Direction = 'up' | 'down' | 'left' | 'right'
export type Cell = { x: number; y: number }
export type SnakeState = {
  snake: Cell[]
  direction: Direction
  food: Cell | null
  score: number
  phase: 'ready' | 'playing' | 'paused' | 'lost' | 'won'
}

const vectors: Record<Direction, Cell> = {
  up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
  left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
}
const opposite: Record<Direction, Direction> = { up: 'down', down: 'up', left: 'right', right: 'left' }
export const canTurn = (from: Direction, to: Direction) => opposite[from] !== to

export function spawnFood(snake: Cell[], random = Math.random): Cell | null {
  const free: Cell[] = []
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (!snake.some(cell => cell.x === x && cell.y === y)) free.push({ x, y })
    }
  }
  return free.length ? free[Math.min(free.length - 1, Math.floor(random() * free.length))] : null
}

export function createSnake(random = Math.random): SnakeState {
  const snake = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }]
  return { snake, direction: 'right', food: spawnFood(snake, random), score: 0, phase: 'ready' }
}

export function stepSnake(state: SnakeState, requested: Direction = state.direction, random = Math.random): SnakeState {
  if (state.phase !== 'playing') return state
  const direction = canTurn(state.direction, requested) ? requested : state.direction
  const delta = vectors[direction]
  const head = { x: state.snake[0].x + delta.x, y: state.snake[0].y + delta.y }
  const eats = head.x === state.food?.x && head.y === state.food?.y
  // The tail vacates its cell on a move unless the snake grows.
  const occupied = eats ? state.snake : state.snake.slice(0, -1)
  if (head.x < 0 || head.y < 0 || head.x >= BOARD_SIZE || head.y >= BOARD_SIZE || occupied.some(cell => cell.x === head.x && cell.y === head.y)) {
    return { ...state, direction, phase: 'lost' }
  }
  const snake = [head, ...state.snake]
  if (!eats) snake.pop()
  const food = eats ? spawnFood(snake, random) : state.food
  return { snake, food, direction, score: state.score + (eats ? 10 : 0), phase: food ? 'playing' : 'won' }
}
