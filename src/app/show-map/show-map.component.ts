import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import { defineHex, Grid, rectangle, Direction, Hex } from 'honeycomb-grid';
import { HttpClient } from '@angular/common/http';
import { Maprules } from '../maprules';
import { HexagonType } from '../hexagon-type';

@Component({
  selector: 'app-show-map',
  template: '<canvas #pixiCanvas></canvas>',
  styleUrls: ['./show-map.component.css'],
})
export class ShowMapComponent implements AfterViewInit {
  @ViewChild('pixiCanvas', { static: true })
  pixiCanvas!: ElementRef<HTMLCanvasElement>;
  hexagonSize = 45;
  hexagonOrigin = 'topLeft'; // 'center' if you want the center to be the origin
  // Tatsächlichen Dimensionen des Grids
  // gridWidth * gridHeight = Anzahl Hexagons sollte immer 28 sein
  // Wir benötigen im Default 28 + 8 MondTiles
  gridWidth = 8;
  gridHeight = 8;
  ruleSet: Maprules = { areaType: [], hasMoon: false, playerAmount: 0 };
  configUrl = 'assets/rules.json';
  hexagonTitles: HexagonType[][];

  constructor(private http: HttpClient) {
    this.getConfig();
    this.hexagonTitles = new Array(8).fill([]).map(() => Array(8).fill('leer'));
  }

  ngAfterViewInit(): void {
    this.generateConfig();
  }

