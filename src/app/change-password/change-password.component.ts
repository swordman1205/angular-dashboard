import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../shared/services/data.service';
import { AuthService } from '../shared/services/auth.service';
import { LogService } from '../shared/services/log.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnChanges {

    @ViewChild('currentPassword') currentPassword;
    @ViewChild('newPassword') newPassword;
    changePasswordForm: FormGroup;
    @Input() dropPassValidation;
    @Input() username;
    @Input() shouldClearForm;
    pattern: any;
    minChars: number;
    message = '';
    loading = false;

    constructor(private fb: FormBuilder, private _dataService: DataService, private _authService: AuthService, private _log: LogService) { }

    ngOnInit() {
        this.pattern = this.dropPassValidation ? /.*/ : /^.*(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/;
        this.minChars = this.dropPassValidation ? 1 : 7;

        this.changePasswordForm = this.fb.group({
            currentPassword: ['', [Validators.required]],
            'passwords': this.fb.group({
                newPassword: ['',
                    Validators.compose([
                        Validators.required,
                        Validators.pattern(this.pattern),
                        Validators.minLength(this.minChars)])],
                retypeNewPassword: ['', Validators.required]
            }, { validator: this.areEqual })
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.shouldClearForm &&
            changes.shouldClearForm.currentValue === true &&
            !changes.shouldClearForm.previousValue) {
            this.clearForm();
        }
    }

    clearForm = () => {
        this.message = '';
        this.changePasswordForm.reset();
    }

    areEqual(group: FormGroup) {
        const a = group.controls['newPassword'].value;
        const b = group.controls['retypeNewPassword'].value;

        if (a === b) {
            return null;
        }

        return {
            areEqual: true
        };
    }

    onSubmit() {
        this.loading = true;
        this.message = '';
        const currentPassword = this.currentPassword.nativeElement.value;
        const newPassword = this.newPassword.nativeElement.value;

        this._dataService.changePassword(currentPassword, newPassword)
            .subscribe(res => {
                this.loading = false;
                if (res) {
                    this.message = res['faultstring'];
                } else {
                    this._authService.login(this.username, newPassword);
                }
            },
                err => {
                    this._log.error('Error: ' + err);
                    if (err.error && err.error.ReturnValue && err.error.ReturnValue.faultstring) {
                        this.message = err.error.ReturnValue.faultstring;
                    } else {
                        this.message = err.error;
                    }
                    this.loading = false;
                });
    }
}
