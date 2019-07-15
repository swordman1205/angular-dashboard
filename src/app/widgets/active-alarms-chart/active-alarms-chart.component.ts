import { Component, Input, SimpleChanges } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { ItemTypes } from '../../shared/data/constants/itemType';
import { CommonService } from '../../shared/services/common.service';
import * as _ from 'lodash';
import { colors } from '../../shared/data/constants/colors';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { LogService } from '../../shared/services/log.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-active-alarms-chart',
    templateUrl: './active-alarms-chart.component.html',
    styleUrls: ['./active-alarms-chart.component.scss']
})
export class ActiveAlarmsChartComponent extends BaseWidgetComponent {

    @Input() externalData;
    name = 'ActiveAlarmsChartComponent';
    data = { labels: [], datasets: [{ data: [], backgroundColor: [], hoverBackgroundColor: [] }] };
    options = {
        maintainAspectRatio: false,
        cutoutPercentage: 80,
        legend: {
            position: 'right',
            labels: {
                fontColor: '#000000',
                usePointStyle: true
            }
        }
    };
    loading = true;

    constructor(private _data: DataService,
        private _common: CommonService,
        _logger: LogService,
        _auth: AuthService) {
        super(_auth, _logger);
    }

    getData() {
        super.getData();

        this.loading = true;

        this._logger.debug(`Getting data for widget active alarms chart - ID: ${this.itemId}`);
        if (this.itemType === ItemTypes.LOCATION) {
            this.getDataSubscrp = this._data.getLocationAlarmSummary(this.itemId)
                .subscribe(
                    res => this.getDataSuccess(res),
                    err => this.getDataError(ItemTypes.LOCATION, err));
        } else if (this.itemType === ItemTypes.ASSET) {
            this.getDataSubscrp = this._data.getAssetAlarmSummary(this.itemId)
                .subscribe(
                    res => this.getDataSuccess(res),
                    err => this.getDataError(ItemTypes.ASSET, err)
                );
        } else if (this.itemType === ItemTypes.LOCATION_TAG) {
            this.getDataSuccess(this.externalData);
        }
    }

    getDataError(itemType: string, err: any) {
        this._logger.error(`Error in getting data for active alarms widget (${itemType}): ${err}`);
        this.update([], []);
        this.loading = false;
    }

    getDataSuccess(alarms) {
        const labelsForCompare = [];
        const dataForCompare = [];

        Object.keys(alarms).forEach(
            key => {
                const val = alarms[key];
                if (!isNaN(+key)) {
                    dataForCompare.push(val);
                    labelsForCompare.push(this._common.getStatusName(+key));
                }
            });

        // populate chart only if data has changed
        if (!_.isEqual(dataForCompare.sort(), this.data.datasets[0].data.sort()) ||
            !_.isEqual(labelsForCompare.sort(), this.data.labels.sort())) {
            this.update(labelsForCompare, dataForCompare);
        }
        this.loading = false;
    }

    update(labels: any[], data: any[]) {
        this.data = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: colors,
                    hoverBackgroundColor: colors
                }]
        };
    }
}
