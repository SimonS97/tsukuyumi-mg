import { Injectable } from '@angular/core';
import { Maprules } from './maprules';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  rules: Maprules = {
    areaType: [],
    hasMoon: true,
    gridSizeByPlayerAmount: [],
    selectedPlayerAmount: 0,
  };
  gameToPlay = 'Tsukuyumi';

  constructor(private http: HttpClient) {}

  getConfig() {
    const ruleUrl = this.getGameRuleSetUrl(this.gameToPlay);
    return this.http.get<Maprules>(ruleUrl);
  }

  generateConfig() {
    return this.getConfig().subscribe({
      next: (data: Maprules) => {
        this.rules = {
          areaType: data.areaType,
          hasMoon: data.hasMoon,
          gridSizeByPlayerAmount: data.gridSizeByPlayerAmount,
          selectedPlayerAmount: data.selectedPlayerAmount,
        };
        console.log('Geladenes Regelwerk:');
        console.log(this.rules);
      },
    });
  }

  private getGameRuleSetUrl(gameToLoad: string): string {
    return `assets/rules/${gameToLoad.toLowerCase()}.json`;
  }
}
