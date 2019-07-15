import { Component, OnDestroy, OnInit } from '@angular/core';
import { TopologyService } from '../../shared/services/topology.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { RouteService } from '../../shared/services/route.service';
import { IEcsPath } from '../../shared/interfaces/ecsPath';
import { LogService } from '../../shared/services/log.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';
import { CommonService } from '../../shared/services/common.service';
import { ConfigurationComponent } from '../configuration.component';
import { IECSObject } from '../../shared/interfaces/ecsObject';
import { DataRowStates } from '../../shared/data/enums/data-row-state.enum';
import { MessageService } from 'primeng/api';
import { ValidationHelper } from '../../shared/services/validationHelper';
import { AuthService } from '../../shared/services/auth.service';
import { Events } from '../../shared/data/constants/events';

@Component({
    selector: 'app-base-config-widget',
    templateUrl: './base-config-widget.component.html',
    styleUrls: ['./base-config-widget.component.scss']
})
export class BaseConfigWidgetComponent implements OnInit, OnDestroy {

    itemType;
    itemId;
    locationID: number;
    isDirty = false;
    protected extraDirtyObjects: Array<string>;
    private tabKey: string;

    private canDeactvSource = new Subject<boolean>();
    canDeactv$: Observable<boolean>;

    getDataSubscrp: Subscription;
    saveDataSubscrp: Subscription;
    private routeSubscription$: Subscription;
    private authInitSubscription$: Subscription;
    private saveHndlSubscrp: Subscription;
    private getHndlSubscrp: Subscription;
    private _ecsObject: IECSObject;
    loading = false;
    dataInit = false;






    constructor(private _router: RouteService,
        private _topology: TopologyService,
        private _data: DataService,
        private _logger: LogService,
        private _translate: TranslateService,
        private _msgService: MessageService,
        private _config: ConfigurationComponent,
        private _auth: AuthService,
        private _common: CommonService = null) {
    }







    // ------------------------------------
    // Service Related Properties
    // ------------------------------------
    get Topology(): TopologyService {
        return this._topology;
    }

    get Data(): DataService {
        return this._data;
    }

    get Logger(): LogService {
        return this._logger;
    }

    get Translate(): TranslateService {
        return this._translate;
    }

    get Common(): CommonService {
        return this._common;
    }

    get Config(): ConfigurationComponent {
        return this._config;
    }

    get MsgService(): MessageService {
        return this._msgService;
    }

    set ECSObject(ecsObj: IECSObject) {
        this._ecsObject = ecsObj;
    }








    // Life Cycle Hooks
    // ---------------------
    ngOnInit(): void {
        this.canDeactv$ = this.canDeactvSource.asObservable();

        this.saveHndlSubscrp = this._config.save.subscribe(
            res => {
                this.saveData();
            },
            err => {
                this._logger.error('Attempt to SAVE Configuration widget data has failed!. Error: ' + err);
            });

        this.getHndlSubscrp = this._config.refresh.subscribe(
            res => {
                this.getData();
            },
            err => {
                this._logger.error('Attempt to GET Configuration widget data has failed!. Error: ' + err);
            });


        this.routeSubscription$ = this._router.getRoutingSubscription()
            .subscribe((path: IEcsPath) => {
                this.itemType = path.itemType;
                this.itemId = path.itemID;

                if (this.itemType && this.itemId) {
                    if (this._auth.dataInit) {
                        const item = this._topology.getItemLocation(this.itemType, this.itemId);
                        if (this.locationID !== item.ID) {
                            this.locationID = item.ID;
                            this.getData();
                        }
                    }
                }
            });


        // In case of refresh, widget should get data after all services were initialized
        this.authInitSubscription$ = this._auth.message$.subscribe(msg => {
            if (msg === Events.ALL_SERVICES_INITIALIZED) {
                if (this.itemType && this.itemId) {
                    const item = this._topology.getItemLocation(this.itemType, this.itemId);
                    this.locationID = item.ID;
                    this.getData();
                }
            }
        });
    }


    ngOnDestroy() {
        if (this.getDataSubscrp) {
            this.getDataSubscrp.unsubscribe();
        }

        if (this.saveDataSubscrp) {
            this.saveDataSubscrp.unsubscribe();
        }

        if (this.routeSubscription$) {
            this.routeSubscription$.unsubscribe();
        }

        if (this.saveHndlSubscrp) {
            this.saveHndlSubscrp.unsubscribe();
        }

        if (this.getHndlSubscrp) {
            this.getHndlSubscrp.unsubscribe();
        }

        if (this.authInitSubscription$) {
            this.authInitSubscription$.unsubscribe();
        }
    }









    // Public Operations
    // ------------------------
    getData() {
        if (this.getDataSubscrp) {
            this.getDataSubscrp.unsubscribe();
        }
    }


    saveData() {
        if (this.saveDataSubscrp) {
            this.saveDataSubscrp.unsubscribe();
        }
    }


    dirtifyItem(dirtifyName: string = 'default') {
        if (dirtifyName === 'default') {
            if (this._ecsObject.RowState === DataRowStates.UNCHANGED) {
                this._ecsObject.RowState = DataRowStates.MODIFIED;
            }
        } else {
            if (!this.extraDirtyObjects) {
                this.extraDirtyObjects = [];
            }
            if (!this.extraDirtyObjects.includes(dirtifyName)) {
                this.extraDirtyObjects.push(dirtifyName);
            }
        }

        this._config.dirtifyTab();
        this.isDirty = true;
    }


    protected validateAdditionalItems(arr: any[], prop: string = 'Name'): boolean {
        if (!(arr && arr.length > 0)) {
            return true;
        }

        const flg: boolean = typeof arr[0][prop] === 'string';
        const err: string = ValidationHelper.validatDuplicateByName(arr, prop);

        if (err) {
            this.MsgService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'The current list contains duplicate value. duplicate value:' + err
            });

            return false;
        }

        if (flg) {
            if (!ValidationHelper.validatEmptyName(arr, prop)) {
                this.MsgService.add({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: 'Can not add empty value'
                });

                return false;
            }
        }

        return true;
    }


    canDeactivate(): Observable<boolean> | boolean {
        if (this.isDirty) {
            this._msgService.clear();
            this._msgService.add({
                key: 'confirmDialg',
                sticky: true,
                severity: 'warn',
                summary: 'Un-Saved Config Item',
                detail: 'Are you sure you want to navigate out without saving your changes?',
                data: {
                    this: this,
                    onConfirm: () => {
                        this._msgService.clear('confirmDialg');
                        this.isDirty = false;
                        this._config.unDirtifyAllTabs();
                        this.canDeactvSource.next(true);
                        // this.canDeactvSource.complete();
                    },
                    onReject: () => {
                        this._msgService.clear('confirmDialg');
                        this._config.restorePrevTab();
                        this.canDeactvSource.next(false);
                        // this.canDeactvSource.complete();
                    }
                }
            });
            return this.canDeactv$;
        } else {
            return true;
        }
    }
}
