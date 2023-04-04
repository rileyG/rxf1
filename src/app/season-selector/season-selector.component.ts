import { Component, forwardRef } from '@angular/core';
import { NgFor } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

type SeasonSelectorOnChangeFn = (value: string) => void;

type SeasonSelectorOnTouchedFn = () => void;

/**
 * Form control component for selecting an F1 season.
 */
@Component({
  selector: 'app-season-selector',
  standalone: true,
  imports: [NgFor, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './season-selector.component.html',
  styles: [`
    label {
      display: block;
      font-weight: bold;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SeasonSelectorComponent),
      multi: true,
    }
  ]
})
export class SeasonSelectorComponent implements ControlValueAccessor {
  /**
   * Flag indicating if the control should be disabled.
   */
  protected disabled = false;

  /**
   * The internal value for the currently selected season.
   */
  protected selectedSeason!: string;

  /**
   * An array of all seasons that can be selected.
   */
  protected readonly selectableSeasons = [
    '2018',
    '2019',
    '2020',
    '2021',
    '2022'
  ];

  /**
   * A handler to be run when value changes occur.
   */
  protected onChange?: SeasonSelectorOnChangeFn;

  /**
   * A handler to be run when touched changes occur.
   */
  protected onTouched?: SeasonSelectorOnTouchedFn;

  /**
   * Tracking function for the NgFor loop creating the season options in the select input.
   */
  protected trackSeason(_index: number, season: string): string {
    return season;
  }

  /**
   * Update the control state with a value being pushed in from outside of the control.
   * 
   * @param obj A value being pushed to the control from a parent component
   */
  writeValue(obj: any): void {
    this.selectedSeason = obj;
  }

  /**
   * Sets the control's current on change handler.
   */
  registerOnChange(fn: SeasonSelectorOnChangeFn): void {
    this.onChange = fn;
  }

  /**
   * Sets the control's current on touched handler.
   */
  registerOnTouched(fn: SeasonSelectorOnTouchedFn): void {
    this.onTouched = fn;
  }

  /**
   * Update the control's current disabled state.
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Update the internal value for the selected season, then trigger change handling if a handler exists.
   */
  protected selectSeason(season: string): void {
    this.selectedSeason = season;
    this.onChange?.(season);
  }
}