  // Hier sollen alle Titel der Hexagons befüllt werden
  generateHexagonTitles() {
    const areaTypes = Object.values(HexagonType);
    for (const areaType of areaTypes) {
      if (areaType === 'Mondfeld') {
        this.createMondfeld(areaType);
      } else {
        this.createHexagonsByAreaType(areaType);
      }
    }
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
        this.generateHexagonTitles();
        this.createHexagonDrawing();
      },
    });
  }

  /*
    Hier werden die Einzelnen Hexagon-Fälle generiert anhand es ruleSet
  */

  createMondfeld(title: HexagonType) {
    let count = 0;
    let numberOfIterations = this.findAreaAmount(title);

    // const spiralTraverser = spiral({ start: [0, 2], radius: 1 })
    //grid.traverse(spiralTraverser)
    while (count < numberOfIterations) {
      const randomIndex1 = Math.floor(Math.random() * this.gridHeight);
      const randomIndex2 = Math.floor(Math.random() * this.gridWidth);
      if (
        this.isHexagonValidTarget(
          this.hexagonTitles[randomIndex1][randomIndex2]
        )
      ) {
        this.hexagonTitles[randomIndex1][randomIndex2] = title;
        count++;
      }
    }
  }

  createHexagonsByAreaType(title: HexagonType) {
    let count = 0;
    let numberOfIterations = this.findAreaAmount(title);

    while (count < numberOfIterations) {
      const randomIndex1 = Math.floor(Math.random() * this.gridHeight);
      const randomIndex2 = Math.floor(Math.random() * this.gridWidth);
      if (
        this.isHexagonValidTarget(
          this.hexagonTitles[randomIndex1][randomIndex2]
        )
      ) {
        this.hexagonTitles[randomIndex1][randomIndex2] = title;
        count++;
      }
    }
  }

  moveHexagon(
    qCoordinate: number,
    rCoordinate: number,
    hex: Hex,
    grid: Grid<Hex>
  ) {
    qCoordinate = hex.col;
    rCoordinate = hex.row;
    let tempTitle = this.hexagonTitles[qCoordinate][rCoordinate];
    let customOffset = 'NaN';

    if (rCoordinate < 7) {
      this.hexagonTitles[qCoordinate][rCoordinate] = HexagonType.Leer;
      this.hexagonTitles[qCoordinate][rCoordinate + 1] = tempTitle;
      customOffset = qCoordinate + '/' + (rCoordinate + 1);
    } else if (qCoordinate < 7) {
      this.hexagonTitles[qCoordinate][rCoordinate] = HexagonType.Leer;
      this.hexagonTitles[qCoordinate + 1][rCoordinate] = tempTitle;
      customOffset = qCoordinate + 1 + '/' + rCoordinate;
    } else {
      this.hexagonTitles[qCoordinate][rCoordinate] = HexagonType.Leer;
      this.hexagonTitles[qCoordinate - 1][rCoordinate - 1] = tempTitle;
      customOffset = qCoordinate - 1 + '/' + (rCoordinate - 1);
    }

    console.log(
      tempTitle +
        ' verschoben: ' +
        qCoordinate +
        '/' +
        rCoordinate +
        ' --> ' +
        customOffset
    );
  }

  findAreaAmount(hexagonTitle: HexagonType): number {
    return this.ruleSet.areaType.find((area) => area.title === hexagonTitle)
      ?.requiredAmount!;
  }

  /*
    Hexagon Validierungen und Fachliche Prüfungen
  */

  isHexagonValidTarget(hexagon: string): boolean {
    if (hexagon === 'leer') {
      return true;
    }
    return false;
  }

  hasHexNeighbours(hex: Hex, grid: Grid<Hex>): boolean {
    let title = this.hexagonTitles[hex.col][hex.row];

    // Directions als Nummern, Enum Konvertion bringt teils Fehler - lazy
    let directionsAsNumber = [0, 1, 2, 3, 4, 5, 6, 7];
    for (const direction of directionsAsNumber) {
      let nHex = grid.neighborOf([hex.col, hex.row], direction, {
        allowOutside: false,
      });
      if (nHex !== undefined) {
        // Achtung, doppelte Verneinung
        // isHexagonValidTarget gibt true zurück falls 'leer'
        let hasNoNeighbour = this.isHexagonValidTarget(
          this.hexagonTitles[nHex.col][nHex.row]
        );
        if (hasNoNeighbour === false) {
          return true;
        }
      }
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

    // let allConnected = false;
    // while (!allConnected) {
    //   allConnected = true;

    // }

    grid.forEach((hex: Hex) => {
      let title = this.hexagonTitles[hex.col][hex.row];
      if (this.hasHexNeighbours(hex, grid) === false && title !== 'leer') {
        // allConnected = false;
        this.moveHexagon(hex.col, hex.row, hex, grid);
      }
    });

    let counter = 0;
    grid.forEach((hex: Hex) => {
      const newText = this.renderHex(hex, graphics, counter);
      app.stage.addChild(newText);
      counter++;
    });
    console.log(counter);
  }

  renderHex(hex: any, graphics: PIXI.Graphics, counter: number): PIXI.Sprite {
    // Übergebene Titel des Hexagons
    let title = this.hexagonTitles[hex.col][hex.row];

    // Setze den Linienstyle der Hexagons
    this.setHexagonLineStyle(graphics, title);
    // graphics.lineStyle(1, '#ffffff', 0.5);

    // Ermittle den Textstyle, falls benötigt
    const textStyle = this.getHexagonText(title);

    graphics.drawShape(new PIXI.Polygon(hex.corners));

    // Einkommentieren und nutzen um die korrekten Koordinaten der Hexagons zu sehen (q|r)
    let coordinateText = hex.col.toString() + '/' + hex.row.toString();
    if (title === 'leer') {
      // coordinateText = '';
    }

    // Wechseln zwischen Bildern und Koordinaten Ansicht
    // let newSprite = this.createHexagonImage(title, hex);
    let newSprite = this.createHexagonText(
      hex,
      coordinateText,
      textStyle,
      counter
    );

    return newSprite;
  }

  createHexagonText(
    hex: Hex,
    title: string,
    textStyle: any,
    arrayIndex: number
  ) {
    const text = new PIXI.Text(title, textStyle);
    text.anchor.set(0.5);
    text.x = hex.x;
    text.y = hex.y;

    text.anchor.set(0.5);
    text.x = hex.x;
    text.y = hex.y;

    return text;
  }

  createHexagonImage(hexagonTitle: HexagonType, hex: Hex): PIXI.Sprite {
    if (hexagonTitle === 'leer') {
      return new PIXI.Sprite();
    }
    const texture = PIXI.Texture.from('assets/' + hexagonTitle + '.png');
    const sprite = new PIXI.Sprite(texture);

    // Zentrierung und Anpassung der Bilder / Winkel etc
    sprite.anchor.set(0.5);
    sprite.x = hex.x;
    sprite.y = hex.y;
    sprite.scale.set(0.12);
    sprite.rotation = 0.52;
    return sprite;
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
      case 'Schwemmland':
        textStyle.fill = '#776D5A';
        return textStyle;
      case 'Gebirge':
        textStyle.fill = '#655356';
        return textStyle;
      case 'Flussland':
        textStyle.fill = '#25CED1';
        return textStyle;
      case 'Instabil':
        textStyle.fill = '#E05263';
        return textStyle;
      case 'Radioaktiv':
        textStyle.fill = '#FAE500';
        return textStyle;
      case 'Tsukuyumi':
        textStyle.fill = '#7E52A0';
        return textStyle;
      case 'Toxisch':
        textStyle.fill = '#2B9720';
        return textStyle;

      default:
        return textStyle;
    }
  }

  setHexagonLineStyle(graphics: PIXI.Graphics, hexagonTitle: HexagonType) {
    switch (hexagonTitle) {
      case 'leer':
        graphics.lineStyle(1, '#ffffff', 0.5);
        break;
      case 'Meeresboden':
        graphics.lineStyle(1, '#2CA6A4');
        break;
      case 'Schwemmland':
        graphics.lineStyle(1, '#776D5A');
        break;
      case 'Gebirge':
        graphics.lineStyle(1, '#655356');
        break;
      case 'Flussland':
        graphics.lineStyle(1, '#25CED1');
        break;
      case 'Instabil':
        graphics.lineStyle(1, '#E05263');
        break;
      case 'Radioaktiv':
        graphics.lineStyle(1, '#FAE500');
        break;
      case 'Tsukuyumi':
        graphics.lineStyle(1, '#7E52A0');
        break;
      case 'Toxisch':
        graphics.lineStyle(1, '#2B9720');
        break;

      default:
        graphics.lineStyle(1, 0x999999);
    }
  }
}
