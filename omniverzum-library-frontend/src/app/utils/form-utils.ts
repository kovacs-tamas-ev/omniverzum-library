import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import { filter } from "rxjs";

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

export function connectControlsValidation(connectControlName: string, connectionType: 'EQUAL' | 'NOT_EQUAL', message: string): (control: AbstractControl) => ValidationErrors | null {
    let statusChangeSubscription: any = null;
    return (control: AbstractControl) => {
        const connectControl = control.parent?.get(connectControlName);
        if (connectControl === null || connectControl === undefined) {
            return null;
        }
        
        if (!statusChangeSubscription) {
            let oldStatus = null as string | null;
            statusChangeSubscription = connectControl.statusChanges.pipe(
                filter(newStatus => newStatus !== oldStatus),
            ).subscribe((newStatus) => {
                oldStatus = newStatus;
                return control.updateValueAndValidity();
            });
        }
        
        if (connectionType === 'EQUAL') {
            return control.value === connectControl.value ? null : { connectControls: message };    
        }
        return control.value !== connectControl.value ? null : { connectControls: message };
    };
}