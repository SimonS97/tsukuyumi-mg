import { TestBed, ComponentFixture } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ConfigService } from '../config.service';
import { HomeComponent } from './home.component';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let configService: ConfigService;
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Wir importieren HttpClientTestingModule, um HTTP-Anfragen zu überwachen.
      providers: [ConfigService],
    });

    configService = TestBed.inject(ConfigService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('sollte die Standardkonfiguration laden', () => {
    const mockData = {
      areaType: [
        { requiredAmount: 7, title: 'Mondfeld' },
        { requiredAmount: 5, title: 'Meeresboden' },
      ],
      hasMoon: false,
      gridSizeByPlayerAmount: [
        {
          amount: 4,
          expectedTileAmount: 36,
          gridSize: { width: 6, height: 6 },
        },
      ],
      selectedPlayerAmount: 4,
    };

    // Erstelle einen Spy auf `console.log`, um den Konsolenausdruck zu überwachen.
    const consoleLogSpy = spyOn(console, 'log');

    // Überwachung der HTTP-Anfrage
    const req = httpTestingController.expectOne((request) =>
      request.url.endsWith('tsukuyumi.json')
    );
    // Rückgabe der Mockdaten
    req.flush(mockData);

    // Überprüfen, ob die Daten korrekt geladen und gespeichert wurden.
    expect(configService.rules).toEqual(mockData);

    // Überprüfen, ob `console.log` mit den erwarteten Meldungen aufgerufen wurde.
    expect(consoleLogSpy).toHaveBeenCalledWith('Geladenes Regelwerk:');
    expect(consoleLogSpy).toHaveBeenCalledWith(mockData);
    expect(configService.rules.hasMoon).toBe(false);
    let element = configService.rules.gridSizeByPlayerAmount.find(
      (gridSize) => gridSize.amount === 4
    );
    expect(element?.expectedTileAmount).toEqual(36);

    // Überprüfen, ob es unmatched HTTP-Requests gibt.
    httpTestingController.verify();
  });

  it('sollte im Konstruktor den ConfigService und die generateConfig Methode ausführen', () => {
    // Hier prüfen wir, ob die generateConfig-Methode im ConfigService aufgerufen wird.
    const configService = TestBed.inject(ConfigService);
    const generateConfigSpy = spyOn(configService, 'generateConfig');
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    expect(generateConfigSpy).toHaveBeenCalled();
  });

  it('sollte die Anwendung mit den Default Werten generieren', () => {
    expect(component.title).toEqual('Tsukuyumi Map Generator');
    expect(component.defaultSettings).toEqual(true);
    expect(component.gameToPlay).toEqual('Tsukuyumi');
  });

  it('sollte ein Spiel auswählen und anschließend die Konfig anpassen', () => {
    const newGame = 'SiedlerVonCatan';
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    const selectChangeEvent: MatSelectChange = {
      source: {} as any,
      value: newGame,
    };

    const configService = TestBed.inject(ConfigService);
    const generateConfigSpy = spyOn(configService, 'generateConfig');

    component.selectGame(selectChangeEvent);

    // Überprüfen, ob selectGame die richtigen Aktionen ausführt
    expect(component.gameToPlay).toEqual(newGame);
    expect(configService.gameToPlay).toEqual(newGame);

    // Überprüfen, ob generateConfig im ConfigService aufgerufen wurde
    expect(generateConfigSpy).toHaveBeenCalled();
  });
});
