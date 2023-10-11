import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as PIXI from 'pixi.js';
import {
  defineHex,
  Grid,
  rectangle,
  Direction,
  Hex,
  offsetToCubePointy,
  spiral,
} from 'honeycomb-grid';
import { HexagonType } from '../hexagon-type';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-show-map',
  templateUrl: './show-map.component.html',
  styleUrls: ['./show-map.component.css'],
})
export class ShowMapComponent implements AfterViewInit {
  @ViewChild('pixiCanvas', { static: true })
  pixiCanvas!: ElementRef<HTMLCanvasElement>;
  gridWidth = NaN;
  gridHeight = NaN;
  hexagonTitles: HexagonType[][];

  constructor(private configService: ConfigService) {
    this.finishConfiguration();
    this.hexagonTitles = [];
    this.resetTitlesToDefault();
  }

  ngAfterViewInit(): void {
    this.createHexagonDrawing();
  }

  refreshGrid() {
    this.resetTitlesToDefault();
    this.createHexagonDrawing();
  }

  /*
    Konfigurationsabschnitt
  */

  finishConfiguration() {
    // Suche die richtige Grid-Größe für die ausgewählte Spieleranzahl
    const playerAmount = this.configService.rules.selectedPlayerAmount;
    const rule = this.configService.rules.gridSizeByPlayerAmount.find(
      (gridSizeByPlayerAmount) => gridSizeByPlayerAmount.amount === playerAmount
    );

    if (rule) {
      this.gridWidth = rule.gridSize.width;
      this.gridHeight = rule.gridSize.height;
    } else {
      // Standardwerte, falls keine Übereinstimmung gefunden wurde
      this.gridWidth = 8;
      this.gridHeight = 8;
    }
  }

  /*
    Abschnitt zur Auswertung des Regelwerks und der Anlage der Textfelder
  */

  createMondfeld(title: HexagonType, grid: Grid<Hex>) {
    let randomCol = Math.floor(Math.random() * (this.gridWidth - 2)) + 1;
    let randomRow = Math.floor(Math.random() * (this.gridHeight - 2)) + 1;

    console.log('Mondfeld Korrdinaten:' + randomCol + '|' + randomRow);

    const spiralTraverser = spiral({
      start: [randomCol, randomRow],
      radius: 1,
    });

    let enoughIterations = 0;
    grid.traverse(spiralTraverser).forEach((hex) => {
      this.hexagonTitles[hex.col][hex.row] = HexagonType.Mondfeld;
      enoughIterations++;
    });

    // Das Mondfeld muss immer aus 7 Feldern bestehen
    if (enoughIterations < 7) {
      this.resetTitlesToDefault();
      this.createMondfeld(title, grid);
    }
  }

  createHexagonsByAreaType(title: HexagonType) {
    if (title === 'Mondfeld' || title === 'leer') {
      return;
    }
    let count = 0;
    let numberOfIterations = this.findAreaAmount(title);

    while (count < numberOfIterations) {
      let randomCol = Math.floor(Math.random() * this.gridHeight);
      let randomRow = Math.floor(Math.random() * this.gridWidth);

      while (
        !this.hexAtCoordIsEmpty(this.hexagonTitles[randomCol][randomRow])
      ) {
        randomCol = Math.floor(Math.random() * this.gridHeight);
        randomRow = Math.floor(Math.random() * this.gridWidth);
      }

      this.hexagonTitles[randomCol][randomRow] = title;
      count++;
    }
    console.log('HexagonFelder erstellt für: ' + title);
  }

  /*
    Hilfsfunktionen für Validierungen und Prüfungen
  */

  resetTitlesToDefault() {
    this.hexagonTitles = this.hexagonTitles = new Array(this.gridWidth)
      .fill([])
      .map(() => Array(this.gridHeight).fill('leer'));
  }

  hexAtCoordIsEmpty(hexagon: string): boolean {
    if (hexagon === 'leer') {
      return true;
    }
    return false;
  }

