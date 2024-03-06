import { FormGroup } from "@angular/forms";

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