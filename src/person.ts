import Apple from "./apple.js";
import House from "./house.js";
import Pos from "./pos.js";
import World from "./world.js";
import { ObjectType, Object } from "./index.js";
import { drawCircle } from "./utils.js";

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

export default Person;
