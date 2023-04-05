import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualifyingResultsComponent } from './qualifying-results.component';

describe('QualifyingResultsComponent', () => {
  let component: QualifyingResultsComponent;
  let fixture: ComponentFixture<QualifyingResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ QualifyingResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualifyingResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
