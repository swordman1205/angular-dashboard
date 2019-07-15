import { Component } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { ItemTypes } from '../../shared/data/constants/itemType';
import { TopologyService } from '../../shared/services/topology.service';
import { Asset } from '../../shared/types/asset';
import { AssetMeasureLog } from '../../shared/types/assetMeasureLog';
import { colors } from '../../shared/data/constants/colors';
import { Message, SelectItem } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { LogService } from '../../shared/services/log.service';
import { forkJoin } from 'rxjs';
import {AuthService} from '../../shared/services/auth.service';

declare var moment: any;

@Component({
    selector: 'app-asset-measures-chart',
    templateUrl: './asset-measures-chart.component.html',
    styleUrls: ['./asset-measures-chart.component.scss']
})
export class AssetMeasuresChartComponent extends BaseWidgetComponent {

    name = 'AssetMeasuresChartComponent';
    data: any;
    options = {
        responsive: true,
        maintainAspectRatio: false
    };
    from: Date;
    to: Date;
    lastXTypes: SelectItem[];
    selectedXType: number;
    errorMessage: Message[] = [];

    constructor(private _data: DataService,
                private _topology: TopologyService,
                private _translate: TranslateService,
                _logger: LogService,
                _auth: AuthService) {
        super(_auth, _logger);
        this.data = { labels: [], datasets: [] };

        this.lastXTypes = [];
        this.lastXTypes.push({ label: _translate.instant('WIDGETS.ASSET_MEASURES_CHART.LAST_DAY'), value: 1 });
        this.lastXTypes.push({ label: _translate.instant('WIDGETS.ASSET_MEASURES_CHART.LAST_WEEK'), value: 7 });
        this.lastXTypes.push({ label: _translate.instant('WIDGETS.ASSET_MEASURES_CHART.LAST_MONTH'), value: 30 });
        this.lastXTypes.push({ label: _translate.instant('WIDGETS.ASSET_MEASURES_CHART.CUSTOM_TIME'), value: -1 });

        this.selectedXType = 1;
        this.to = moment()._d;
        this.from = moment(this.to).subtract(this.selectedXType, 'days')._d;
    }

    getData() {
        super.getData();

        this.loading = true;
        const assetMeasures = this.getAssetMeasureIds();
        this.gettingAssetMeasuresLog(assetMeasures);
    }

    getAssetMeasureIds(): any[] {
        const assetMeasures: number[] = [];
        const selectedItem = { id: this.itemId, type: this.itemType };

        if (selectedItem.type === ItemTypes.ASSET) {
            (<Asset>this._topology.getItem(selectedItem)).Measures.forEach(assetMeasure => {
                assetMeasures.push(assetMeasure.id);
            });
        } else if (selectedItem.type === ItemTypes.ASSET_MEASURE) {
            assetMeasures.push(selectedItem.id);
        }
        return assetMeasures;
    }

    gettingAssetMeasuresLog(assetMeasureIds: number[]) {
        const obs$ = [];
        const colorsTheme = [...colors];
        assetMeasureIds.forEach(assetMeasureId => {
            obs$.push(this._data.getAssetMeasureLogs(assetMeasureId, this.from, this.to));
        });

        this.getDataSubscrp = forkJoin(obs$)
            .subscribe(res => {
                const tmpData = { labels: [], datasets: [] };
                (<any[]>res).forEach(assetMeasureLogs => {
                    const logs = [];
                    const labels = [];
                    if (assetMeasureLogs.$values && assetMeasureLogs.$values.length > 0) {
                        assetMeasureLogs.$values.forEach(assetMeasureLog => {
                            logs.push(assetMeasureLog.Value);
                            labels.push(moment((<AssetMeasureLog>assetMeasureLog).Timestamp).format('lll'));
                        });

                        tmpData.datasets.push({
                            data: logs, fill: false, borderColor: colorsTheme.shift(),
                            label: this._topology.getItem({
                                id: (<AssetMeasureLog>(assetMeasureLogs.$values[0])).AssetMeasureID,
                                type: ItemTypes.ASSET_MEASURE
                            }).Name
                        });
                    }

                    tmpData.labels = labels;
                }
                );

                this.addThresholds(res, tmpData);

                // TODO: populate chart only if data has changed
                // populate chart only if data has changed
                /*if (!_.isEqual(dataForCompare.sort(), this.data.datasets[0].data.sort()) ||
                    !_.isEqual(labelsForCompare.sort(), this.data.labels.sort())) {
                    this.update(labelsForCompare, dataForCompare);
                }*/
                this.data = tmpData;
                this.loading = false;
            }, err => {
                this.data = { labels: [], datasets: [] };
            });
    }

