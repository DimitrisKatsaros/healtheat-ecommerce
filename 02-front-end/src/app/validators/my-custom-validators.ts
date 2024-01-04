import { FormControl, ValidationErrors } from "@angular/forms";

export class MyCustomValidators {

    // whitespace validator
    static notOnlyWhitespace(control: FormControl): ValidationErrors {

        // Check if string has only whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {
            // invalid return error
            return { 'notOnlyWhitespace': true };
        } else {
            // Not sure if this is correct
            return null as any;
        }
    }
}
