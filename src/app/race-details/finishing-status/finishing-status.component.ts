import { Component, inject, Input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { FinishingStatusComponentStore } from './finishing-status.component.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PushModule } from '@ngrx/component';

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

  @Input() set round(value: string) {
    this.finishingStatusComponentStore.setRound(value)
  }

  @Input() set season(value: string) {
    this.finishingStatusComponentStore.setSeason(value);
  }

  protected readonly accident$ = this.finishingStatusComponentStore.accident$;

  protected readonly error$ = this.finishingStatusComponentStore.error$;

  protected readonly finished$ = this.finishingStatusComponentStore.finished$;

  protected readonly loading$ = this.finishingStatusComponentStore.loading$;

  protected readonly plusOneLap$ = this.finishingStatusComponentStore.plusOneLap$;
}
