import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';
import {DataService} from '../../shared/services/data.service';
import {colors} from '../../shared/data/constants/colors';
import {CommonService} from '../../shared/services/common.service';
import {TopologyService} from '../../shared/services/topology.service';

@Component({
    selector: 'app-tags-status',
    templateUrl: './tags-status.component.html',
    styleUrls: ['./tags-status.component.scss']
})
export class TagsStatusComponent implements OnChanges {

    @Input() locationIds;
    @Input() assetIds;
    loading = false;
    activeAlarmsData;
    isActiveAlarmsData = false;
    openTicketsData;
    isOpenTicketsData = false;
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

    constructor(private _dataService: DataService,
                private _common: CommonService,
                private _topologyService: TopologyService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        const locationIdsChange: SimpleChange = changes.locationIds;
        const assetIdsChange: SimpleChange = changes.assetIds;

        if (!locationIdsChange.isFirstChange() ||
            !assetIdsChange.isFirstChange() ||
            !_.isEqual(_.sortBy(locationIdsChange.currentValue), _.sortBy(locationIdsChange.previousValue)) ||
            !_.isEqual(_.sortBy(assetIdsChange.currentValue), _.sortBy(assetIdsChange.previousValue))
        ) {
            this.getData();
        }
    }

    getData = () => {
        this.loading = true;

        if (this.locationIds.length > 0 && this.assetIds.length === 0) {
            this._dataService.getTaggedLocationSummary(this.locationIds)
                .subscribe(res => {
                    this.populateChart(res);
                    this.loading = false;
                });
        } else if (this.locationIds.length === 0 && this.assetIds.length > 0) {
            this._dataService.getTaggedAssetSummary(this.assetIds)
                .subscribe(res => {
                    this.populateChart(res);
                    this.loading = false;
                });
        } else if (this.locationIds.length > 0 && this.assetIds.length > 0) {
            let assetIds = [];
            this.locationIds.forEach(locationId => {
                const assets = this._topologyService.getCachedLocation(locationId).Assets;
                assets.forEach(asset => {
                    assetIds.push(asset.ID);
                });
            });
            assetIds = _.uniq(assetIds);
            assetIds = assetIds.filter(id => {
                return this._topologyService.whiteListAssetsForTags.has(id);
            });

            this._dataService.getTaggedAssetSummary(assetIds)
                .subscribe(res => {
                    this.populateChart(res);
                });
            this.loading = false;
        } else {
            console.warn('No selected ids found in tags');
            this.populateChart(undefined);
            this.loading = false;
        }
    }

    populateChart = data => {
        const activeAlarmsData = this.parseActiveAlarmsData(data);
        this.activeAlarmsData = {
            labels: activeAlarmsData.labels,
            datasets: [
                {
                    data: activeAlarmsData.values,
                    backgroundColor: colors,
                    hoverBackgroundColor: colors
                }]
        };

        const openTicketsData = this.parseOpenTicketsData(data);
        this.openTicketsData = {
            labels: openTicketsData.labels,
            datasets: [
                {
                    data: openTicketsData.values,
                    backgroundColor: colors,
                    hoverBackgroundColor: colors
                }]
        };
    }

    parseActiveAlarmsData = data => {
        const labels = [];
        const values = [];

        if (data && data.length) {
            for (const key in data[0]) {
                if (data[0].hasOwnProperty(key) && !isNaN(+key)) {
                    values.push(data[0][key]);
                    labels.push(this._common.getStatusName(+key));
                }
            }
            this.isActiveAlarmsData = (values.length > 0 && labels.length > 0);
        } else {
            this.isActiveAlarmsData = false;
        }

        return {labels, values};
    }

    parseOpenTicketsData = data => {
        const labels = [];
        const values = [];

        if (data && data.length) {
            for (const key in data[1]) {
                if (data[1].hasOwnProperty(key) && !isNaN(+key)) {
                    values.push(data[1][key]);
                    labels.push(this._common.getTicketReasonName(+key));
                }
            }
            this.isOpenTicketsData = (values.length > 0 && labels.length > 0);
        } else {
            this.isOpenTicketsData = false;
        }

        return {labels, values};
    }
}
