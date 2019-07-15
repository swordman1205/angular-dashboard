import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {AlertsService} from '../../shared/services/alerts.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnDestroy, OnInit {

    user = '';
    password = '';
    isInLoginProcess = false;
    dropPassValidation = true;
    subscriber: Subscription;
    subscriberChangePassword: Subscription;
    isChangePasswordVisible = true;

    constructor(private _authService: AuthService, private _alert: AlertsService) {
    }

    ngOnInit() {
        // Set Boolean var for indicating IS System in a
        // LONG Login process (Authentication + User data + Locations + Common data + etc.)
        this.subscriber = this._authService.messageIsInLoginProcess$
            .subscribe(
                // Next Handler
                isInLoginProcess => this.isInLoginProcess = isInLoginProcess);

        // Do we need to Change passowrd? (DUE to PENDING Account status)
        this.subscriberChangePassword = this._authService.messageChangePassword$
            .subscribe(
                // Next Handler
                res => {
                this.dropPassValidation = res.dropPassValidation;
                this.isChangePasswordVisible = res.show;
            });
    }

    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

    onSubmit() {
        if (!this.isInLoginProcess && this.user.length && this.password.length && !this._alert.isVisible()) {
            this._authService.login(this.user, this.password);
        }
    }
}
