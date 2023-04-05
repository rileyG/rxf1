import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceResultsComponent } from './race-results.component';

describe('RaceResultsComponent', () => {
  let component: RaceResultsComponent;
  let fixture: ComponentFixture<RaceResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RaceResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaceResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
