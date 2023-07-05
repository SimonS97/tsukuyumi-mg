import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-hexagon',
  template: '<canvas #pixiCanvas></canvas>',
  styleUrls: ['./hexagon.component.css'],
})
export class HexagonComponent implements AfterViewInit {
  @ViewChild('pixiCanvas', { static: true })
  pixiCanvas!: ElementRef<HTMLCanvasElement>;

  app!: PIXI.Application;
  hexagonSize = 50;
  hexagonWidth = Math.sqrt(3) * this.hexagonSize;
  hexagonHeight = 2 * this.hexagonSize;

  ngAfterViewInit(): void {
    this.app = new PIXI.Application({
      view: this.pixiCanvas.nativeElement,
      width: 800,
      height: 600,
      // Hintergrundfarbe der Hexagon Komponente
      backgroundColor: '#ffff',
    });

    // Zeichne ein Hexagon
    const hexagon = new PIXI.Graphics();
    hexagon.beginFill('#8AB0AB');
    hexagon.lineStyle(4, '#1A1D1A', 1);
    hexagon.drawPolygon([
      -this.hexagonWidth / 2,
      -this.hexagonHeight / 2,
      this.hexagonWidth / 2,
      -this.hexagonHeight / 2,
      this.hexagonWidth,
      0,
      this.hexagonWidth / 2,
      this.hexagonHeight / 2,
      -this.hexagonWidth / 2,
      this.hexagonHeight / 2,
      -this.hexagonWidth,
      0,
    ]);
    hexagon.endFill();
    hexagon.x = this.app.screen.width / 2;
    hexagon.y = this.app.screen.height / 2;

    this.app.stage.addChild(hexagon);
  }
}
