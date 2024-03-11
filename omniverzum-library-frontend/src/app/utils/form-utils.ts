import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";

export function markControlsAsTouchedAndDirty(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
        const currentControl = form.controls[key];
        if (currentControl instanceof FormGroup) {
            markControlsAsTouchedAndDirty(currentControl);
        }
        else {
            currentControl.markAsTouched();
            currentControl.markAsDirty();
        }
    })
}

export function connectControlsValidation(connectControlName: string): (control: AbstractControl) => ValidationErrors | null {
    let statusChangeSubscription: any = null;
    return (control: AbstractControl) => {
        const connectControl = control.parent?.get(connectControlName);
        if (connectControl === null || connectControl === undefined) {
            return null;
        }
        if (!statusChangeSubscription) {
            statusChangeSubscription = connectControl.statusChanges.subscribe(() => control.updateValueAndValidity({ emitEvent: false }));
        }
        
        return control.value === connectControl.value ? null : { connectControls: true };
    };
}