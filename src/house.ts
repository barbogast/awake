import Pos from './pos.js'
import { Hitbox, Object1 } from './types.js'
import { chunkArray, drawRect } from './utils.js'

class House implements Object1 {
  size = 70
  store: Object1[]
  id!: string
  pos: Pos

  constructor(pos: Pos) {
    this.pos = pos
    this.store = []
  }

  setId(id: string) {
    this.id = id
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawRect(ctx, this.pos, 'black', this.size)

    const rows = chunkArray(this.store, 3)
    rows.forEach((row, i) => {
      const y = this.pos.y - 12.5 + i * 15
      row.forEach((obj, i) => {
        const x = this.pos.x - 12.5 + i * 15
        obj.pos.x = x
        obj.pos.y = y
        obj.draw(ctx)
      })
    })
  }

  addToStore(obj: Object1) {
    this.store.push(obj)
  }

  getHitbox() {
    const halfSize = this.size / 2
    const h: Hitbox = {
      x: [this.pos.x - halfSize, this.pos.x + halfSize],
      y: [this.pos.y - halfSize, this.pos.y + halfSize],
    }
    return h
  }

  debugInfo() {
    return { id: this.id, store: this.store.map((obj) => obj.debugInfo()) }
  }
}

export default House
