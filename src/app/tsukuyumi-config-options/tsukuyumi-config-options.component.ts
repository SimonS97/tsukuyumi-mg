import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ConfigService } from '../config.service';
import { Areatype } from '../areatype';

@Component({
  selector: 'app-tsukuyumi-config-options',
  templateUrl: './tsukuyumi-config-options.component.html',
  styleUrls: ['./tsukuyumi-config-options.component.css'],
})
export class TsukuyumiConfigOptionsComponent {
  defaultMaxSliderValue = 8;
  defaultMinSliderValue = 0;

  constructor(private configService: ConfigService) {}

  setMondfeld(event: MatCheckboxChange) {
    this.configService.rules.hasMoon = event.checked;
  }

  getMondfeldValue() {
    return this.configService.rules.hasMoon;
  }

  getHexagonType(): Areatype[] {
    return this.configService.rules.areaType;
  }

  getAreaValue(areaValue: string): number {
    const foundArea = this.configService.rules.areaType.find(
      (area) => area.title === areaValue
    );
    return foundArea?.requiredAmount!;
  }

  changeAreaValue(sliderValue: string, areaTitle: string) {
    const areaObj = this.configService.rules.areaType.find(
      (area) => area.title === areaTitle
    );

    if (areaObj) {
      const index = this.configService.rules.areaType.indexOf(areaObj);

      this.configService.rules.areaType[index] = {
        ...areaObj,
        requiredAmount: parseInt(sliderValue, 10),
      };
    }

    this.validateSelection();
  }

  getAllAvailableAreas(): number {
    let amount = 0;
    this.configService.rules.areaType.forEach((area) => {
      amount += area.requiredAmount;
    });
    return amount;
  }

  validateSelection(): boolean {
    const selectedAreas = this.getAllAvailableAreas();

    const currentPlayerAmount = this.configService.rules.selectedPlayerAmount;
    const gridSizeConfig = this.configService.rules.gridSizeByPlayerAmount.find(
      (config) => config.amount === currentPlayerAmount
    );

    if (!gridSizeConfig) {
      return false;
    }

    const expectedTileAmount = gridSizeConfig.expectedTileAmount;
    return selectedAreas <= expectedTileAmount;
  }

  generateTooltip(): string {
    const currentPlayerAmount = this.configService.rules.selectedPlayerAmount;
    const gridSizeConfig = this.configService.rules.gridSizeByPlayerAmount.find(
      (config) => config.amount === currentPlayerAmount
    );
    let tooltip =
      'Bei ' +
      this.configService.rules.selectedPlayerAmount +
      " Spielern sind maximal '" +
      gridSizeConfig?.expectedTileAmount +
      "' Felder erlaubt";
    return tooltip;
  }
}
