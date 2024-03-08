import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { DateFilterDto, DateFilterModes } from '../../models/shared/date-filter.dto';

interface ModeOption {
  value: DateFilterModes;
  icon: string;
  tooltip: string;
  selectionMode: 'range' | 'single';
}

@Component({
  selector: 'app-date-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CalendarModule, ButtonModule, TooltipModule],
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateFilterComponent), multi: true }]
})
export class DateFilterComponent implements ControlValueAccessor, AfterContentInit {

  @Input()
  label = 'Dátum szűrés';

  @Input()
  inputId = 'testInputId';

  ngModelChange!: (value: DateFilterDto | null) => void;

  form!: FormGroup;
  modeOptions!: ModeOption[];
  currentMode!: ModeOption;

  constructor(private fb: FormBuilder) {
    this.initForm();
    this.initModeOptions();
    this.initMode();
    
  }

  ngAfterContentInit(): void {
    this.emitOnFormChanges();
  }

  private initForm(): void {
    this.form = this.fb.group({
      dateValue: [null],
      mode: [null]
    });
  }

  private emitOnFormChanges(): void {
    this.form.valueChanges.subscribe(() => {
      const { dateValue, mode } = this.form.value;
      const hasValue = mode === DateFilterModes.RANGE
        ? dateValue !== null && dateValue !== undefined && dateValue.length > 0
        : dateValue !== null && dateValue !== undefined;
      if (!hasValue) {
        this.ngModelChange(null);
        return;
      }
      let valueToEmit: DateFilterDto = {};
      if (mode === DateFilterModes.RANGE) {
        valueToEmit.range = { from: dateValue[0], to: dateValue[1] };
      } else {
        valueToEmit[mode as keyof DateFilterDto] = dateValue;
      }
      this.ngModelChange(valueToEmit);
    });
  }

  private initModeOptions(): void {
    this.modeOptions = [
      { value: DateFilterModes.RANGE, icon: 'pi pi-arrow-right-arrow-left', tooltip: 'Intervallum', selectionMode: 'range' },
      { value: DateFilterModes.BEFORE, icon: 'pi pi-arrow-left', tooltip: 'Előtte', selectionMode: 'single' },
      { value: DateFilterModes.AFTER, icon: 'pi pi-arrow-right', tooltip: 'Utána', selectionMode: 'single' }
    ];
  }

  writeValue(newValue: DateFilterDto | null | undefined): void {
    if (!newValue) {
      this.form.patchValue({ dateValue: null });
      this.initMode();
      return;
    }

    if (newValue.range) {
      this.form.patchValue({ dateValue: newValue.range, mode: DateFilterModes.RANGE });
    } else if (newValue.before) {
      this.form.patchValue({ dateValue: newValue.range, mode: DateFilterModes.BEFORE });
    } else {
      this.form.patchValue({ dateValue: newValue.range, mode: DateFilterModes.AFTER });
    }
  }

  private initMode(): void {
    this.form.patchValue({ mode: this.modeOptions[0].value });
    this.currentMode = this.modeOptions[0];
  }

  rotateMode(): void {
    const currentModeIndex = this.modeOptions.findIndex(mode => mode.value === this.form.value.mode);
    const nextModeIndex = currentModeIndex + 1 < this.modeOptions.length ? currentModeIndex + 1 : 0;
    const nextModeOption = this.modeOptions[nextModeIndex];
    this.currentMode = nextModeOption;
    this.form.patchValue({ dateValue: null, mode: nextModeOption.value });
  }

  registerOnChange(fn: any): void {
    this.ngModelChange = fn;
  }

  registerOnTouched(fn: any): void {}


  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

}
