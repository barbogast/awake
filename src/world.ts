import House from './house.js'
import Pos from './pos.js'
import { ObjectType, Object } from './types.js'

class World {
  ctx1: CanvasRenderingContext2D
  ctx2: CanvasRenderingContext2D
  objects: Object[]
  constructor(ctx1: CanvasRenderingContext2D, ctx2: CanvasRenderingContext2D) {
    this.ctx1 = ctx1
    this.ctx2 = ctx2
    this.objects = []
  }

  objectCollides(objA: Object) {
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
      if (!(aRightOfB || bRightOfA)) {
        return true
      }

      const aBelowB = hitboxB.y[1] < hitboxA.y[0]
      const bBelowA = hitboxA.y[1] < hitboxB.y[0]
      if (!(aBelowB || bBelowA)) {
        return true
      }
    }
    return false
  }

  _findAt(type: ObjectType, pos: Pos) {
    return this.objects.find(
      (obj) => obj.pos.equals(pos) && obj.constructor === type,
    )
  }

  add(obj: Object) {
    if (this.objectCollides(obj)) {
      return false
    } else {
      this.objects.push(obj)
      return true
    }
  }

  findPos(type: ObjectType) {
    const objects = this.objects.filter((o) => o.constructor === type)
    const obj = objects[Math.floor(Math.random() * objects.length)]
    return obj ? obj.pos : undefined
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
    obj[method](...params)
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
    }
  }
}

export default World
