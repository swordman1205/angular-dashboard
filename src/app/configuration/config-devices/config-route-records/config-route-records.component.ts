import { Component, Input, OnInit } from '@angular/core';
import { BaseConfigItem } from '../../base-config-widget/base-config-item';
import { Device } from '../../../shared/types/device';
import { LogService } from '../../../shared/services/log.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../shared/services/common.service';
import { TopologyService } from '../../../shared/services/topology.service';
import { Location } from '../../../shared/types/location';
import { TreeNode, SelectItem, MessageService } from 'primeng/api';
import { DeviceTypes } from '../../../shared/data/constants/deviceTypes';
import { RouteRecord } from '../../../shared/types/routeRecord';
import { DataService } from '../../../shared/services/data.service';
import { ServiceHelper } from '../../../shared/services/serviceHelper';






@Component({
    selector: 'config-route-records',
    templateUrl: './config-route-records.component.html',
    styleUrls: ['./config-route-records.component.scss']
})
export class ConfigRouteRecordsComponent extends BaseConfigItem implements OnInit {

    private _treeNode: TreeNode;
    allRouteRcds: Array<RouteRecord>;
    lstRouteRcds: Array<RouteRecord>;
    loading: boolean;

    selFilter: number;
    fltOptions: SelectItem[] = [
        { label: 'All', value: 0 },
        { label: 'Last Record', value: 1 },
        { label: 'Today', value: 2 },
        { label: 'Week', value: 3 }
    ];








    constructor(logger: LogService,
        translate: TranslateService,
        common: CommonService,
        msgService: MessageService,
        data: DataService) {
        super(logger, common, translate, msgService, data);
    }








    // Life Cycle Hooks
    // -------------------------------------------
    ngOnInit() {
        this.selFilter = this.fltOptions[0].value;
    }







    // Properties
    // -------------------------------------------
    @Input()
    set treeNode(node: TreeNode) {
        this._treeNode = node;
        if (this._treeNode) {
            this.loadData();
        }
    }

    get treeNode(): TreeNode {
        return this._treeNode;
    }









    // Event Handlers
    // ----------------------------------------
    filterRecords() {
        switch (this.selFilter) {
            case 0: {
                this.filterByNone();
                break;
            }

            case 1: {
                this.filterByLast();
                break;
            }

            case 2: {
                this.FilterByToday();
                break;
            }

            case 3: {
                this.FilterByLastWeek();
                break;
            }
        }
    }







    // Private "Helper" Operations
    // ----------------------------------------
    private loadData() {
        if (this._treeNode.data.DeviceTypeID === DeviceTypes.MESH_ROUTER) {
            this.getMeshRouteRecords();
        } else {
            this.getDeviceRouteRecords();
        }
    }


    private getDeviceRouteRecords() {
        this.loading = true;
        this.Logger.info(`Getting Route Records for Device - MAC Address: ${this._treeNode.data.PhysicalID}`);

        this.getDataSubscrp = this.Data.getDeviceRouteRecords(this._treeNode.data.ID)
            .subscribe(
                res => {
                    this.allRouteRcds = ServiceHelper.sortArray(res, 'TimeStamp', null, true);
                    this.filterRecords();
                    this.loading = false;
                },
                err => {
                    this.Logger.error(`error in config Devices Route Records ${err}`);
                    this.loading = false;
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }


    private getMeshRouteRecords(noBusy: boolean = false) {
        this.loading = true;
        this.Logger.info(`Getting Route Records for MeshRouter - MAC Address: ${this._treeNode.data.PhysicalID}`);

        this.getDataSubscrp = this.Data.getMeshRouteRecords(this._treeNode.data.ID)
            .subscribe(
                res => {
                    this.allRouteRcds = res;
                    this.filterRecords();
                    this.loading = false;
                },
                err => {
                    this.Logger.error(`error in config MeshRouter Route Records ${err}`);
                    this.loading = false;
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }


    private filterByNone() {
        this.lstRouteRcds = this.allRouteRcds;
    }


    private filterByLast() {
        if (this.allRouteRcds && this.allRouteRcds.length > 0) {
            this.lstRouteRcds = [this.allRouteRcds[0]];
        }
    }

    private FilterByToday() {
        const date: Date = new Date();
        const startDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        const endDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        this.lstRouteRcds = this.allRouteRcds.filter((rtRecrd: RouteRecord) =>
            rtRecrd.TimeStamp >= startDate && rtRecrd.TimeStamp <= endDate);
    }

    private FilterByLastWeek() {
        const date: Date = new Date();
        const sdate = new Date();
        sdate.setDate(sdate.getDate() - 7);
        const startDate = new Date(sdate.getFullYear(), sdate.getMonth(), sdate.getDate(), 0, 0, 0);
        const endDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        this.lstRouteRcds = this.allRouteRcds.filter((rtRecrd: RouteRecord) =>
            rtRecrd.TimeStamp >= startDate && rtRecrd.TimeStamp <= endDate);
    }
}
