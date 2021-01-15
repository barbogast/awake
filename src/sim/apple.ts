import Pos from './pos.js'
import { Hitbox, LoggingFunction, Object1 } from '../types.js'
import { drawCircle } from './utils.js'

class Apple implements Object1 {
  type = 'Apple'
  radius = 5
  pos: Pos
  id!: string
  log!: LoggingFunction
  energy = 50

  constructor(pos: Pos) {
    this.pos = pos
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawCircle(ctx, this.pos, 'green', this.radius)
  }

  getHitbox() {
    const h: Hitbox = {
      x: [this.pos.x - this.radius, this.pos.x + this.radius],
      y: [this.pos.y - this.radius, this.pos.y + this.radius],
    }
    return h
  }

  debugInfo() {
    return this.toString()
  }

  toString() {
    return `${this.type} (${this.id})`
  }
}

export default Apple
