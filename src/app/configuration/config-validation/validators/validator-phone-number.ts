import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl, ValidationErrors } from '@angular/forms';


@Directive({
    selector: '[telephoneNumber]',
    providers: [{ provide: NG_VALIDATORS, useExisting: PhoneNumberFormatValidator, multi: true }]
})
export class PhoneNumberFormatValidator implements Validator {

    validate(ctrl: FormControl): ValidationErrors {
        const isValidPhoneNumber = /^\d{3,3}-\d{3,3}-\d{3,3}$/.test(ctrl.value);
        const message = {
            'telephoneNumber': {
                'message': 'The phone number must be valid (XXX-XXX-XXX, where X is a digit)'
            }
        };
        return isValidPhoneNumber ? null : message;
    }
}
