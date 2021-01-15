import { render, h, Fragment } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import Apple from './sim/apple.js'
import House from './sim/house.js'
import Person from './sim/person.js'
import Pos from './sim/pos.js'
import World from './sim/world.js'
import Dashboard from './dashboard.js'

import { getRandomArbitrary, getRandomPos } from './sim/utils.js'
import { HEIGHT, WIDTH } from './constants.js'
import Pear from './sim/pear.js'

function addAppleAddRandomPos(world: World) {
  let counter = 0
  while (true) {
    const fruits = world.getObjectsByType()
    if (fruits.Apple && fruits.Apple.length >= 20) {
      return
    }

    let Fruit
    if (getRandomArbitrary(0, 2)) {
      Fruit = Apple
    } else {
      Fruit = Pear
    }
    const apple = new Fruit(getRandomPos())
    if (world.add(apple)) {
      return
    }
    if (counter > 1000) {
      throw new Error('No free spot for apple found')
    }
    counter += 1
  }
}

function addApples(world: World) {
  addAppleAddRandomPos(world)
  setTimeout(() => addApples(world), getRandomArbitrary(1, 3) * 1000)
}

let world: World

function main(callback: () => void) {
  const canvas1 = document.getElementById('myCanvas1') as HTMLCanvasElement
  const ctx1 = canvas1.getContext('2d') as CanvasRenderingContext2D
  const canvas2 = document.getElementById('myCanvas2') as HTMLCanvasElement
  const ctx2 = canvas2.getContext('2d') as CanvasRenderingContext2D

  world = new World(ctx1, ctx2)
  const home = new House(new Pos(50, 50), world)
  const person1 = new Person(new Pos(50, 50), world)
  const person2 = new Person(new Pos(100, 100), world)

  world.add(person1)
  world.add(person2)
  world.add(home)

  function renderLoop() {
    ctx1.clearRect(0, 0, WIDTH, HEIGHT)
    ctx2.clearRect(0, 0, WIDTH, HEIGHT)
    world.tick()
    world.draw()
    callback()
    requestAnimationFrame(renderLoop)
  }

  renderLoop()
  addApples(world)
}

const App = () => {
  const [counter, setCounter] = useState(0)
  useEffect(() => main(() => setCounter((c) => c + 1)), [])

  return (
    <div>
      <div class="canvas-wrapper">
        <canvas id="myCanvas1" class="canvas" width="500" height="500"></canvas>
        <canvas id="myCanvas2" class="canvas" width="500" height="500"></canvas>
      </div>
      Frame: {counter}
      <br />
      {world && <Dashboard world={world} />}
    </div>
  )
}
const root = document.getElementById('root')

if (root) {
  render(<App />, root)
}
