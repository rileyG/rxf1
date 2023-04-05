import { Component, inject, Input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { QualifyingResultsComponentStore } from './qualifying-results.component.store';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableModule } from '@angular/material/table';
import { LetModule, PushModule } from '@ngrx/component';

@Component({
  selector: 'app-qualifying-results',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, NgIf, LetModule, PushModule],
  templateUrl: './qualifying-results.component.html',
  styleUrls: ['./qualifying-results.component.scss'],
  providers: [QualifyingResultsComponentStore]
})
export class QualifyingResultsComponent {
  // region Dependency Injections

  private readonly qualifyingResultsComponentStore = inject(QualifyingResultsComponentStore);

  // endregion Dependency Injections

  @Input() set round(value: string) {
    this.qualifyingResultsComponentStore.setRound(value);
  }

  @Input() set season(value: string) {
    this.qualifyingResultsComponentStore.setSeason(value);
  }

  protected readonly dataSource = this.qualifyingResultsComponentStore;

  protected readonly error$ = this.qualifyingResultsComponentStore.error$;

  protected readonly limit$ = this.qualifyingResultsComponentStore.limit$;

  protected readonly loading$ = this.qualifyingResultsComponentStore.loading$;

  protected readonly total$ = this.qualifyingResultsComponentStore.total$;

  protected readonly tableColumns = [
    'driver',
    'Q1',
    'Q2',
    'Q3'
  ];

  protected updatePageInfo(event: PageEvent): void {
    this.qualifyingResultsComponentStore.setPageVariables(event);
  }
}
