import { Component } from '@angular/core';
import { ConfigService } from '../config.service';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  title = 'Tsukuyumi Map Generator';
  defaultSettings: boolean = true;
  gameToPlay = '';
  constructor(private configService: ConfigService) {
    console.log('Konfiguration in Home geladen!');
    configService.generateConfig();
    this.gameToPlay = configService.gameToPlay;
  }

  selectGame(event: MatSelectChange) {
    const newGame: string = event.value.toString();
    this.gameToPlay = newGame;
    this.configService.gameToPlay = newGame;
  }

  selectPlayer(event: MatSelectChange) {
    const selectedPlayerCount: number = parseInt(event.value, 10);
    this.configService.rules.selectedPlayerAmount = selectedPlayerCount;
  }

  isDefaultSetting(event: MatCheckboxChange) {
    this.defaultSettings = event.checked;
    console.log(
      'Default Settings sind nun: ' + this.defaultSettings.toString()
    );
  }
}
