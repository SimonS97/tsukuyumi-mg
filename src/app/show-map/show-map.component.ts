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
  // Tatsächlichen Dimensionen des Grids
  // gridWidth * gridHeight = Anzahl Hexagons sollte immer 28 sein
  gridWidth = 5;
  gridHeight = 6;

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

    // Hiermit Hexagons Ausblende + Text #fffff
    graphics.lineStyle(1, 0x999999);
    let counter = 0;

    grid.forEach((hex: any) => {
      const newText = renderHex(hex, graphics);
      app.stage.addChild(newText);
      counter++;
    });
    console.log(counter);
  }
}

function renderHex(hex: any, graphics: PIXI.Graphics): PIXI.Text {
  graphics.drawShape(new PIXI.Polygon(hex.corners));

  const textStyle = new PIXI.TextStyle({
    fill: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
    wordWrap: true,
    wordWrapWidth: 10,
    align: 'center',
  });

  const text = new PIXI.Text('Test', textStyle);
  text.anchor.set(0.5);
  text.x = hex.x;
  text.y = hex.y;

  return text;
}
