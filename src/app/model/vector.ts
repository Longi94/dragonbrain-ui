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

  distance(other: Vector2D): number {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }

  distanceToSegment(v: Vector2D, w: Vector2D): number {
    const l2 = v.distance(w);

    if (l2 === 0) {
      return this.distance(v);
    }

    let t = ((this.x - v.x) * (w.x - v.x) + (this.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));

    return this.distance(new Vector2D(
      v.x + t * (w.x - v.x),
      v.y + t * (w.y - v.y)
    ));
  }
}