    onTimeChange() {
        this.errorMessage = [];
        if (this.selectedXType > 0) {
            this._logger.info(`User change time in asset measure chart to last ${this.selectedXType} days`);
            this.to = moment()._d;
            this.from = moment(this.to).subtract(this.selectedXType, 'days')._d;
        } else {
            this.to = moment(this.to)._d;
            this.from = moment(this.from)._d;
            this._logger.info(`User change time in asset measure chart to custom days: from: ${this.from}, to: ${this.to}`);
        }
        if (this.areDatesValid()) {
            this.getData();
        }
    }

    areDatesValid(): boolean {
        let isValid = true;
        const date = moment();
        if (moment(this.to, 'x') < moment(this.from, 'x')) {
            isValid = false;
            this.errorMessage.push(
                {
                    severity: 'info',
                    summary: this._translate.instant('WIDGETS.ASSET_MEASURES_CHART.TIME_ERROR'),
                    detail: this._translate.instant('WIDGETS.ASSET_MEASURES_CHART.TIME_TO_IS_BIGGER_THAN_FROM')
                });
        } else if (moment(this.to).diff(moment(this.from), 'days') > 90) {
            isValid = false;
            this.errorMessage.push(
                {
                    severity: 'info',
                    summary: this._translate.instant('WIDGETS.ASSET_MEASURES_CHART.TIME_ERROR'),
                    detail: this._translate.instant('WIDGETS.ASSET_MEASURES_CHART.TIME_IS_TOO_LONG')
                });
        } else if (moment(this.to, 'x') > moment(date, 'x') || moment(this.from, 'x') > moment(date, 'x')) {
            isValid = false;
            this.errorMessage.push(
                {
                    severity: 'info',
                    summary: this._translate.instant('WIDGETS.ASSET_MEASURES_CHART.TIME_ERROR'),
                    detail: this._translate.instant('WIDGETS.ASSET_MEASURES_CHART.TIME_IS_IN_THE_FUTURE')
                });
        }
        return isValid;
    }

    addThresholds(data, dataset) {
        const alarmLowLogs = [];
        const alarmHighLogs = [];
        const warningLowLogs = [];
        const warningHighLogs = [];

        // if there's one asset measure, we will add thresholds to the chart
        const selectedItem = { ID: this.itemId, type: this.itemType };
        if (selectedItem && (<any[]>data).length === 1) {
            if (data[0].$values) {
                (<any[]>data[0].$values).forEach((assetMeasureLog) => {
                    const aml = <AssetMeasureLog>assetMeasureLog;
                    alarmLowLogs.push(aml.AlarmLow);
                    alarmHighLogs.push(aml.AlarmHigh);
                    warningLowLogs.push(aml.WarningLow);
                    warningHighLogs.push(aml.WarningHigh);
                });
            }
        }

        if (selectedItem && (<any[]>data).length === 1) {
            dataset.datasets.push(
                this.createThresholdSeries(alarmLowLogs, '#F25A46', 'COMMON.ALARM_LOW_THRESHOLD'),
                this.createThresholdSeries(alarmHighLogs, '#F25A46', 'COMMON.ALARM_HIGH_THRESHOLD'),
                this.createThresholdSeries(warningLowLogs, '#F79320', 'COMMON.WARNING_LOW_THRESHOLD'),
                this.createThresholdSeries(warningHighLogs, '#F79320', 'COMMON.WARNING_HIGH_THRESHOLD')
            );
        }
    }

    createThresholdSeries(data, color, label) {
        return {
            data: data,
            fill: false,
            borderColor: color,
            label: this._translate.instant(label),
            borderDash: [5, 5]
        };
    }

}
