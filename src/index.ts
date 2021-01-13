const WIDTH = 200;
const HEIGHT = 200;

function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomPos() {
  return new Pos(getRandomArbitrary(1, WIDTH), getRandomArbitrary(1, HEIGHT));
}

function chunkArray<T>(sourceArray: T[], chunkSize: number): T[][] {
  let innerArray = [];
  const outerArray = [];

  for (const el of sourceArray) {
    innerArray.push(el);
    if (innerArray.length === chunkSize) {
      outerArray.push(innerArray);
      innerArray = [];
    }
  }
  if (innerArray.length !== chunkSize) {
    outerArray.push(innerArray);
  }

  return outerArray;
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  pos: Pos,
  color: string,
  radius: number
) {
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawRect(
  ctx: CanvasRenderingContext2D,
  pos: Pos,
  color: string,
  size: number
) {
  ctx.fillStyle = color;
  const s = size / 2;
  ctx.fillRect(pos.x - s, pos.y - s, size, size);
}

class Pos {
  constructor(x: number, y: number) {
    // @ts-ignore
    this.vector = new Vector(x, y);
  }

  get x(): number {
    // @ts-ignore
    return this.vector["0"];
  }

  get y(): number {
    // @ts-ignore
    return this.vector["1"];
  }

  set x(value) {
    // @ts-ignore
    this.vector = new Vector(value, this.y);
  }

  set y(value) {
    // @ts-ignore
    this.vector = new Vector(this.x, value);
  }

  equals(pos: Pos) {
    return this.x === pos.x && this.y === pos.y;
  }

  clone() {
    return new Pos(this.x, this.y);
  }
}

type Hitbox = {
  x: [number, number];
  y: [number, number];
};

interface Object {
  pos: Pos;
  tick(): void;
  draw(ctx: CanvasRenderingContext2D): void;
  getHitbox(): Hitbox | void;
}

type ObjectType = typeof Person | typeof Apple | typeof House;

class Person implements Object {
  radius = 12;
  pos: Pos;
  world: World;
  inventory: undefined | Object;
  target: { pos: Pos; type: ObjectType } | undefined;

  constructor(pos: Pos, world: World) {
    this.pos = pos;
    this.world = world;
    this.inventory = undefined;
  }

  setTarget(type: ObjectType) {
    const pos = this.world.findPos(type);
    if (pos) {
      this.target = { pos, type };
    }
  }

  tick() {
    if (this.target?.pos) {
      if (this.pos.equals(this.target.pos)) {
        this.targetReached();
      } else {
        this.moveTowards();
      }
    } else {
      this.setTarget(Apple);
    }
  }

  moveTowards() {
    if (!this.target) {
      return;
    }
    const diffX = this.pos.x - this.target.pos.x;
    const diffY = this.pos.y - this.target.pos.y;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      this.pos.x += diffX > 0 ? -1 : 1;
    } else {
      this.pos.y += diffY > 0 ? -1 : 1;
    }

    if (this.inventory) {
      this.inventory.pos = this.pos.clone();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawCircle(ctx, this.pos, "lightblue", this.radius);
    if (this.inventory) {
      this.inventory.draw(ctx);
    }
  }

  targetReached() {
    switch (this.target?.type) {
      case Apple: {
        const apple = this.world.takeObject(Apple, this.target.pos);
        if (apple) {
          this.inventory = apple;
          this.setTarget(House);
        } else {
          // Someone else must have picked up the apple; let's find a new one
          this.setTarget(Apple);
        }
        break;
      }

      case House: {
        this.world.interact(House, this.pos, "addToStore", [this.inventory]);
        this.inventory = undefined;
        this.setTarget(Apple);
        break;
      }
    }
  }
  getHitbox() {
    return undefined;
  }
}

class Apple implements Object {
  radius = 5;
  constructor(pos: Pos) {
    this.pos = pos;
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawCircle(ctx, this.pos, "green", this.radius);
  }

  getHitbox() {
    const h: Hitbox = {
      x: [this.pos.x - this.radius, this.pos.x + this.radius],
      y: [this.pos.y - this.radius, this.pos.y + this.radius],
    };
    return h;
  }
}

class House implements Object {
  size = 70;
  store: Object[];

  constructor(pos: Pos) {
    this.pos = pos;
    this.store = [];
  }

  draw(ctx: CanvasRenderingContext2D) {
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

  addToStore(obj: Object) {
    this.store.push(obj);
  }

  getHitbox() {
    const halfSize = this.size / 2;
    const h: Hitbox = {
      x: [this.pos.x - halfSize, this.pos.x + halfSize],
      y: [this.pos.y - halfSize, this.pos.y + halfSize],
    };
    return h;
  }
}

function addAppleAddRandomPos(world: World) {
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

function addApples(world: World) {
  addAppleAddRandomPos(world);
  setTimeout(() => addApples(world), getRandomArbitrary(1, 3) * 1000);
}

function main() {
  const canvas1 = document.getElementById("myCanvas1") as HTMLCanvasElement;
  const ctx1 = canvas1.getContext("2d") as CanvasRenderingContext2D;
  const canvas2 = document.getElementById("myCanvas2") as HTMLCanvasElement;
  const ctx2 = canvas2.getContext("2d") as CanvasRenderingContext2D;

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
