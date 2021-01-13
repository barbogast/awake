import House from './house.js'
import Pos from './pos.js'
import { ObjectType, Object1 } from '../types.js'

const DRAW_HITBOXES = false

class World {
  ctx1: CanvasRenderingContext2D
  ctx2: CanvasRenderingContext2D
  objects: Object1[]
  counter: number

  constructor(ctx1: CanvasRenderingContext2D, ctx2: CanvasRenderingContext2D) {
    this.ctx1 = ctx1
    this.ctx2 = ctx2
    this.objects = []
    this.counter = 0
  }

  objectCollides(objA: Object1) {
    const hitboxA = objA.getHitbox()
    if (!hitboxA) {
      return false
    }

    for (const objB of this.objects) {
      const hitboxB = objB.getHitbox()
      if (!hitboxB) {
        continue
      }

      const aRightOfB = hitboxB.x[1] < hitboxA.x[0]
      const bRightOfA = hitboxA.x[1] < hitboxB.x[0]
      const xOverlaps = !(aRightOfB || bRightOfA)

      const aBelowB = hitboxB.y[1] < hitboxA.y[0]
      const bBelowA = hitboxA.y[1] < hitboxB.y[0]
      const yOverlaps = !(aBelowB || bBelowA)

      if (xOverlaps && yOverlaps) {
        return true
      }
    }
    return false
  }

  _findAt(type: ObjectType, pos: Pos) {
    return this.objects.find((obj) => obj.pos.equals(pos) && obj.type === type)
  }

  add(obj: Object1) {
    if (this.objectCollides(obj)) {
      return false
    } else {
      obj.setId(String(this.counter))
      this.counter += 1
      this.objects.push(obj)
      return true
    }
  }

  findPos(types: ObjectType[]): { type: ObjectType; pos: Pos } | void {
    const objects = this.objects.filter((o) => {
      const type = o.type as ObjectType
      return types.includes(type)
    })
    const obj = objects[Math.floor(Math.random() * objects.length)]
    if (obj) {
      const type = obj.type as ObjectType
      return { pos: obj.pos, type }
    } else {
      return undefined
    }
  }

  takeObject(type: ObjectType, pos: Pos) {
    const obj = this._findAt(type, pos)
    if (!obj) {
      return undefined
    }
    this.objects.splice(this.objects.indexOf(obj), 1)
    return obj
  }

  interact(type: ObjectType, pos: Pos, method: string, params: any[]) {
    const obj = this._findAt(type, pos)
    if (!obj) {
      return false
    }
    // @ts-ignore
    return obj[method](...params)
  }

  tick() {
    for (const obj of this.objects) {
      if (obj.tick) {
        obj.tick()
      }
    }
  }

  draw() {
    for (const obj of this.objects) {
      obj.draw(obj.constructor === House ? this.ctx1 : this.ctx2)

      if (DRAW_HITBOXES) {
        const hi = obj.getHitbox()
        if (hi) {
          this.ctx2.fillStyle = 'orange'
          this.ctx2.fillRect(
            hi.x[0],
            hi.y[0],
            hi.x[1] - hi.x[0],
            hi.y[1] - hi.y[0],
          )
        }
      }
    }
  }

  getObjectsByType() {
    const objByType: { [key: string]: Object1[] } = {}
    for (const obj of this.objects) {
      let list = objByType[obj.constructor.name]
      if (!list) {
        list = []
        objByType[obj.constructor.name] = list
      }
      list.push(obj)
    }
    return objByType
  }
}

export default World
