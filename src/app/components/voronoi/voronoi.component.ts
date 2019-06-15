import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Delaunay } from 'd3-delaunay';
import { Vector2D } from '../../model/vector';
import * as d3 from 'd3';

const SPEED = 10;
const FPS = 25;
const PARTICLE_COUNT = 100;
const MAX_DISTANCE_FROM_MOUSE = 400;
const MAX_MOUSE_OPACITY = 0.1;

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

  constructor() {
  }

  ngOnInit() {
    this.container = this.canvasContainer.nativeElement;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.canvas = d3.select(this.container).append('canvas')
      .attr('width', this.width)
      .attr('height', this.height)
      .node();

    this.context = this.canvas.getContext('2d');

    this.particles = Array.from({length: 100}, () => Particle.random(this.width, this.height));

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
    const voronoi = delaunay.voronoi([0, 0, this.width, this.height]);

    this.context.clearRect(0, 0, this.width, this.height);

    if (this.mouseInCanvas && this.canvasMousePos.x >= 0 && this.canvasMousePos.y >= 0) {

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
    this.context.strokeStyle = 'rgb(116,116,116)';
    this.context.lineWidth = 3;
    this.context.stroke();

    // this.context.beginPath();
    // delaunay.renderPoints(this.context);
    // this.context.fillStyle = '#fff';
    // this.context.fill();
  }

  private updateParticles() {
    const currentTs = Date.now();

    const t = (currentTs - this.currentTime) / 1000.0;

    this.particles = this.particles.filter(p => p.position.x >= 0 && p.position.x <= this.width &&
      p.position.y >= 0 && p.position.y <= this.height);

    for (const particle of this.particles) {
      particle.update(t);
    }

    while (this.particles.length < PARTICLE_COUNT) {
      const p = this.particles[Math.floor(Math.random() * this.particles.length)];
      const newP = Particle.random(this.width, this.height);
      newP.position.x = p.position.x;
      newP.position.y = p.position.y;
      this.particles.push(newP);
    }

    this.currentTime = currentTs;
  }
}

class Particle {
  position: Vector2D;
  v: Vector2D;

  static random(width: number, height: number): Particle {
    const p = new Particle();
    const angle = Math.random() * Math.PI * 2;
    p.position = new Vector2D(Math.random() * width, Math.random() * height);
    p.v = new Vector2D(Math.cos(angle) * SPEED, Math.sin(angle) * SPEED);
    return p;
  }

  update(t: number) {
    this.position.add(this.v.scale(t));
  }
}
