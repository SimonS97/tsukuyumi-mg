import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import { defineHex, Grid, rectangle } from 'honeycomb-grid';
import { HttpClient } from '@angular/common/http';
import { Maprules } from '../maprules';
import { Areatype } from '../areatype';
import { HexagonType } from '../hexagon-type';

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
  // Wir benötigen im Default 28 + 8 MondTiles
  gridWidth = 8;
  gridHeight = 8;
  // rules = new Map<string, number>();
  ruleSet: Maprules = { areaType: [], hasMoon: false, playerAmount: 0 };
  titleSet = [];
  configUrl = 'assets/rules.json';
  availableGridSize = this.gridWidth * this.gridHeight;
  numberArray = Array.from(
    { length: this.availableGridSize },
    (_, index) => index + 1
  );
  hexagonTitles = Array(64).fill('leer');

  constructor(private http: HttpClient) {
    this.getConfig();
  }

  ngAfterViewInit(): void {
    this.generateConfig();
  }

  // Hier sollen alle Titel der Hexagons befüllt werden
  generateTitles() {
    this.createDefaultHexagons(this.hexagonTitles);
  }

  getConfig() {
    return this.http.get<Maprules>(this.configUrl);
  }

  generateConfig() {
    return this.getConfig().subscribe({
      next: (data: Maprules) => {
        this.ruleSet = {
          areaType: data.areaType,
          hasMoon: data.hasMoon,
          playerAmount: data.playerAmount,
        };
        console.log('Geladenes Regelwerk:');
        console.log(this.ruleSet);
      },
      complete: () => {
        // Hier werden die Schritte nach und nach im Anschluss der Config ausgeführt!
        this.generateTitles();
        this.createHexagonDrawing();
      },
    });
  }

  /*
    Hier werden die Einzelnen Hexagon-Fälle generiert
  */

  createDefaultHexagons(hexagonTitles: string[]) {
    let count = 0;

    const meeresBodenAnz = this.ruleSet.areaType.find(
      (area) => area.title === 'Meeresboden'
    )?.requiredAmount;
    while (count < meeresBodenAnz!) {
      const randomIndex = Math.floor(Math.random() * 64);
      if (this.isHexagonValidTarget(hexagonTitles[randomIndex])) {
        hexagonTitles[randomIndex] = 'Meeresboden';
        count++;
      }
    }
  }

  isHexagonValidTarget(hexagon: string): boolean {
    if (hexagon === 'leer') {
      return true;
    }
    return false;
  }

  /*
    Hier wird das rendern der Hexagons durchgeführt
    Styling + Textübergabe
  */

  createHexagonDrawing() {
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
      const newText = this.renderHex(hex, graphics, counter);
      app.stage.addChild(newText);
      counter++;
    });
    console.log(counter);
  }

  renderHex(hex: any, graphics: PIXI.Graphics, counter: number): PIXI.Text {
    // Übergebene Titel des Hexagons
    let title = this.hexagonTitles[counter];
    this.setHexagonLineStyle(graphics, title);

    graphics.drawShape(new PIXI.Polygon(hex.corners));

    const textStyle = this.getHexagonText(title);

    // Einkommentieren und nutzen um die korrekten Koordinaten der Hexagons zu sehen (q|r)
    // const coordinateText = hex.r.toString() + '/' + hex.q.toString();

    const text = new PIXI.Text(title, textStyle);
    text.anchor.set(0.5);
    text.x = hex.x;
    text.y = hex.y;

    return text;
  }

  getHexagonText(title: HexagonType): PIXI.TextStyle {
    const textStyle = new PIXI.TextStyle({
      fill: '#000000',
      fontSize: 12,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: 10,
      align: 'center',
    });
    switch (title) {
      case 'leer':
        return textStyle;
      case 'Meeresboden':
        textStyle.fill = '#2CA6A4';
        return textStyle;
      case 'Gebirge':
        return textStyle;
      case 'Flussland':
        return textStyle;
      case 'Instabil':
        return textStyle;
      case 'Radioaktiv':
        return textStyle;
      case 'Tsukuyumi':
        return textStyle;
      case 'Toxisch':
        return textStyle;

      default:
        return textStyle;
    }
  }

  setHexagonLineStyle(graphics: PIXI.Graphics, hexagonTitle: HexagonType) {
    switch (hexagonTitle) {
      case 'leer':
        graphics.lineStyle(1, 0x999999, 0.5);
        break;
      case 'Meeresboden':
        graphics.lineStyle(1, '#2CA6A4');
        break;
      case 'Gebirge':
        graphics.lineStyle(1, 0x999999);
        break;
      case 'Flussland':
        graphics.lineStyle(1, 0x999999);
        break;
      case 'Instabil':
        graphics.lineStyle(1, 0x999999);
        break;
      case 'Radioaktiv':
        graphics.lineStyle(1, 0x999999);
        break;
      case 'Tsukuyumi':
        graphics.lineStyle(1, 0x999999);
        break;
      case 'Toxisch':
        graphics.lineStyle(1, 0x999999);
        break;

      default:
        graphics.lineStyle(1, 0x999999);
    }
  }
}
