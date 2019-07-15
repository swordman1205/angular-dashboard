import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { LogService } from '../../shared/services/log.service';
import { TranslateService } from '@ngx-translate/core';
import { EcsDatetimePipe } from '../../shared/pipes/ecs-datetime.pipe';
import {TopologyService} from '../../shared/services/topology.service';
import {AuthService} from '../../shared/services/auth.service';

declare var moment: any;

@Component({
    selector: 'app-activity-grid',
    templateUrl: './activity-grid.component.html',
    styleUrls: ['./activity-grid.component.scss']
})
export class ActivityGridComponent extends BaseWidgetComponent implements OnInit {

    name = 'ActivityGridComponent';
    cols: any[];
    data;
    activitiesLength: { rows: 0 };

    constructor(private _data: DataService,
                _logger: LogService,
                private _translate: TranslateService,
                _auth: AuthService) {
        super(_auth, _logger);
    }

    ngOnInit() {
        const userHeader = this._translate.instant('WIDGETS.ACTIVITY.COLUMNS.USER');
        const actionHeader = this._translate.instant('WIDGETS.ACTIVITY.COLUMNS.ACTION');
        const objectHeader = this._translate.instant('WIDGETS.ACTIVITY.COLUMNS.ITEM');
        const timeHeader = this._translate.instant('WIDGETS.ACTIVITY.COLUMNS.TIME');
        this.cols = [
            { field: 'UserName', header: userHeader, headerClass: 'user-col', columnClass: 'three-dots user-col' },
            { field: 'ActionName', header: actionHeader, columnClass: 'three-dots' },
            { field: 'ObjectName', header: objectHeader, columnClass: 'three-dots' },
            { field: 'TimeStampParsed', header: timeHeader, headerClass: 'time-col', columnClass: 'three-dots time-col' }
        ];
    }

    getData() {
        super.getData();

        const endDate = new Date();
        const startDate = moment(endDate).subtract(1, 'days')._d;

        this._logger.debug(`Getting data for widget activity - LocationId: ${this.itemId}`);
        this.loading = true;
        this.getDataSubscrp = this._data.getUsersActions(this.itemId, startDate, endDate)
            .subscribe(
                res => {
                    res.forEach(action => action.TimeStampParsed = EcsDatetimePipe.prototype.transform(action.Timestamp));
                    this.data = res;
                    this.loading = false;
                    this.activitiesLength = { rows: this.data.length };
                },
                err => {
                    this._logger.error(`Error in activity grid: ${err}`);
                    this.data = [];
                    this.loading = false;
                    this.activitiesLength = { rows: 0 };
                });
    }
}
