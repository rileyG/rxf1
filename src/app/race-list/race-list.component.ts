import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import type { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RaceListComponentStore } from './race-list.component.store';
import { debounceTime } from 'rxjs';
import { RaceListApiService } from './race-list-api.service';
import { SeasonSelectorComponent } from '../season-selector/season-selector.component';
import { LetModule, PushModule } from '@ngrx/component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

/**
 * Component for displaying a table of races for a given season.
 */
@Component({
  selector: 'app-race-list',
  standalone: true,
  imports: [NgIf, MatTableModule, MatPaginatorModule, SeasonSelectorComponent, ReactiveFormsModule, PushModule, LetModule, MatProgressBarModule, RouterLink],
  templateUrl: './race-list.component.html',
  styleUrls: ['./race-list.component.scss'],
  providers: [RaceListComponentStore, RaceListApiService],
})
export class RaceListComponent {
  // region Dependency Injections

  private readonly raceListComponentStore = inject(RaceListComponentStore);

  private readonly router = inject(Router);

  // endregion Dependency Injections

  /**
   * The data source to connect to the table to provide results data.
   */
  protected readonly dataSource = this.raceListComponentStore;

  /**
   * The control for selecting the season to display races for.
   */
  protected readonly seasonControl = new FormControl('');

  /**
   * Any errors that occurred from an API query, or null if the last API call was successful.
   */
  protected readonly error$ = this.raceListComponentStore.error$;

  /**
   * Flag indicating if race data is being loaded.
   */
  protected readonly loading$ = this.raceListComponentStore.loading$;

  /**
   * The current number of results to show per page.
   */
  protected readonly pageSize$ = this.raceListComponentStore.limit$;

  /**
   * The total number of results that could be displayed.
   */
  protected readonly total$ = this.raceListComponentStore.total$;

  protected readonly tableColumns = [
    'round',
    'race',
    'circuit',
    'date',
  ]

  constructor() {
    this.raceListComponentStore.setSeason(this.seasonControl.valueChanges.pipe(debounceTime(250)));
  }

  /**
   * Call through to the component store to update the pagination variables.
   */
  protected updatePageInfo(event: PageEvent): void {
    this.raceListComponentStore.setPageVariables(event);
  }

  /**
   * Navigate to the race details page for the given round.
   */
  protected viewRaceResults(round: number): void {
    this.router.navigate([this.seasonControl.value, round]);
  }
}
