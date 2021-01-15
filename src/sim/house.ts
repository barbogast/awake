import Pos from './pos.js'
import World from './world.js'
import Person from './person.js'
import { Hitbox, Object1 } from '../types.js'
import { chunkArray, drawRect } from './utils.js'

class House implements Object1 {
  type = 'House'
  capacity = 9
  drawSettings = {
    itemSize: 10,
    distanceBetweenItems: 5,
    outerBorder: 10,
  }
  store: Object1[]
  id!: string
  pos: Pos
  world: World

  constructor(pos: Pos, world: World) {
    this.pos = pos
    this.world = world
    this.store = []
  }

  setId(id: string) {
    this.id = id
  }

  _getItemsPerRow() {
    return Math.sqrt(this.capacity)
  }

  _getSize() {
    const itemsPerRow = this._getItemsPerRow()
    const itemsWidth = itemsPerRow * this.drawSettings.itemSize
    const distanceBetweenItemsWidth =
      (itemsPerRow - 1) * this.drawSettings.distanceBetweenItems
    const outerBorderWidth = this.drawSettings.outerBorder * 2
    return itemsWidth + distanceBetweenItemsWidth + outerBorderWidth
  }

  _getItemCenter(storeCenter: number, index: number) {
    const size = this._getSize()
    const storeStart = storeCenter - size / 2
    return (
      storeStart +
      this.drawSettings.outerBorder +
      index *
        (this.drawSettings.itemSize + this.drawSettings.distanceBetweenItems) +
      this.drawSettings.itemSize / 2
    )
  }

  draw(ctx: CanvasRenderingContext2D) {
    const itemsPerRow = this._getItemsPerRow()
    const size = this._getSize()
    drawRect(ctx, this.pos, 'black', size)

    const rows = chunkArray(this.store, itemsPerRow)
    rows.forEach((row, i) => {
      const y = this._getItemCenter(this.pos.y, i)
      row.forEach((obj, i) => {
        const x = this._getItemCenter(this.pos.x, i)
        obj.pos.x = x
        obj.pos.y = y
        obj.draw(ctx)
      })
    })
  }

  addToStore(obj: Object1) {
    this.store.push(obj)
    const isFull = this.store.length === this.capacity
    if (isFull) {
      this.world.add(new Person(this.pos.clone(), this.world))
      this.store = []
      return false
    }

    return isFull
  }

  takeFromStore() {
    return this.store.shift()
  }

  getHitbox() {
    const halfSize = this._getSize() / 2
    const h: Hitbox = {
      x: [this.pos.x - halfSize, this.pos.x + halfSize],
      y: [this.pos.y - halfSize, this.pos.y + halfSize],
    }
    return h
  }

  debugInfo() {
    return {
      id: this.id,
      store: this.store.map((obj) => obj.debugInfo()).join(', '),
    }
  }
}

export default House
