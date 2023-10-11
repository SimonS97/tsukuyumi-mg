import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ConfigService } from '../config.service';

describe('ConfigService', () => {
  let configService: ConfigService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Wir importieren HttpClientTestingModule, um HTTP-Anfragen zu überwachen.
      providers: [ConfigService],
    });

    configService = TestBed.inject(ConfigService);
    httpTestingController = TestBed.inject(HttpTestingController);
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

    configService.generateConfig();

    // Hier überwachen wir die HTTP-Anfrage und geben die mockData zurück.
    const req = httpTestingController.expectOne((request) =>
      request.url.endsWith('tsukuyumi.json')
    );
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

    // Überprüfen, ob keine weiteren HTTP-Anfragen ausstehen.
    httpTestingController.verify();
  });
});
