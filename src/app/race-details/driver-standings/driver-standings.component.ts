import { Component, inject, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { DriverStandingsComponentStore } from './driver-standings.component.store';
import type { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { LetModule, PushModule } from '@ngrx/component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/**
 * Component for displaying the drivers standings after a race in a material table.
 */
@Component({
  selector: 'app-driver-standings',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, LetModule, PushModule, NgIf, MatProgressBarModule],
  templateUrl: './driver-standings.component.html',
  styleUrls: ['./driver-standings.component.scss'],
  providers: [DriverStandingsComponentStore]
})
export class DriverStandingsComponent {
  // region Dependency Injections

  private readonly driverStandingsComponentStore = inject(DriverStandingsComponentStore);

  // endregion Dependency Injections

  /**
   * The round to display drivers standings for.
   */
  @Input() set round(value: string) {
    this.driverStandingsComponentStore.setRound(value);
  }

  /**
   * The season that the round belongs to.
   */
  @Input() set season(value: string) {
    this.driverStandingsComponentStore.setSeason(value);
  }

  /**
   * The data source for the material table.
   */
  protected readonly dataSource = this.driverStandingsComponentStore;

  /**
   * Any API errors that occurred, or null if the last call was successful.
   */
  protected readonly error$ = this.driverStandingsComponentStore.error$;

  /**
   * The number of rows to show per page.
   */
  protected readonly limit$ = this.driverStandingsComponentStore.limit$;

  /**
   * Flag indicating if data is being loaded.
   */
  protected readonly loading$ = this.driverStandingsComponentStore.loading$;

  /**
   * The total number of rows that could be displayed.
   */
  protected readonly total$ = this.driverStandingsComponentStore.total$;

  protected readonly tableColumns = [
    'driver',
    'points',
    'position',
  ];

  /**
   * Call through to the component store to update pagination variables.
   */
  protected updatePageInfo(event: PageEvent): void {
    this.driverStandingsComponentStore.setPageVariables(event);
  }
}
