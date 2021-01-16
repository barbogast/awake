import Apple from './apple.js'
import House from './house.js'
import Pos from './pos.js'
import World from './world.js'
import { ObjectType, Object1, LoggingFunction } from '../types.js'
import { drawCircle } from './utils.js'
import Pear from './pear.js'

const EAT_WHEN_LESS_THEN = 500
const MAX_ENERGY = 1000
const INITIAL_ENERGY = 750

class Person implements Object1 {
  type = 'Person'
  radius = 12
  pos: Pos
  world: World
  inventory: undefined | Object1
  target: { pos: Pos; type: ObjectType } | undefined
  id!: string
  log!: LoggingFunction
  energy: number

  constructor(pos: Pos, world: World) {
    this.pos = pos
    this.world = world
    this.inventory = undefined
    this.energy = INITIAL_ENERGY
  }

  setTarget(types: ObjectType[]) {
    const target = this.world.findPos(types)
    if (target) {
      this.target = target
      this.log(`Set target to ${target.type} at ${target.pos}`)
    } else {
      this.log(`Couldn't find target`)
      this.target = undefined
    }
  }

  tick() {
    if (this.energy <= 0) {
      return
    }

    this.energy -= 1

    if (this.energy < EAT_WHEN_LESS_THEN) {
      if (
        this.inventory &&
        (this.inventory.type === 'Apple' || this.inventory.type === 'Pear')
      ) {
        this.eat(this.inventory)
        this.inventory = undefined
        this.setTarget(['Apple', 'Pear'])
      } else if (this.target?.type === 'House') {
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
    this.log(`Eat ${obj}`)
    this.energy = Math.min(
      this.energy + (obj as Apple | Pear).energy,
      MAX_ENERGY,
    )
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
    this.drawEnergyBar(ctx)
  }

  drawEnergyBar(ctx: CanvasRenderingContext2D) {
    const width = 3

    // First draw full red bar
    const xRed = this.pos.x + this.radius
    const yRed = this.pos.y - this.radius
    const heightRed = this.radius * 2
    ctx.fillStyle = 'red'
    ctx.fillRect(xRed, yRed, width, heightRed)

    // Then add partial green bar on top
    const heightGreen = (heightRed * this.energy) / MAX_ENERGY
    const yGreen = yRed + heightRed - heightGreen
    ctx.fillStyle = 'green'
    ctx.fillRect(xRed, yGreen, width, heightGreen)
  }

  targetReached() {
    this.log(`Reached target`)
    switch (this.target?.type) {
      case 'Apple':
      case 'Pear': {
        const apple = this.world.takeObject(this.target.type, this.target.pos)
        if (apple) {
          this.log(`Put ${apple} to inventory`)
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
          this.log(`Reached target`)
          const obj = this.world.interact(
            'House',
            this.pos,
            'takeFromStore',
            [],
          )
          if (obj) {
            this.eat(obj)
            this.setTarget(['Apple', 'Pear'])
          }
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

  toString() {
    return `${this.type} (${this.id})`
  }
}

export default Person
