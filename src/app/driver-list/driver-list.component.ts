import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SeasonSelectorComponent } from '../season-selector/season-selector.component';
import { DriverListComponentStore } from './driver-list.component.store';
import { debounceTime } from 'rxjs';
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { DriverListApiService } from './driver-list-api.service';
import { LetModule, PushModule } from '@ngrx/component';
import { MatProgressBarModule } from "@angular/material/progress-bar";

/**
 * Component for loading and displaying a list of F1 drivers per season.
 */
@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [
    LetModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTableModule,
    NgIf,
    PushModule,
    ReactiveFormsModule,
    SeasonSelectorComponent,
  ],
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss'],
  providers: [DriverListComponentStore, DriverListApiService]
})
export class DriverListComponent {
  // region Dependency Injections

  private readonly driverListComponentStore = inject(DriverListComponentStore);

  // endregion Dependency Injections

  protected readonly seasonControl = new FormControl('');

  /**
   * The data source controlling the driver data displayed in the table.
   */
  protected readonly dataSource = this.driverListComponentStore;

  /**
   * Any errors that occurred while querying the API, or null if the last query was successful.
   */
  protected readonly error$ = this.driverListComponentStore.error$;

  /**
   * Flag indicating if driver data is being loaded.
   */
  protected readonly loading$ = this.driverListComponentStore.loading$;

  /**
   * The current amount of drivers shown per page in the table.
   */
  protected readonly pageSize$ = this.driverListComponentStore.limit$;

  /**
   * The total number of possible drivers that could be loaded and displayed.
   */
  protected readonly total$ = this.driverListComponentStore.total$;

  protected readonly tableColumns = [
    'permanentNumber',
    'name',
    'dateOfBirth',
    'nationality',
  ];

  constructor() {
    this.driverListComponentStore.setSeason(this.seasonControl.valueChanges.pipe(debounceTime(250)));
  }

  /**
   * Call through to the component store to update the pagination variables.
   */
  protected updatePageInfo(event: PageEvent): void {
    this.driverListComponentStore.setPageVariables(event);
  }
}
