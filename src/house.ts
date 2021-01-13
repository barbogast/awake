import Pos from "./pos.js";
import { Hitbox, Object } from "./index.js";
import { chunkArray, drawRect } from "./utils.js";

class House implements Object {
  size = 70;
  store: Object[];

  constructor(pos: Pos) {
    this.pos = pos;
    this.store = [];
  }
  pos: Pos;

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

export default House;
