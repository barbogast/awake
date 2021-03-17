import Apple from './apple.js'
import House from './house.js'
import Pos from './pos.js'
import World from './world.js'
import { ObjectType, Object1, LoggingFunction } from '../types.js'
import { drawCircle } from './utils.js'
import Pear from './pear.js'
import planner from './planner.js'
const x = planner

const EAT_WHEN_LESS_THEN = 500
const MAX_ENERGY = 1000
const INITIAL_ENERGY = 750
const EAT_PER_TICK = 100

// const eating = () => {
//   // getFood
//   lookForFruit()
//   if (fruitFoundOnFloor){
//     walkTo(fruit)
//     putFruitToInventory()
//   } else if(fruitFoundInStore) {
//     walkTo(store)
//     takeFruitFromStore()
//     putFruitIntoInventory()
//   } else {
//     wait()
//   }

//   if(fruitInInventory and energyNotFull){
//     eatFromFruitInInventory()
//     if(energyFull or fruitEmpty){
//       emptyInventory()
//       done()
//     }
//   }
// }

// const harvest = () => {
//   lookForFruit()
//   if (fruitFoundOnFloor){
//     walkTo(fruit)
//     putFruitToInventory()
//     walkTo(Store)
//     putFruitToStore()
//   }
//   done()
// }

// const eating = [
//   'lookingForFruit'
// ]

// let tasks = ''
// const x = {
//   eat: () => {
//     if(!this.inventory){
//       tasks += 'getFruit'
//     }
//   },

//   getFruit: () => {
//     if(!this.target){
//       tasks += 'lookForFruit'
//     }

//     if(!this.inventory){
//       tasks += 'pickupFruit'
//     }
//   },
//   lookForFruit: () => {
//     // if(this.inventory){
//     //   tasks += ''
//     // }

//     const fruit = World.findPos(['Apple', 'Grape'])
//     if(fruit){
//       tasks += `walkTo(${fruit.id})`
//     } else {
//       const store = World.findPos(['Store'])
//       tasks += `walkTo(${store.id})`
//     }
//   }
// }

// const eat = [
//   {
//     name: 'walkTo',
//     args: ['position'],
//   },
//   {
//     name: 'takeFruitToInventory',
//     results: ['success', 'fruitGone'],
//   },
//   {
//     name: 'collectFruitFromGround',
//     returns: ['success', 'failure'],
//     tasks: [
//       'walkTo',
//       [
//         'takeFruitToInventory', {
//           'success': { 'return': 'success'},
//           'fruitGone': {'return': 'failure'}
//         }
//       ]
//     ]
//   },
//   {
//     name: 'findFruit',
//     returns: ['ground', 'store'],
//   },
//   {
//     name: 'getFruit',
//     tasks: [
//       [
//         'findFruit', {
//           'ground': 'collectFruitFromGround'
//         }
//       ]
//     ],

//   },
//   {
//     'task': 'lookForFruit',
//     'result': {
//       'ground': [
//         {
//           'task': 'walkTo',
//         },
//         {
//           'task': 'takeFruitToInventory',
//           'result': {
//             'success': [],
//             'fruitGone': ['lookForFruit']
//           }
//         }
//       ],
//       'store': [],
//       'notFound': [],
//     }
//   }
// ]

// function collectFruit(pos){
//   this.addSubroutine('walkTo', pos)

// }

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
  isEating: boolean
  occupation: string

  constructor(pos: Pos, world: World) {
    this.pos = pos
    this.world = world
    this.inventory = undefined
    this.energy = INITIAL_ENERGY
    this.isEating = false
    this.currentTask = undefined
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

  getNextTask() {
    if (this.energy < EAT_WHEN_LESS_THEN) {
      return 'eating'
    } else {
      return 'harvesting'
    }
  }

  tick() {
    if (this.energy <= 0) {
      return
    }

    switch (this.occupation) {
      case 'harvesting': {
      }

      case 'eating': {
      }
    }

    this.energy -= 1

    if (this.isEating) {
      this.takeBite()
    } else if (this.energy < EAT_WHEN_LESS_THEN) {
      if (
        this.inventory &&
        (this.inventory.type === 'Apple' || this.inventory.type === 'Pear')
      ) {
        this.eat()
      } else if (this.target?.type !== 'House') {
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

  eat() {
    this.log(`Eat ${this.inventory}`)
    this.isEating = true
  }

  takeBite() {
    const fruit = this.inventory as Apple | Pear
    const bite = fruit.takeBite(EAT_PER_TICK)
    this.energy = Math.min(this.energy + bite, MAX_ENERGY)
    if (this.energy === MAX_ENERGY) {
      this.isEating = false
      this.inventory = undefined // There might be some left. Let's throw it away anyawy
    }
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
            this.inventory = obj
            this.eat()
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
