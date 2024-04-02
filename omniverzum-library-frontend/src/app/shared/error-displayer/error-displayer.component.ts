import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-error-displayer',
  standalone: true,
  imports: [],
  templateUrl: './error-displayer.component.html',
  styleUrl: './error-displayer.component.scss'
})
export class ErrorDisplayerComponent implements OnInit {

  @Input()
  control?: AbstractControl | null;

  message = '';

  constructor() {
  }

  ngOnInit(): void {
    if (!this.control) {
      throw new Error('A form control is required to use the error displayer');
    }

    this.control.statusChanges.subscribe({
      next: () => this.handleStatusChange(this.control!.valid)
    });

    const originalMarkAsDirty = this.control.markAsDirty;
    this.control.markAsDirty = () => {
      originalMarkAsDirty.call(this.control);
      this.handleStatusChange(this.control!.valid);
    };
  }

  private handleStatusChange(isValid: boolean): void {
    if (isValid || this.control!.pristine) {
      this.message = '';
      return;
    }

    const error = Object.keys(this.control!.errors!)[0];
    this.message = this.getErrorMessageFor(error);
  }

  private getErrorMessageFor(errorType: string): string {
    switch (errorType) {
      case 'required':
        return 'A mező kitöltése kötelező';
      case 'connectControls':
        const errorMessage = this.control?.errors!['connectControls'];
        if (!errorMessage) {
          return 'A két mező értéke meg kell hogy egyezzen';
        }
        
        return errorMessage;

    }

    return 'A mező értéke hibás';
  }

}
