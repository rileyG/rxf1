import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { LetModule, PushModule } from '@ngrx/component';
import { provideComponentStore } from '@ngrx/component-store';
import { RaceDetailsApiService } from './race-details-api.service';
import { RaceDetailsComponentStore } from './race-details.component.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RaceResultsComponent } from './race-results/race-results.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { QualifyingResultsComponent } from './qualifying-results/qualifying-results.component';
import { DriverStandingsComponent } from './driver-standings/driver-standings.component';
import { FinishingStatusComponent } from './finishing-status/finishing-status.component';

@Component({
  selector: 'app-race-details',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    PushModule,
    NgIf,
    MatProgressSpinnerModule,
    RaceResultsComponent,
    MatExpansionModule,
    QualifyingResultsComponent,
    LetModule,
    DriverStandingsComponent,
    FinishingStatusComponent
  ],
  templateUrl: './race-details.component.html',
  styleUrls: ['./race-details.component.scss'],
  providers: [provideComponentStore(RaceDetailsComponentStore), RaceDetailsApiService]
})
export class RaceDetailsComponent {
  // region Dependency Injections

  private readonly raceDetailsComponentStore = inject(RaceDetailsComponentStore);

  // endregion Dependency Injections

  protected readonly error$ = this.raceDetailsComponentStore.error$;

  protected readonly loading$ = this.raceDetailsComponentStore.loading$;

  protected readonly raceDetails$ = this.raceDetailsComponentStore.details$;

  protected readonly round$ = this.raceDetailsComponentStore.round$;

  protected readonly season$ = this.raceDetailsComponentStore.season$;
}
