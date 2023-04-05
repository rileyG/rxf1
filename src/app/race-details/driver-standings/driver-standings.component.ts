import { Component, inject, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { DriverStandingsComponentStore } from './driver-standings.component.store';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { LetModule, PushModule } from '@ngrx/component';

@Component({
  selector: 'app-driver-standings',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, LetModule, PushModule, NgIf],
  templateUrl: './driver-standings.component.html',
  styleUrls: ['./driver-standings.component.scss'],
  providers: [DriverStandingsComponentStore]
})
export class DriverStandingsComponent {
  // region Dependency Injections

  private readonly driverStandingsComponentStore = inject(DriverStandingsComponentStore);

  // endregion Dependency Injections

  @Input() set round(value: string) {
    this.driverStandingsComponentStore.setRound(value);
  }

  @Input() set season(value: string) {
    this.driverStandingsComponentStore.setSeason(value);
  }

  protected readonly dataSource = this.driverStandingsComponentStore;

  protected readonly error$ = this.driverStandingsComponentStore.error$;

  protected readonly limit$ = this.driverStandingsComponentStore.limit$;

  protected readonly loading$ = this.driverStandingsComponentStore.loading$;

  protected readonly total$ = this.driverStandingsComponentStore.total$;

  protected readonly tableColumns = [
    'driver',
    'points',
    'position',
  ];

  protected updatePageInfo(event: PageEvent): void {
    this.driverStandingsComponentStore.setPageVariables(event);
  }
}
