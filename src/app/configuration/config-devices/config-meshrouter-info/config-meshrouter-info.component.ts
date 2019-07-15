import { Device } from '../../../shared/types/device';
import { CommonService } from '../../../shared/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { LogService } from '../../../shared/services/log.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { BaseConfigItem } from '../../base-config-widget/base-config-item';
import { MeshRouter } from '../../../shared/types/meshRouter';
import { DataService } from '../../../shared/services/data.service';
import { Subscription } from 'rxjs';
import { AssociatedDevice } from '../../../shared/types/associatedDevice';
import { ServiceHelper } from '../../../shared/services/serviceHelper';
import { MeshRouterLog } from '../../../shared/types/meshRouterLog';
import { MessageService } from 'primeng/api';



@Component({
    selector: 'config-meshrouter-info',
    templateUrl: './config-meshrouter-info.component.html',
    styleUrls: ['./config-meshrouter-info.component.scss']
})
export class ConfigMeshRouterInfoComponent extends BaseConfigItem implements OnDestroy {

    private _router: MeshRouter;
    private _arrAscDevices: Array<any>;
    selectedAsc: any;
    ascDevices: Array<AssociatedDevice>;


    loading: boolean;

    ascDeviceCols = [
        { field: 'PhysicalID', header: 'Device ID' },
        { field: 'DeviceTypeID', header: 'Device Type' },
        { field: 'RSSI', header: 'RSSI' },
        { field: 'LastUpdate', header: 'Association Last Update' }
    ];

    routerTypes = ['CONFIG_DEVICES.MESH_ROUTER_TYPE.COOR',
        'CONFIG_DEVICES.MESH_ROUTER_TYPE.ROUTER',
        'CONFIG_DEVICES.MESH_ROUTER_TYPE.END_DEVICE'
    ];







    constructor(logger: LogService,
        translate: TranslateService,
        common: CommonService,
        msgService: MessageService,
        data: DataService) {
        super(logger, common, translate, msgService, data);
    }










    // Properties
    // -------------------------------------------
    @Input()
    set router(router: MeshRouter) {
        this._router = router;
        if (this._router) {
            this.setRTStatus();
            this.loadAscDevices();
        }
    }


    get router(): MeshRouter {
        return this._router;
    }








    // Internal "Helper" Methods
    // ----------------------------------
    // getDeviceType() {
    //     if (this._router) {
    //         return 'cccc';
    //     } else {
    //         return '';
    //     }
    // }


    geteviceTypeName(row: AssociatedDevice): string {
        if (this._router) {
            return this.Common.getDeviceType(row.DeviceTypeID).Name;
        } else {
            return this.Translate.instant('DEFAULTS.N/A');
        }
    }


    getRSSI() {
        if (this._router) {
            return this._router.LastLog ? '-' + this._router.LastLog.RSSI + ' dBm' : '';
        } else {
            return '';
        }
    }






    // Private "Helper" Methods
    // ----------------------------------
    private setRTStatus() {
        const log: MeshRouterLog = this._router.LastLog;

        if (log) {
            if (!log.DataValid) {
                this._router.Status = '';
            } else if (log.PowerOK) {
                if (log.Charging) {
                    this._router.Status = 'Using Main Power (Battery Charging)';
                    this._router.lblColor = '#000000';
                } else if (!log.ChargingFault) {
                    this._router.Status = 'Using Main Power (Battery Charging Done)';
                    this._router.lblColor = '#000000';
                } else {
                    this._router.Status = 'Using Main Power (Battery Charging FAILED!)';
                    this._router.lblColor = '#ff0000';
                }
            } else {
                this._router.Status = 'Using Battery Power';
                this._router.lblColor = '#ff0000';
            }
        }
    }




    private loadAscDevices() {
        this.loading = true;
        this.Logger.info(`Getting Associated Devices List for MeshRouter - MeshRouter ID: ${this._router.PhysicalID}`);

        this.getDataSubscrp = this.Data.getRouterAssociatedDevices(this._router.ID)
            .subscribe(
                res => {
                    this.ascDevices = res;
                    this.loading = false;
                },
                err => {
                    this.Logger.error(`error in loading MeshRouter Associated devices ${err}`);
                    this.loading = false;
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }

}
