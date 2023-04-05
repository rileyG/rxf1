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

/**
 * Component for displaying all the different race details.
 */
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

  /**
   * Any API errors that occurred while loading the basic details, or null if the last API call was successful.
   */
  protected readonly error$ = this.raceDetailsComponentStore.error$;

  /**
   * Flag indicating if the race details are being loaded.
   */
  protected readonly loading$ = this.raceDetailsComponentStore.loading$;

  /**
   * The basic race details to display.
   */
  protected readonly raceDetails$ = this.raceDetailsComponentStore.details$;

  /**
   * The round number for the race.
   */
  protected readonly round$ = this.raceDetailsComponentStore.round$;

  /**
   * The season the race belongs to.
   */
  protected readonly season$ = this.raceDetailsComponentStore.season$;
}
