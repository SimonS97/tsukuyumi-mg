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

  changeAreaValue(areaTitle: string, sliderValue: string) {
    const areaObj = this.configService.rules.areaType.find(
      (area) => area.title === areaTitle
    );

    if (areaObj) {
      const index = this.configService.rules.areaType.indexOf(areaObj);

      if (index !== -1) {
        this.configService.rules.areaType[index] = {
          ...areaObj,
          requiredAmount: parseInt(sliderValue, 10),
        };
      }
    }
  }

  getAllAvailableAreas(): number {
    let amount = 0;
    this.configService.rules.areaType.forEach((area) => {
      amount += area.requiredAmount;
    });
    return amount;
  }
}
