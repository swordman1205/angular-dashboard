import { Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ValidationHelper } from '../../shared/services/validationHelper';
import { LogService } from '../../shared/services/log.service';
import { CommonService } from '../../shared/services/common.service';
import { MessageService } from 'primeng/api';
import { TopologyService } from '../../shared/services/topology.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';






export class BaseConfigItem implements OnDestroy {

    @Output() dirtify = new EventEmitter<any>();
    getDataSubscrp: Subscription;






    constructor(private _logger: LogService,
        private _common: CommonService,
        private _translate: TranslateService,
        private _msgService: MessageService,
        private _data?: DataService,
        private _topology?: TopologyService) {
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

    get MsgService(): MessageService {
        return this._msgService;
    }







    ngOnDestroy() {
        if (this.getDataSubscrp) {
            this.getDataSubscrp.unsubscribe();
        }
    }


    onDirtify(dirtifyName: string = 'default') {
        this.dirtify.emit(dirtifyName);
    }


    protected validateItems(arr: any[], prop: string = 'Name'): boolean {
        if (!(arr && arr.length > 0)) {
            return true;
        }

        const flg: boolean = typeof arr[0][prop] === 'string';
        const err: string = ValidationHelper.validatDuplicateByName(arr, prop);

        if (err) {
            this._msgService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'The current steps list contains duplicate value. duplicate value:' + err
            });

            return false;
        }

        if (flg) {
            if (!ValidationHelper.validatEmptyName(arr, prop)) {
                this._msgService.add({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: 'Can not add empty step'
                });

                return false;
            }
        }

        return true;
    }

}
