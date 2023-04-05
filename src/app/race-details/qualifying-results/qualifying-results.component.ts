import { Component, inject, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { QualifyingResultsComponentStore } from './qualifying-results.component.store';
import type { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { LetModule, PushModule } from '@ngrx/component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/**
 * Component for displaying a table of qualifying results for a given race.
 */
@Component({
  selector: 'app-qualifying-results',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, NgIf, LetModule, PushModule, MatProgressBarModule],
  templateUrl: './qualifying-results.component.html',
  styleUrls: ['./qualifying-results.component.scss'],
  providers: [QualifyingResultsComponentStore]
})
export class QualifyingResultsComponent {
  // region Dependency Injections

  private readonly qualifyingResultsComponentStore = inject(QualifyingResultsComponentStore);

  // endregion Dependency Injections

  /**
   * The round that qualifying data should be displayed for.
   */
  @Input() set round(value: string) {
    this.qualifyingResultsComponentStore.setRound(value);
  }

  /**
   * The season the round belongs to.
   */
  @Input() set season(value: string) {
    this.qualifyingResultsComponentStore.setSeason(value);
  }

  /**
   * The data source for the table.
   */
  protected readonly dataSource = this.qualifyingResultsComponentStore;

  /**
   * Any API errors that occurred, or null if the last API call was successful.
   */
  protected readonly error$ = this.qualifyingResultsComponentStore.error$;

  /**
   * The number of rows to show per page.
   */
  protected readonly limit$ = this.qualifyingResultsComponentStore.limit$;

  /**
   * Flag indicating if qualifying results data is being loaded.
   */
  protected readonly loading$ = this.qualifyingResultsComponentStore.loading$;

  /**
   * The total number of qualifying results that could be displayed.
   */
  protected readonly total$ = this.qualifyingResultsComponentStore.total$;

  protected readonly tableColumns = [
    'driver',
    'Q1',
    'Q2',
    'Q3'
  ];

  /**
   * Call through to the component store to update the current pagination values.
   */
  protected updatePageInfo(event: PageEvent): void {
    this.qualifyingResultsComponentStore.setPageVariables(event);
  }
}
