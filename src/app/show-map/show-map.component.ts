import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import { defineHex, Grid, rectangle } from 'honeycomb-grid';
import { HttpClient } from '@angular/common/http';
import { Maprules } from '../maprules';

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
  // Aktuell 36 Tiles
  gridWidth = 6;
  gridHeight = 6;
  // rules = new Map<string, number>();
  ruleSet: Maprules = { areaType: [], hasMoon: false, playerAmount: 0 };
  configUrl = 'assets/rules.json';

  constructor(private http: HttpClient) {
    this.getConfig();
  }

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
    this.generateConfig();
  }

  getConfig() {
    return this.http.get<Maprules>(this.configUrl);
  }

  generateConfig() {
    this.getConfig().subscribe((data: Maprules) => {
      this.ruleSet = {
        areaType: data.areaType,
        hasMoon: data.hasMoon,
        playerAmount: data.playerAmount,
      };
      console.log('Geladenes Regelwerk:');
      console.log(this.ruleSet);
    });
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
