import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-show-map',
  templateUrl: './show-map.component.html',
  styleUrls: ['./show-map.component.css'],
})
export class ShowMapComponent {
  hexagonsData = [
    { text: 'Hexagon 1', color: '26413C' },
    { text: 'Hexagon 2', color: '1A1D1A' },
    // Weitere Hexagon-Daten hier...
  ];
}
