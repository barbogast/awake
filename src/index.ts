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
