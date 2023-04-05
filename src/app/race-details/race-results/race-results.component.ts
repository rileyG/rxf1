import { Component, inject, Input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RaceResultsComponentStore } from './race-results.component.store';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LetModule, PushModule } from '@ngrx/component';

@Component({
  selector: 'app-race-results',
  standalone: true,
  imports: [MatTableModule, NgIf, MatPaginatorModule, LetModule, PushModule],
  templateUrl: './race-results.component.html',
  styleUrls: ['./race-results.component.scss'],
  providers: [RaceResultsComponentStore]
})
export class RaceResultsComponent {
  // region Dependency Injections

  private readonly raceResultsComponentStore = inject(RaceResultsComponentStore);

  // endregion Dependency Injections

  @Input() set round(value: string) {
    this.raceResultsComponentStore.setRound(value);
  }

  @Input() set season(value: string) {
    this.raceResultsComponentStore.setSeason(value);
  }

  protected readonly dataSource = this.raceResultsComponentStore;
  
  protected readonly error$ = this.raceResultsComponentStore.error$;

  protected readonly limit$ = this.raceResultsComponentStore.limit$;

  protected readonly loading$ = this.raceResultsComponentStore.loading$;

  protected readonly total$ = this.raceResultsComponentStore.total$;

  protected readonly tableColumns = [
    'position',
    'number',
    'driver'
  ];

  protected updatePageInfo(event: PageEvent): void {
    this.raceResultsComponentStore.setPageVariables(event);
  }
}