  hasHexNeighbours(hex: Hex, grid: Grid<Hex>): boolean {
    for (let direction in Direction) {
      let foundHex = grid.neighborOf(hex, Number(direction), {
        allowOutside: false,
      });
      if (
        foundHex !== undefined &&
        this.hexAtCoordIsEmpty(
          this.hexagonTitles[foundHex.col][foundHex.row]
        ) === false
      ) {
        return true;
      }
    }

    return false;
  }

  findAreaAmount(hexagonTitle: HexagonType): number {
    return this.configService.rules.areaType.find(
      (area) => area.title === hexagonTitle
    )?.requiredAmount!;
  }

  moveHexagon(col: number, row: number) {
    console.log('Versuche Hex zu bewegen...');
    let tempTitle = this.hexagonTitles[col][row];
    let customOffset = 'NaN';

    if (row < 7) {
      this.hexagonTitles[col][row] = HexagonType.Leer;
      this.hexagonTitles[col][row + 1] = tempTitle;
      customOffset = col + '/' + (row + 1);
    } else if (col < 7) {
      this.hexagonTitles[col][row] = HexagonType.Leer;
      this.hexagonTitles[col + 1][row] = tempTitle;
      customOffset = col + 1 + '/' + row;
    } else {
      this.hexagonTitles[col][row] = HexagonType.Leer;
      this.hexagonTitles[col - 1][row - 1] = tempTitle;
      customOffset = col - 1 + '/' + (row - 1);
    }

    console.log(
      tempTitle + ' verschoben: ' + col + '/' + row + ' --> ' + customOffset
    );
  }

  /*
    Hier wird das rendern und zeichnen der Hexagons durchgeführt
    Styling + Bild Generierung
  */

  createHexagonDrawing() {
    const Hex = defineHex({
      dimensions: 45,
      origin: 'topLeft',
    });
    const grid = new Grid(
      Hex,
      rectangle({ width: this.gridWidth, height: this.gridHeight })
    );

    grid.forEach((hex) => {
      offsetToCubePointy(hex.q, hex.r, hex.offset);
    });

    const areaTypes = Object.values(HexagonType);
    for (const areaType of areaTypes) {
      if (
        areaType === 'Mondfeld' &&
        this.configService.rules.hasMoon === true
      ) {
        this.createMondfeld(HexagonType.Mondfeld, grid);
      } else {
        this.createHexagonsByAreaType(areaType);
      }
    }

    const app = new PIXI.Application({
      resolution: window.devicePixelRatio,
      antialias: true,
      backgroundAlpha: 0,
      view: this.pixiCanvas.nativeElement,
    });
    const graphics = new PIXI.Graphics();

    app.stage.addChild(graphics);

    // Prüfung ob alle Hexagons einen direkten Nachbarn besitzen
    grid.forEach((hex: Hex) => {
      let title = this.hexagonTitles[hex.col][hex.row];
      if (title !== 'leer' && this.hasHexNeighbours(hex, grid) === false) {
        this.moveHexagon(hex.col, hex.row);
      }
    });

    grid.forEach((hex: Hex) => {
      const newX = 120;
      const newY = 50;

      const newText = this.renderHex(hex, graphics);

      newText.x = newText.x + newX;
      newText.y = newText.y + newY;
      app.stage.addChild(newText);
    });
  }

  renderHex(hex: any, graphics: PIXI.Graphics): PIXI.Sprite {
    let title = this.hexagonTitles[hex.col][hex.row];

    graphics.drawShape(new PIXI.Polygon(hex.corners));

    let newSprite = this.createHexagonImage(title, hex);

    return newSprite;
  }

  createHexagonImage(hexagonTitle: HexagonType, hex: Hex): PIXI.Sprite {
    // Leere Hexagons werden visuell nicht repräsentiert
    if (hexagonTitle === 'leer') {
      return new PIXI.Sprite();
    }
    const texture = PIXI.Texture.from('assets/' + hexagonTitle + '.png');
    const sprite = new PIXI.Sprite(texture);

    // Zentrierung und Anpassung der Bilder, Winkel und Rotation
    sprite.anchor.set(0.5);
    sprite.x = hex.x;
    sprite.y = hex.y;
    sprite.scale.set(0.12);
    sprite.rotation = 0.52;
    return sprite;
  }
}
