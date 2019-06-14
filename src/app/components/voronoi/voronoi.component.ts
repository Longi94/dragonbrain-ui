import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Delaunay } from 'd3-delaunay';
import * as d3 from 'd3';

const SPEED = 10;

@Component({
  selector: 'app-voronoi',
  templateUrl: './voronoi.component.html',
  styleUrls: ['./voronoi.component.scss']
})
export class VoronoiComponent implements OnInit {

  @ViewChild('canvas')
  private canvasContainer: ElementRef;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private particles: number[][];

  constructor() {
  }

  ngOnInit() {
    this.canvas = this.canvasContainer.nativeElement;
    this.context = this.canvas.getContext('2d');

    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;

    this.particles = Array.from({length: 100}, () => [Math.random() * this.width, Math.random() * this.height]);

    this.update();
  }

  update() {

    const delaunay = Delaunay.from(this.particles);
    const voronoi = delaunay.voronoi([-0.5, -0.5, this.width + 0.5, this.height + 0.5]);

    this.context.clearRect(0, 0, this.width, this.height);

    this.context.beginPath();
    voronoi.render(this.context);
    voronoi.renderBounds(this.context);
    this.context.strokeStyle = '#fff';
    this.context.stroke();
  }
}
