import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsukuyumiConfigOptionsComponent } from './tsukuyumi-config-options.component';

describe('TsukuyumiConfigOptionsComponent', () => {
  let component: TsukuyumiConfigOptionsComponent;
  let fixture: ComponentFixture<TsukuyumiConfigOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TsukuyumiConfigOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TsukuyumiConfigOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
