const WIDTH = 200;
const HEIGHT = 200;

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomPos() {
  return new Pos(getRandomArbitrary(1, WIDTH), getRandomArbitrary(1, HEIGHT));
}

function chunkArray(array, chunkSize) {
  return [].concat.apply(
    [],
    array.map(function (elem, i) {
      return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
    })
  );
}

function drawCircle(ctx, pos, color, radius) {
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawRect(ctx, pos, color, size) {
  ctx.fillStyle = color;
  const s = size / 2;
  ctx.fillRect(pos.x - s, pos.y - s, size, size);
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

  equals(pos) {
    return this.x === pos.x && this.y === pos.y;
  }

  clone() {
    return new Pos(this.x, this.y);
  }
}

class Person {
  radius = 12;

  constructor(pos, world) {
    this.pos = pos;
    this.world = world;
    this.inventory = undefined;
  }

  setTarget(pos, type) {
    this.target = { pos, type };
  }

  tick() {
    if (this.target?.pos) {
      if (this.pos.equals(this.target.pos)) {
        this.targetReached();
      } else {
        this.moveTowards(this.target);
      }
    } else {
      this.setTarget(this.world.findPos(Apple), Apple);
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

    if (this.inventory) {
      this.inventory.pos = this.pos.clone();
    }
  }

  draw(ctx) {
    drawCircle(ctx, this.pos, "lightblue", this.radius);
    if (this.inventory) {
      this.inventory.draw(ctx);
    }
  }

  targetReached() {
    switch (this.target.type) {
      case Apple: {
        const apple = this.world.takeObject(Apple, this.target.pos);
        if (apple) {
          this.inventory = apple;
          this.setTarget(this.world.findPos(House), House);
        } else {
          // Someone else must have picked up the apple; let's find a new one
          this.setTarget(this.world.findPos(Apple), Apple);
        }
        break;
      }

      case House: {
        this.world.interact(House, this.pos, "addToStore", [this.inventory]);
        this.inventory = undefined;
        this.setTarget(this.world.findPos(Apple), Apple);
        break;
      }
    }
  }
  getHitbox() {
    return undefined;
  }
}

class Apple {
  radius = 5;
  constructor(pos) {
    this.pos = pos;
  }

  draw(ctx) {
    drawCircle(ctx, this.pos, "green", this.radius);
  }

  getHitbox() {
    return {
      x: [this.pos.x - this.radius, this.pos.x + this.radius],
      y: [this.pos.y - this.radius, this.pos.y + this.radius],
    };
  }
}

class House {
  size = 70;

  constructor(pos) {
    this.pos = pos;
    this.store = [];
  }

  draw(ctx) {
    drawRect(ctx, this.pos, "black", this.size);

    const rows = chunkArray(this.store, 3);
    rows.forEach((row, i) => {
      const y = this.pos.y - 12.5 + i * 15;
      row.forEach((obj, i) => {
        const x = this.pos.x - 12.5 + i * 15;
        obj.pos.x = x;
        obj.pos.y = y;
        obj.draw(ctx);
      });
    });
  }

  addToStore(obj) {
    this.store.push(obj);
  }

  getHitbox() {
    const halfSize = this.size / 2;
    return {
      x: [this.pos.x - halfSize, this.pos.x + halfSize],
      y: [this.pos.y - halfSize, this.pos.y + halfSize],
    };
  }
}

class World {
  constructor(ctx1, ctx2) {
    this.ctx1 = ctx1;
    this.ctx2 = ctx2;
    this.objects = [];
  }

  objectCollides(objA) {
    const hitboxA = objA.getHitbox();
    if (!hitboxA) {
      return false;
    }

    for (const objB of this.objects) {
      const hitboxB = objB.getHitbox();
      if (!hitboxB) {
        continue;
      }

      const aRightOfB = hitboxB.x[1] < hitboxA.x[0];
      const bRightOfA = hitboxA.x[1] < hitboxB.x[0];
      if (!(aRightOfB || bRightOfA)) {
        return true;
      }

      const aBelowB = hitboxB.y[1] < hitboxA.y[0];
      const bBelowA = hitboxA.y[1] < hitboxB.y[0];
      if (!(aBelowB || bBelowA)) {
        return true;
      }
    }
    return false;
  }

  _findAt(type, pos) {
    return this.objects.find(
      (obj) => obj.constructor === type && obj.pos.equals(pos)
    );
  }

  add(obj) {
    if (this.objectCollides(obj)) {
      return false;
    } else {
      this.objects.push(obj);
      return true;
    }
  }

  findPos(type) {
    const objects = this.objects.filter((o) => o.constructor === type);
    const obj = objects[Math.floor(Math.random() * objects.length)];
    return obj ? obj.pos : undefined;
  }

  takeObject(type, pos) {
    const obj = this._findAt(type, pos);
    if (!obj) {
      return undefined;
    }
    this.objects.splice(this.objects.indexOf(obj), 1);
    return obj;
  }

  interact(type, pos, method, params) {
    this._findAt(type, pos)[method](...params);
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
      obj.draw(obj.constructor === House ? this.ctx1 : this.ctx2);
    }
  }
}

function addAppleAddRandomPos(world) {
  let counter = 0;
  while (true) {
    const apple = new Apple(getRandomPos());
    if (world.add(apple)) {
      return;
    }
    if (counter > 1000) {
      throw new Error("No free spot for apple found");
    }
    counter += 1;
  }
}

function addApples(world) {
  addAppleAddRandomPos(world);
  setTimeout(() => addApples(world), getRandomArbitrary(1, 3) * 1000);
}

function main() {
  const canvas1 = document.getElementById("myCanvas1");
  const ctx1 = canvas1.getContext("2d");
  const canvas2 = document.getElementById("myCanvas2");
  const ctx2 = canvas2.getContext("2d");

  const world = new World(ctx1, ctx2);
  const home = new House(new Pos(50, 50));
  const person1 = new Person(new Pos(50, 50), world);
  const person2 = new Person(new Pos(100, 100), world);

  world.add(person1);
  world.add(person2);
  world.add(home);

  function renderLoop() {
    ctx1.clearRect(0, 0, WIDTH, HEIGHT);
    ctx2.clearRect(0, 0, WIDTH, HEIGHT);
    world.tick();
    world.draw();
    requestAnimationFrame(renderLoop);
  }

  renderLoop();
  addApples(world);
}
