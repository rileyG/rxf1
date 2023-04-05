import { Component, inject, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { FinishingStatusComponentStore } from './finishing-status.component.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PushModule } from '@ngrx/component';

/**
 * Component for displaying the different finishing statuses for a given round.
 */
@Component({
  selector: 'app-finishing-status',
  standalone: true,
  imports: [NgIf, MatProgressSpinnerModule, PushModule],
  templateUrl: './finishing-status.component.html',
  styleUrls: ['./finishing-status.component.scss'],
  providers: [provideComponentStore(FinishingStatusComponentStore)]
})
export class FinishingStatusComponent {
  // region Dependency Injections

  private readonly finishingStatusComponentStore = inject(FinishingStatusComponentStore);

  // endregion Dependency Injections

  /**
   * The round that finshing data should be displayed for.
   */
  @Input() set round(value: string) {
    this.finishingStatusComponentStore.setRound(value)
  }

  /**
   * The season the round belongs to.
   */
  @Input() set season(value: string) {
    this.finishingStatusComponentStore.setSeason(value);
  }

  /**
   * The number of accidents that occurred in the round.
   */
  protected readonly accident$ = this.finishingStatusComponentStore.accident$;

  /**
   * Any API errors that occurred, or null if the last API call was successful.
   */
  protected readonly error$ = this.finishingStatusComponentStore.error$;

  /**
   * THe number of finishing cars for the round.
   */
  protected readonly finished$ = this.finishingStatusComponentStore.finished$;

  /**
   * Flag indicating if data is being loaded.
   */
  protected readonly loading$ = this.finishingStatusComponentStore.loading$;

  /**
   * The number of cars that finished +1 lap.
   */
  protected readonly plusOneLap$ = this.finishingStatusComponentStore.plusOneLap$;
}
