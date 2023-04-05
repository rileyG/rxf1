import { Component, inject, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RaceResultsComponentStore } from './race-results.component.store';
import type { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LetModule, PushModule } from '@ngrx/component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/**
 * Component for displaying a table of overall race results.
 */
@Component({
  selector: 'app-race-results',
  standalone: true,
  imports: [MatTableModule, NgIf, MatPaginatorModule, LetModule, PushModule, MatProgressBarModule],
  templateUrl: './race-results.component.html',
  styleUrls: ['./race-results.component.scss'],
  providers: [RaceResultsComponentStore]
})
export class RaceResultsComponent {
  // region Dependency Injections

  private readonly raceResultsComponentStore = inject(RaceResultsComponentStore);

  // endregion Dependency Injections

  /**
   * The round that results should be shown for.
   */
  @Input() set round(value: string) {
    this.raceResultsComponentStore.setRound(value);
  }

  /**
   * The season that the round belongs to.
   */
  @Input() set season(value: string) {
    this.raceResultsComponentStore.setSeason(value);
  }

  /**
   * The data source for the material table.
   */
  protected readonly dataSource = this.raceResultsComponentStore;
  
  /**
   * Any API errors that occurred, or null if the last API call was successful.
   */
  protected readonly error$ = this.raceResultsComponentStore.error$;

  /**
   * The number of rows to show per page.
   */
  protected readonly limit$ = this.raceResultsComponentStore.limit$;

  /**
   * Flag indicating if results data is being loaded.
   */
  protected readonly loading$ = this.raceResultsComponentStore.loading$;

  /**
   * The total number of results that could be displayed.
   */
  protected readonly total$ = this.raceResultsComponentStore.total$;

  protected readonly tableColumns = [
    'position',
    'number',
    'driver'
  ];

  /**
   * Call through to the component store to update the pagination variables.
   */
  protected updatePageInfo(event: PageEvent): void {
    this.raceResultsComponentStore.setPageVariables(event);
  }
}
