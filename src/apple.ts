import Pos from "./pos.js";
import { Hitbox, Object } from "types.js";
import { drawCircle } from "./utils.js";

class Apple implements Object {
  radius = 5;
  pos: Pos;
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

export default Apple;
