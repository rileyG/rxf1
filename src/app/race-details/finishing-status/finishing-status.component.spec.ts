import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishingStatusComponent } from './finishing-status.component';

describe('FinishingStatusComponent', () => {
  let component: FinishingStatusComponent;
  let fixture: ComponentFixture<FinishingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FinishingStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
