import { Injectable } from '@angular/core';
import { Maprules } from './maprules';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  ruleUrl = 'assets/rules.json';
  rules: Maprules = {
    areaType: [],
    hasMoon: false,
    gridSizeByPlayerAmount: [],
    selectedPlayerAmount: 0,
  };
  gameToPlay = 'Tsukuyumi';

  constructor(private http: HttpClient) {}

  getConfig() {
    return this.http.get<Maprules>(this.ruleUrl);
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
}
