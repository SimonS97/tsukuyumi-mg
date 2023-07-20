import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-tsukuyumi-config-options',
  templateUrl: './tsukuyumi-config-options.component.html',
  styleUrls: ['./tsukuyumi-config-options.component.css'],
})
export class TsukuyumiConfigOptionsComponent {
  maxSliderValue = 7;

  constructor(private configService: ConfigService) {}

  mondfeldExists(event: MatCheckboxChange) {
    this.configService.rules.hasMoon = event.checked;
  }

  getMondfeldValue() {
    return this.configService.rules.hasMoon;
  }

  getAllAvailableAreas(): number {
    let amount = 0;
    this.configService.rules.areaType.forEach((area) => {
      amount += area.requiredAmount;
    });
    return amount;
  }

  getSchwemmlandValue(): number {
    const schwemmlandObj = this.configService.rules.areaType.find(
      (area) => area.title === 'Schwemmland'
    );
    return schwemmlandObj?.requiredAmount!;
  }

  getGebirgeValue(): number {
    const gebirgeObj = this.configService.rules.areaType.find(
      (area) => area.title === 'Gebirge'
    );
    return gebirgeObj?.requiredAmount!;
  }

  getMeeresbodenValue(): number {
    const meeresbodenObj = this.configService.rules.areaType.find(
      (area) => area.title === 'Meeresboden'
    );
    return meeresbodenObj?.requiredAmount!;
  }

  changeSchwemmlandValue(sliderValue: string) {
    const schwemmlandObj = this.configService.rules.areaType.find(
      (area) => area.title === 'Schwemmland'
    );

    if (schwemmlandObj) {
      const index = this.configService.rules.areaType.indexOf(schwemmlandObj);

      if (index !== -1) {
        this.configService.rules.areaType[index] = {
          ...schwemmlandObj,
          requiredAmount: parseInt(sliderValue, 10),
        };
      }
    }
  }

  changeGebirgeValue(sliderValue: string) {
    const gebirgeObj = this.configService.rules.areaType.find(
      (area) => area.title === 'Gebirge'
    );

    if (gebirgeObj) {
      const index = this.configService.rules.areaType.indexOf(gebirgeObj);

      if (index !== -1) {
        this.configService.rules.areaType[index] = {
          ...gebirgeObj,
          requiredAmount: parseInt(sliderValue, 10),
        };
      }
    }
  }

  changeMeeresbodenValue(sliderValue: string) {
    const gebirgeObj = this.configService.rules.areaType.find(
      (area) => area.title === 'Meeresboden'
    );

    if (gebirgeObj) {
      const index = this.configService.rules.areaType.indexOf(gebirgeObj);

      if (index !== -1) {
        this.configService.rules.areaType[index] = {
          ...gebirgeObj,
          requiredAmount: parseInt(sliderValue, 10),
        };
      }
    }
  }
}
