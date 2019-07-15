import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { LogService } from './log.service';
import { User } from '../types/user';
import { AccountStatuses } from '../data/enums/account-statuses.enum';
import { AlertsService } from './alerts.service';
import { TopologyService } from './topology.service';
import { CommonService } from './common.service';
import { RouteService } from './route.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserSetting } from '../types/userSetting';
import { forkJoin, Subject } from 'rxjs';
import { LoginResponse } from '../types/loginResponse';
import { Events } from '../data/constants/events';
import { ItemTypes, Mode } from '../data/constants/itemType';
import { faGlasses } from '@fortawesome/pro-light-svg-icons';



@Injectable()
export class AuthService {

    private _isLoggedIn = false;
    isServicesInitialized = false;
    loginResp: LoginResponse;
    private _redirectUrl: string;
    private messageIsInLoginProcess: BehaviorSubject<boolean>;
    messageIsInLoginProcess$: Observable<boolean>;
    private messageChangePassword: BehaviorSubject<any>;
    messageChangePassword$: Observable<any>;
    private message: Subject<string>;
    message$: Observable<string>;
    dataInit = false;



    constructor(private _data: DataService,
        private _log: LogService,
        private _alerts: AlertsService,
        private _topology: TopologyService,
        private _common: CommonService,
        private _route: RouteService) {
        this.message = new BehaviorSubject('');
        this.message$ = this.message.asObservable();
        let timeoutIndex;

        this._topology.message$.subscribe((data) => {
            if (data === Events.TOPOLOGY_SERVICE_IS_NOT_INITIALIZED) {
                if (timeoutIndex) {
                    clearTimeout(timeoutIndex);
                }
                timeoutIndex = setTimeout(() => {
                    this._redirectUrl = this._route.getCurrentUrl();
                    this.initServices();
                }, 2000);
            }
        });

        this.messageIsInLoginProcess = new BehaviorSubject(false);
        this.messageIsInLoginProcess$ = this.messageIsInLoginProcess.asObservable();
        this.messageChangePassword = new BehaviorSubject({ dropPassValidation: false, show: false });
        this.messageChangePassword$ = this.messageChangePassword.asObservable();
    }

    get redirectUrl(): string {
        return this._redirectUrl;
    }

    set redirectUrl(value: string) {
        this._redirectUrl = value;
    }

    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    reset() {
        this._isLoggedIn = false;
    }

    login(loginResp, password) {
        this.messageIsInLoginProcess.next(true);
        this.messageChangePassword.next({ show: false, dropPassValidation: false });
        this._data.login(loginResp, password)
            .subscribe((res) => {
                this.loginResp = new LoginResponse(res.AccountStatus, res.DropPassValidation, res.LockWarnning, res.Ticket, res.UserID);
                try {
                    sessionStorage.setItem('ecsLoginUser', JSON.stringify(this.loginResp));
                } catch (err) {
                    this._log.warn('No support for sessionStorage, or storage is full');
                }
                if (this.loginResp.UserID > 0) {
                    switch (this.loginResp.AccountStatus) {
                        case AccountStatuses.CREATED:
                            this._alerts.info(
                                'LOGIN.ACCOUNT_VERIFICATION_REQUIRED_TITLE',
                                'LOGIN.ACCOUNT_VERIFICATION_REQUIRED_DESCRIPTION')
                                .then(() => this.messageIsInLoginProcess.next(false));
                            break;
                        case AccountStatuses.PENDING:
                            this.messageChangePassword.next({
                                dropPassValidation: res.DropPassValidation,
                                show: true
                            });
                            this.messageIsInLoginProcess.next(false);
                            break;
                        case AccountStatuses.ACTIVE:
                            this._log.info('User Authenticated... Initialize services...');
                            this._isLoggedIn = true;
                            this.initServices();
                            break;
                        case AccountStatuses.LOCKED:
                            this._alerts.warning(
                                'LOGIN.ACCOUNT_LOCKED_TITLE',
                                'LOGIN.ACCOUNT_LOCKED_DESCRIPTION')
                                .then(() => this.messageIsInLoginProcess.next(false));
                            break;
                    }
                }
            }
                , (err) => {
                    this._log.error('Error');

                    if (err.message.indexOf('401') > 0) {
                        this._alerts.error('LOGIN.FAIL_TITLE', 'LOGIN.FAIL_DESCRIPTION');
                    } else {
                        this._alerts.error('LOGIN.FAIL_TITLE', 'LOGIN.FAIL_GENERAL_DESCRIPTION');
                    }
                    this.messageIsInLoginProcess.next(false);
                }
            );
    }


    initServices() {
        this.isServicesInitialized = false;

        let userData$;
        let topologyData$;
        let commonData$;
        let userSettings$;

        userData$ = this._data.getAuthenticatedUser();
        topologyData$ = this._data.getUserLocations();
        commonData$ = this._data.getCommonData();
        userSettings$ = this._data.getUserSettings();

        forkJoin([userData$, topologyData$, commonData$, userSettings$])
            .subscribe(data => {
                this.setDateInServices(data);
            }, err => this._log.error(`Error in auth service: ${err}`));
    }


    setDateInServices(data) {
        // this.user = <any>data[0] as User;
        this._topology.init(data[1], <UserSetting>(<any>data[3]));
        this._common.init(data[2], <any>data[0] as User);
        this.isServicesInitialized = true;
        this.messageIsInLoginProcess.next(false);
        this.message.next(Events.ALL_SERVICES_INITIALIZED);
        this.dataInit = true;
        this.message.next('');
        this.redirectAfterLogin();
    }

    redirectAfterLogin() {
        if (this._redirectUrl) {
            const urlStr = `${this._redirectUrl}`;
            this._redirectUrl = undefined;
            this._route.navigateToUrl(urlStr);
        } else if (this._topology.isFilteredByTags) {
            this._route.navigateToPath({
                itemType: ItemTypes.TAGS,
                itemID: 0
            });
        } else {
            const locationId: number = this._topology.getRoots()[0].id;
            this._route.navigateToPath({
                itemType: ItemTypes.LOCATION,
                itemID: locationId
            });
        }
    }
}
