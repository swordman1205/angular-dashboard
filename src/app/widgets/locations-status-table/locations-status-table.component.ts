import { Component } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { LogService } from '../../shared/services/log.service';
import { EcsDatetimePipe } from '../../shared/pipes/ecs-datetime.pipe';
import { EcsStatusPipe } from '../../shared/pipes/ecs-status.pipe';
import { AssetMeasureLastStatus } from '../../shared/types/assetMeasureLastStatus';
import { TopologyService } from '../../shared/services/topology.service';
import {AuthService} from '../../shared/services/auth.service';

@Component({
    selector: 'app-locations-status-table',
    templateUrl: './locations-status-table.component.html',
    styleUrls: ['./locations-status-table.component.scss']
})
export class LocationsStatusTableComponent extends BaseWidgetComponent {

    name = 'LocationsStatusTableComponent';
    data;
    locationStatusesLength: { rows: 0 };
    _logger: LogService;

    constructor(private _data: DataService,
                _logger: LogService,
                _auth: AuthService) {
        super(_auth, _logger);
    }

    getData() {
        super.getData();

        this._logger.debug(`Getting data for widget locations Status - LocationId: ${this.itemId}`);
        this.loading = true;
        this.getDataSubscrp = this._data.getLocationStatuses(this.itemId)
            .subscribe(
                res => {
                    (<any>res).forEach((locStatus: AssetMeasureLastStatus) => {
                        locStatus.StatusTimestampParsed = EcsDatetimePipe.prototype.transform(locStatus.StatusTimestamp);
                        locStatus.StatusViewParsed = EcsStatusPipe.prototype.transform(locStatus.StatusView);
                    });
                    this.data = res;
                    this.loading = false;
                    this.locationStatusesLength = { rows: this.data.length };
                },
                err => {
                    this._logger.error(`error in locationStatusTable ${err}`);
                    this.data = [];
                    this.loading = false;
                    this.locationStatusesLength = { rows: 0 };
                });
    }
}
