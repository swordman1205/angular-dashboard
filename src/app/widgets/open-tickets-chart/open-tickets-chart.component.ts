import { Component, Input } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { ItemTypes } from '../../shared/data/constants/itemType';
import { CommonService } from '../../shared/services/common.service';
import * as _ from 'lodash';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { LogService } from '../../shared/services/log.service';
import { colors } from '../../shared/data/constants/colors';
import {TopologyService} from '../../shared/services/topology.service';
import {AuthService} from '../../shared/services/auth.service';


@Component({
    selector: 'app-open-tickets-chart',
    templateUrl: './open-tickets-chart.component.html',
    styleUrls: ['./open-tickets-chart.component.scss']
})
export class OpenTicketsChartComponent extends BaseWidgetComponent {

    @Input() externalData;
    name = 'OpenTicketsChartComponent';
    data = { labels: [], datasets: [{ data: [], backgroundColor: [], hoverBackgroundColor: [] }] };
    options: any;
    loading = true;

    constructor(private _data: DataService,
                private _common: CommonService,
                _logger: LogService,
                _auth: AuthService) {
        super(_auth, _logger);

        this.options = {
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
    }

    getData() {
        super.getData();

        this.loading = true;
        this._logger.debug(`Getting data for widget open tickets chart - ID: ${this.itemId}`);
        if (this.itemType === ItemTypes.LOCATION) {
            this.getDataSubscrp = this._data.getLocationTicketSummary(this.itemId)
                .subscribe(
                    res => this.getDataSuccess(res),
                    err => this.getDataError(ItemTypes.LOCATION, err));
        } else if (this.itemType === ItemTypes.ASSET) {
            this.getDataSubscrp = this._data.getAssetTicketSummary(this.itemId)
                .subscribe(
                    res => this.getDataSuccess(res),
                    err => this.getDataError(ItemTypes.ASSET, err)
                );
        } else if (this.itemType === ItemTypes.LOCATION_TAG) {
            this.getDataSuccess(this.externalData);
        }
    }

    getDataError(itemType: string, err: any) {
        this._logger.error(`Error in getting data for open tickets chart widget (${itemType}): ${err}`);
        this.update([], []);
        this.loading = false;
    }

    getDataSuccess(tickets) {
        const labelsForCompare = [];
        const dataForCompare = [];

        Object.keys(tickets).forEach(
            key => {
                const val = tickets[key];
                if (!isNaN(+key)) {
                    dataForCompare.push(val);
                    labelsForCompare.push(this._common.getTicketReasonName(+key));
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
