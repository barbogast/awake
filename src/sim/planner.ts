class Observable {
  constructor() {
    this.listeners = new Set()
  }

  addListener(callback) {
    this.listeners.add(callback)
  }

  call() {
    this.listeners.forEach((listener) => listener)
  }
}

class Planner {
  constructor() {
    this.calls = {}
  }

  wait(s) {
    if (this.calls[s]?.length) {
      const res = this.calls[s].shift()
      return res
    } else {
      throw new Error(s)
    }
  }

  exec(func) {
    try {
      func(this)
    } catch (e) {
      console.log(`Caught "wait" for "${e.message}"`)
    }
  }

  call(name, args) {
    if (!this.calls[name]) {
      this.calls[name] = []
    }
    this.calls[name].push(args)
  }
}

const adam = {
  pos: 5,
  target: undefined,
}

const setTarget = (person, target) => {
  return {
    ...person,
    target,
  }
}

const walk = (person) => {
  const newPerson = {
    ...person,
    pos: person.pos + 1,
  }
  if(newPerson.pos === newPerson.target){

  }
  return newPerson
}

const collectFood = (person) => withPlanner((planner){
    
}

const add = (a, b) => a + b

const x = (planner: Planner) => {
  let a = 0
  a = add(a, 5)
  setTarget(person, 10)
  const aha = planner.wait('walkTo')
  a = add(a, 6)
  console.log('aha', aha)

  return a
}

console.log('asdf')

const p = new Planner()
p.exec(x)
p.exec(x)

p.call('walkTo', 5)
p.exec(x)

export default Planner
