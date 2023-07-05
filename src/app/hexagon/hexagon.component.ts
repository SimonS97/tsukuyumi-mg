import {
  Component,
  ElementRef,
  AfterViewInit,
  Input,
  ViewChild,
} from '@angular/core';
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
  @Input() hexagonText = '';
  @Input() hexagonColor!: string;

  ngAfterViewInit(): void {
    this.app = new PIXI.Application({
      view: this.pixiCanvas.nativeElement,
      width: 100,
      height: 100,
      backgroundColor: '#ffff',
    });

    const hexagon = new PIXI.Graphics();
    hexagon.beginFill(parseInt(this.hexagonColor, 16)); // Convert hex color to number
    hexagon.lineStyle(4, 0x1a1d1a, 1);

    // Calculate the points of the hexagon
    const points = [
      0,
      -this.hexagonSize,
      this.hexagonWidth / 2,
      -this.hexagonSize / 2,
      this.hexagonWidth / 2,
      this.hexagonSize / 2,
      0,
      this.hexagonSize,
      -this.hexagonWidth / 2,
      this.hexagonSize / 2,
      -this.hexagonWidth / 2,
      -this.hexagonSize / 2,
    ];

    hexagon.drawPolygon(points);
    hexagon.endFill();
    hexagon.x = this.app.screen.width / 2;
    hexagon.y = this.app.screen.height / 2;

    const style = new PIXI.TextStyle({
      fill: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: this.hexagonWidth - 20,
      align: 'center',
    });

    const text = new PIXI.Text(this.hexagonText, style);
    text.anchor.set(0.5);
    text.x = this.app.screen.width / 2;
    text.y = this.app.screen.height / 2;

    this.app.stage.addChild(hexagon, text);
  }
}
