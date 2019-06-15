import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Delaunay } from 'd3-delaunay';
import { Vector2D } from '../../model/vector';
import * as d3 from 'd3';

const SPEED = 10;
const FPS = 25;
const PARTICLE_COUNT = 200;
const MAX_DISTANCE_FROM_MOUSE = 400;
const MAX_MOUSE_OPACITY = 0.07;
const MOUSE_EDGE_SHADE = 150;
const MARGIN = 50;

@Component({
  selector: 'app-voronoi',
  templateUrl: './voronoi.component.html',
  styleUrls: ['./voronoi.component.scss']
})
export class VoronoiComponent implements OnInit {

  @ViewChild('canvasContainer')
  private canvasContainer: ElementRef;
  private container: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private particles: Particle[];
  private currentTime: number;
  private canvasMousePos: Vector2D = new Vector2D(-1, -1);
  private mouseInCanvas = false;

  private voronoiBounds: number[];

  constructor() {
  }

  ngOnInit() {
    this.container = this.canvasContainer.nativeElement;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.voronoiBounds = [0 - MARGIN, 0 - MARGIN, this.width + MARGIN, this.height + MARGIN];

    this.canvas = d3.select(this.container).append('canvas')
      .attr('width', this.width)
      .attr('height', this.height)
      .node();

    this.context = this.canvas.getContext('2d');

    this.particles = Array.from({length: PARTICLE_COUNT}, () => Particle.random(this.width, this.height, MARGIN));

    this.currentTime = Date.now();

    this.context.canvas.ontouchmove = event => this.onCanvasMouseMove(event);
    this.context.canvas.onmousemove = event => this.onCanvasMouseMove(event);
    this.context.canvas.onmouseout = () => this.mouseInCanvas = false;

    this.update();

    setTimeout(() => this.frame(), 1000 / FPS);
  }

  private onCanvasMouseMove(event) {
    this.mouseInCanvas = true;
    this.canvasMousePos.x = event.layerX;
    this.canvasMousePos.y = event.layerY;
  }

  private frame() {
    this.updateParticles();
    this.update();
    setTimeout(() => this.frame(), 1000 / FPS);
  }

  private update() {
    const delaunay = Delaunay.from(this.particles.map(p => p.position.toArray()));
    const voronoi = delaunay.voronoi(this.voronoiBounds);

    this.context.clearRect(0, 0, this.width, this.height);

    if (this.mouseInCanvas && this.canvasMousePos.x >= 0 && this.canvasMousePos.y >= 0) {
      // draw fills that react to mouse
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        const d = this.canvasMousePos.distance(p.position);

        let opacity = 0;
        if (voronoi.contains(i, this.canvasMousePos.x, this.canvasMousePos.y)) {
          opacity = MAX_MOUSE_OPACITY;
        } else if (d < MAX_DISTANCE_FROM_MOUSE) {
          opacity = MAX_MOUSE_OPACITY * ((MAX_DISTANCE_FROM_MOUSE - d) / MAX_DISTANCE_FROM_MOUSE);
        }

        if (opacity > 0) {
          const cell = voronoi.cellPolygon(i);
          if (cell) {
            this.context.beginPath();
            this.context.moveTo(cell[0][0], cell[0][1]);
            for (let k = 1; k < cell.length - 1; k++) {
              this.context.lineTo(cell[k][0], cell[k][1]);
            }
            this.context.lineTo(cell[cell.length - 1][0], cell[cell.length - 1][1]);
            this.context.closePath();
            this.context.fillStyle = `rgba(255,255,255,${opacity})`;
            this.context.fill();
          }
        }
      }
    }

    this.context.beginPath();
    voronoi.render(this.context);
    this.context.strokeStyle = 'rgb(65,65,65)';
    this.context.lineWidth = 3;
    this.context.stroke();

    if (this.mouseInCanvas && this.canvasMousePos.x >= 0 && this.canvasMousePos.y >= 0) {
      // draw edges that react to mouse
      const {delaunay: {halfedges, hull}, circumcenters, vectors} = voronoi;
      for (let i = 0, n = halfedges.length; i < n; ++i) {
        const j = halfedges[i];
        if (j < i) {
          continue;
        }
        const ti = Math.floor(i / 3) * 2;
        const tj = Math.floor(j / 3) * 2;
        const xi = circumcenters[ti];
        const yi = circumcenters[ti + 1];
        const xj = circumcenters[tj];
        const yj = circumcenters[tj + 1];

        const d = this.canvasMousePos.distanceToSegment(new Vector2D(xi, yi), new Vector2D(xj, yj));
        if (d < MAX_DISTANCE_FROM_MOUSE) {
          const s = 65 + (MOUSE_EDGE_SHADE - 65) * (MAX_DISTANCE_FROM_MOUSE - d) / MAX_DISTANCE_FROM_MOUSE;
          this.context.beginPath();
          voronoi._renderSegment(xi, yi, xj, yj, this.context);
          this.context.strokeStyle = `rgb(${s},${s},${s})`;
          this.context.lineWidth = 3;
          this.context.stroke();
        }
      }
      let node = hull;
      do {
        node = node.next;
        const t = Math.floor(node.t / 3) * 2;
        const x = circumcenters[t];
        const y = circumcenters[t + 1];
        const v = node.i * 4;
        const p = voronoi._project(x, y, vectors[v + 2], vectors[v + 3]);
        if (p) {
          const d = this.canvasMousePos.distanceToSegment(new Vector2D(x, y), new Vector2D(p[0], p[1]));

          if (d < MAX_DISTANCE_FROM_MOUSE) {
            const s = 65 + (MOUSE_EDGE_SHADE - 65) * (MAX_DISTANCE_FROM_MOUSE - d) / MAX_DISTANCE_FROM_MOUSE;
            this.context.beginPath();
            voronoi._renderSegment(x, y, p[0], p[1], this.context);
            this.context.strokeStyle = `rgb(${s},${s},${s})`;
            this.context.lineWidth = 3;
            this.context.stroke();
          }
        }
      } while (node !== hull);
    }

    // this.context.beginPath();
    // delaunay.renderPoints(this.context);
    // this.context.fillStyle = '#fff';
    // this.context.fill();
  }

  private updateParticles() {
    const currentTs = Date.now();

    const t = (currentTs - this.currentTime) / 1000.0;

    for (const particle of this.particles) {
      if (particle.position.x < this.voronoiBounds[0] || particle.position.x > this.voronoiBounds[2]) {
        particle.v.x = -particle.v.x;
      }
      if (particle.position.y < this.voronoiBounds[1] || particle.position.y > this.voronoiBounds[3]) {
        particle.v.y = -particle.v.y;
      }

      particle.update(t);
    }

    this.currentTime = currentTs;
  }
}

class Particle {
  position: Vector2D;
  v: Vector2D;

  static random(width: number, height: number, margin: number): Particle {
    const p = new Particle();
    const angle = Math.random() * Math.PI * 2;
    p.position = new Vector2D(Math.random() * (width + 2 * margin) - margin, Math.random() * (height + 2 * margin) - margin);
    p.v = new Vector2D(Math.cos(angle) * SPEED, Math.sin(angle) * SPEED);
    return p;
  }

  update(t: number) {
    this.position.add(this.v.scale(t));
  }
}
