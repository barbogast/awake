import Apple from './apple.js'
import House from './house.js'
import Pos from './pos.js'
import World from './world.js'
import { ObjectType, Object1 } from '../types.js'
import { drawCircle } from './utils.js'
import Pear from './pear.js'

const EAT_WHEN_LESS_THEN = 100

class Person implements Object1 {
  type = 'Person'
  radius = 12
  pos: Pos
  world: World
  inventory: undefined | Object1
  target: { pos: Pos; type: ObjectType } | undefined
  id!: string
  energy: number

  constructor(pos: Pos, world: World) {
    this.pos = pos
    this.world = world
    this.inventory = undefined
    this.energy = 1000
  }

  setId(id: string) {
    this.id = id
  }

  setTarget(types: ObjectType[]) {
    const target = this.world.findPos(types)
    if (target) {
      this.target = target
    } else {
      this.target = undefined
    }
  }

  tick() {
    this.energy -= 1

    if (this.energy < EAT_WHEN_LESS_THEN) {
      if (
        this.inventory &&
        (this.inventory.type === 'Apple' || this.inventory.type === 'Pear')
      ) {
        this.eat(this.inventory)
        this.inventory = undefined
        this.setTarget(['Apple', 'Pear'])
      } else {
        this.setTarget(['House'])
      }
    }

    if (this.target) {
      if (this.pos.equals(this.target.pos)) {
        this.targetReached()
      } else {
        this.moveTowards()
      }
    } else {
      this.setTarget(['Apple', 'Pear'])
    }
  }

  eat(obj: Object1) {
    this.energy += (obj as Apple | Pear).energy
  }

  moveTowards() {
    if (!this.target) {
      return
    }
    const diffX = this.pos.x - this.target.pos.x
    const diffY = this.pos.y - this.target.pos.y

    if (Math.abs(diffX) > Math.abs(diffY)) {
      this.pos.x += diffX > 0 ? -1 : 1
    } else {
      this.pos.y += diffY > 0 ? -1 : 1
    }

    if (this.inventory) {
      this.inventory.pos = this.pos.clone()
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawCircle(ctx, this.pos, 'lightblue', this.radius)
    if (this.inventory) {
      this.inventory.draw(ctx)
    }
  }

  targetReached() {
    switch (this.target?.type) {
      case 'Apple':
      case 'Pear': {
        const apple = this.world.takeObject(this.target.type, this.target.pos)
        if (apple) {
          this.inventory = apple
          this.setTarget(['House'])
        } else {
          // Someone else must have picked up the apple; let's find a new one
          this.setTarget(['Apple', 'Pear'])
        }
        break
      }

      case 'House': {
        if (this.energy < EAT_WHEN_LESS_THEN) {
          const obj = this.world.interact(
            'House',
            this.pos,
            'takeFromStore',
            [],
          )
          this.eat(obj)
          this.setTarget(['Apple', 'Pear'])
          return
        }
        const isFull = this.world.interact('House', this.pos, 'addToStore', [
          this.inventory,
        ])
        if (isFull) {
          this.target = undefined
        } else {
          this.setTarget(['Apple', 'Pear'])
        }
        this.inventory = undefined
        break
      }

      default:
        throw new Error(`Unknown target: ${this.target?.type}`)
    }
  }

  getHitbox() {
    return undefined
  }

  debugInfo() {
    return {
      id: this.id,
      inventory: this.inventory ? this.inventory.debugInfo() : 'empty',
      target: this.target || 'none',
      energy: this.energy,
    }
  }
}

export default Person
