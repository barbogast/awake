import Pos from './pos.js'
import { HEIGHT, WIDTH } from '../constants.js'

export function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function getRandomPos() {
  return new Pos(getRandomArbitrary(1, WIDTH), getRandomArbitrary(1, HEIGHT))
}

export function chunkArray<T>(sourceArray: T[], chunkSize: number): T[][] {
  let innerArray = []
  const outerArray = []

  for (const el of sourceArray) {
    innerArray.push(el)
    if (innerArray.length === chunkSize) {
      outerArray.push(innerArray)
      innerArray = []
    }
  }
  if (innerArray.length !== chunkSize) {
    outerArray.push(innerArray)
  }

  return outerArray
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  pos: Pos,
  color: string,
  radius: number,
) {
  ctx.beginPath()
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.closePath()
}

export function drawRect(
  ctx: CanvasRenderingContext2D,
  pos: Pos,
  color: string,
  size: number,
) {
  ctx.fillStyle = color
  const s = size / 2
  ctx.fillRect(pos.x - s, pos.y - s, size, size)
}
