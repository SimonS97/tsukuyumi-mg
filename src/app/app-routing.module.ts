import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowMapComponent } from './show-map/show-map.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'show-map', component: ShowMapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
