import Pos from './pos.js'
import { Hitbox, Object1 } from '../types.js'
import { drawCircle } from './utils.js'

class Pear implements Object1 {
  type = 'Pear'
  radius = 5
  pos: Pos
  id!: string
  energy = 75

  constructor(pos: Pos) {
    this.pos = pos
  }

  setId(id: string) {
    this.id = id
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawCircle(ctx, this.pos, 'yellow', this.radius)
  }

  getHitbox() {
    const h: Hitbox = {
      x: [this.pos.x - this.radius, this.pos.x + this.radius],
      y: [this.pos.y - this.radius, this.pos.y + this.radius],
    }
    return h
  }

  debugInfo() {
    return `Pear ${this.id}`
  }
}

export default Pear
