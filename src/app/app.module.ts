import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShowMapComponent } from './show-map/show-map.component';
import { TsukuyumiConfigOptionsComponent } from './tsukuyumi-config-options/tsukuyumi-config-options.component';

@NgModule({
  declarations: [
    AppComponent,
    ShowMapComponent,
    HomeComponent,
    TsukuyumiConfigOptionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatCheckboxModule,
    HttpClientModule,
    FormsModule,
    MatSelectModule,
    MatSliderModule,
  ],
  exports: [MatFormFieldModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
