import Apple from "./apple";
import House from "./house";
import Person from "./person";
import Pos from "./pos";

export interface Object {
  pos: Pos;
  tick?(): void;
  draw(ctx: CanvasRenderingContext2D): void;
  getHitbox(): Hitbox | void;
}

export type ObjectType = typeof Person | typeof Apple | typeof House;

export type Hitbox = {
  x: [number, number];
  y: [number, number];
};
