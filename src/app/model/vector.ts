export class Vector2D {
  x = 0;
  y = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toArray(): number[] {
    return [this.x, this.y];
  }

  add(other: Vector2D): void {
    this.x += other.x;
    this.y += other.y;
  }

  scale(n: number): Vector2D {
    return new Vector2D(this.x * n, this.y * n);
  }
}
