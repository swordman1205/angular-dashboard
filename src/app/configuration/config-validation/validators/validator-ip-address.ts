import { Directive } from '@angular/core';
import { NG_VALIDATORS, FormControl, Validator, ValidationErrors } from '@angular/forms';


@Directive({
    selector: '[birthYear]',
    providers: [{ provide: NG_VALIDATORS, useExisting: IpAddressValidator, multi: true }]
})
export class IpAddressValidator implements Validator {

    validate(ctrl: FormControl): ValidationErrors {
        const numValue = Number(ctrl.value);
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 85;
        const maxYear = currentYear - 18;
        const isValid = !isNaN(numValue) && numValue >= minYear && numValue <= maxYear;
        const message = {
            'years': {
                'message': 'The year must be a valid number between ' + minYear + ' and ' + maxYear
            }
        };
        return null; // isValid ? null : message;
    }
}
