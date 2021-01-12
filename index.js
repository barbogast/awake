const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomPos() {
  return new Pos(getRandomArbitrary(1, 500), getRandomArbitrary(1, 500));
}

function drawCircle(pos, color) {
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

class Pos {
  constructor(x, y) {
    this.vector = new Vector(x, y);
  }

  get x() {
    return this.vector["0"];
  }

  get y() {
    return this.vector["1"];
  }

  set x(value) {
    this.vector = new Vector(value, this.y);
  }

  set y(value) {
    this.vector = new Vector(this.x, value);
  }

  equal(pos) {
    return this.x === pos.x && this.y === pos.y;
  }
}

class Person {
  constructor(pos, world) {
    this.pos = pos;
    this.world = world;
  }

  setHome(home) {
    this.home = home;
  }

  tick() {
    if (this.target) {
      if (this.pos.equal(this.target.pos)) {
        this.world.remove(this.target);
        this.target = undefined;
      } else {
        this.moveTowards(this.target);
      }
    } else {
      this.target = this.world.find(Apple);
    }
  }

  moveTowards(target) {
    const diffX = this.pos.x - target.pos.x;
    const diffY = this.pos.y - target.pos.y;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      this.pos.x += diffX > 0 ? -1 : 1;
    } else {
      this.pos.y += diffY > 0 ? -1 : 1;
    }
  }

  draw() {
    drawCircle(this.pos, "blue");
  }
}

class Apple {
  constructor(pos) {
    this.pos = pos;
  }

  draw() {
    drawCircle(this.pos, "green");
  }
}

class Home {
  constructor(pos) {
    this.pos = pos;
  }

  draw() {
    drawCircle(this.pos, "black");
  }
}

class World {
  constructor() {
    this.objects = [];
  }

  find(type) {
    return this.objects.find((o) => o.constructor === type);
  }

  remove(obj) {
    this.objects = this.objects.filter((o) => o !== obj);
  }

  tick() {
    for (const obj of this.objects) {
      if (obj.tick) {
        obj.tick();
      }
    }
  }

  draw() {
    for (const obj of this.objects) {
      obj.draw();
    }
  }
}

function addApple(world) {
  const x = getRandomArbitrary(1, 500);
  const y = getRandomArbitrary(1, 500);
  const apple = new Apple(getRandomPos());
  world.objects.push(apple);
  setTimeout(() => addApple(world), getRandomArbitrary(0.5, 3) * 1000);
}

function main() {
  const world = new World();
  const home = new Home(new Pos(50, 50));
  const person = new Person(new Pos(50, 50), world);
  person.setHome(home);

  world.objects.push(person);
  world.objects.push(home);

  function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world.tick();
    world.draw();
    requestAnimationFrame(renderLoop);
  }

  renderLoop();
  addApple(world);
}
