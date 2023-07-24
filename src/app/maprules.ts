import { Areatype } from './areatype';

export interface Maprules {
  areaType: Areatype[];
  hasMoon: boolean;
  gridSizeByPlayerAmount: {
    amount: number;
    expectedTileAmount: number,
    gridSize: {
      width: number;
      height: number;
    };
  }[];
  selectedPlayerAmount: number;
}
