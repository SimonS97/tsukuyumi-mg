import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import { defineHex, Grid, rectangle } from 'honeycomb-grid';

@Component({
  selector: 'app-show-map',
  template: '<canvas #pixiCanvas></canvas>',
  styleUrls: ['./show-map.component.css'],
})
export class ShowMapComponent implements AfterViewInit {
  @ViewChild('pixiCanvas', { static: true })
  pixiCanvas!: ElementRef<HTMLCanvasElement>;
  hexagonSize = 30;
  hexagonOrigin = 'topLeft'; // 'center' if you want the center to be the origin
  gridWidth = 10;
  gridHeight = 10;

  ngAfterViewInit(): void {
    const Hex = defineHex({
      dimensions: this.hexagonSize,
      origin: 'topLeft',
    });
    const grid = new Grid(
      Hex,
      rectangle({ width: this.gridWidth, height: this.gridHeight })
    );

    const app = new PIXI.Application({
      backgroundAlpha: 0,
      view: this.pixiCanvas.nativeElement,
    });
    const graphics = new PIXI.Graphics();
    app.stage.addChild(graphics);

    graphics.lineStyle(1, 0x999999);

    grid.forEach((hex: any) => renderHex(hex, graphics));
  }
}

function renderHex(hex: any, graphics: PIXI.Graphics) {
  graphics.drawShape(new PIXI.Polygon(hex.corners));
}
