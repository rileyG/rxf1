import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MAT_PROGRESS_BAR_DEFAULT_OPTIONS } from '@angular/material/progress-bar';
import { canActivateRaceDetails } from './guards/race-guards';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'drivers' },
  { path: 'drivers', loadComponent: () => import('./driver-list/driver-list.component').then((m) => m.DriverListComponent) },
  { path: 'races', loadComponent: () => import('./race-list/race-list.component').then((m) => m.RaceListComponent) },
  { 
    path: 'race/:season/:round',
    loadComponent: () => import('./race-details/race-details.component').then((m) => m.RaceDetailsComponent),
    canActivate: [canActivateRaceDetails]
  },
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  providers: [
    { provide: MAT_PROGRESS_BAR_DEFAULT_OPTIONS, useValue: { mode: 'indeterminate' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
