import Apple from './sim/apple'
import House from './sim/house'
import Person from './sim/person'
import Pos from './sim/pos'

export interface Object1 {
  pos: Pos
  id: string
  setId(id: string): void
  tick?(): void
  draw(ctx: CanvasRenderingContext2D): void
  getHitbox(): Hitbox | void
  debugInfo(): any
}

export type ObjectType = typeof Person | typeof Apple | typeof House

export type Hitbox = {
  x: [number, number]
  y: [number, number]
}
