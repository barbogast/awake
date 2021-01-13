class Pos {
  constructor(x: number, y: number) {
    // @ts-ignore
    this.vector = new Vector(x, y)
  }

  get x(): number {
    // @ts-ignore
    return this.vector['0']
  }

  get y(): number {
    // @ts-ignore
    return this.vector['1']
  }

  set x(value) {
    // @ts-ignore
    this.vector = new Vector(value, this.y)
  }

  set y(value) {
    // @ts-ignore
    this.vector = new Vector(this.x, value)
  }

  equals(pos: Pos) {
    return this.x === pos.x && this.y === pos.y
  }

  clone() {
    return new Pos(this.x, this.y)
  }
}

export default Pos
