import {
    AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, SimpleChanges, ViewChild
} from '@angular/core';
import { Message, SelectItem } from 'primeng/primeng';
import * as Highcharts from 'highcharts/highcharts';
import { TranslateService } from '@ngx-translate/core';
import { BaseWidgetComponent } from '../widgets/base-widget/base-widget.component';
import { Asset } from '../shared/types/asset';
import { AssetMeasureLog } from '../shared/types/assetMeasureLog';
import { ItemTypes } from '../shared/data/constants/itemType';
import { TopologyService } from '../shared/services/topology.service';
import { LogService } from '../shared/services/log.service';
import { DataService } from '../shared/services/data.service';
import { CommonService } from '../shared/services/common.service';
import { forkJoin } from 'rxjs';
import {AuthService} from '../shared/services/auth.service';

declare var moment: any;

@Component({
    selector: 'app-asset-measure-highchart',
    templateUrl: './asset-measure-highchart.component.html',
    styleUrls: ['./asset-measure-highchart.component.scss']
})
export class AssetMeasureHighchartComponent extends BaseWidgetComponent implements AfterViewInit, OnChanges, OnDestroy {

    @ViewChild('amChart') chartTarget: ElementRef;
    loading = true;
    chart: any;
    data: any;
    from: Date;
    to: Date;
    lastXTypes: SelectItem[];
    selectedXType: number;
    errorMessage: Message[] = [];
    initialized = false;
    yAxisInitialized = false;
    rangeDates: Date[];
    maxSearchFilterDays = 30;   // will be override by app settings

    constructor(private _data: DataService,
                private _topology: TopologyService,
                private _translate: TranslateService,
                _logger: LogService,
                private _common: CommonService,
                _auth: AuthService) {
        super(_auth, _logger);

        const maxDays = this._common.getApplicationSetting('General', 'MaxSearchFilterDays');
        this.maxSearchFilterDays = maxDays ? Number(maxDays.Value) : this.maxSearchFilterDays;

        this.lastXTypes = [];
        this.lastXTypes.push({
            label: _translate.instant('WIDGETS.ASSET_MEASURES_CHART.LAST_DAY'),
            value: 1
        });
        this.lastXTypes.push({
            label: _translate.instant('WIDGETS.ASSET_MEASURES_CHART.LAST_WEEK'),
            value: 7
        });
        this.lastXTypes.push({
            label: _translate.instant('WIDGETS.ASSET_MEASURES_CHART.LAST_MONTH'),
            value: 30
        });
        this.lastXTypes.push({
            label: _translate.instant('WIDGETS.ASSET_MEASURES_CHART.CUSTOM_TIME'),
            value: -1
        });

        this.selectedXType = 1;
        // debug parameters for Erez Env - Asset DC6B - Door
        // this.to = moment('2016-05-10')._d;
        // this.from = moment('2016-05-01')._d;
        this.to = moment()._d;
        this.from = moment(this.to).subtract(this.selectedXType, 'days')._d;
    }

    ngAfterViewInit() {
        this.init();
    }

    init(invokeGetData = true) {
        this.initChart();
        this.initialized = true;
        if (invokeGetData) {
            this.getData();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    ngOnDestroy() {
        this.destroyChart();
    }

    destroyChart() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
            this.initialized = false;
            this.yAxisInitialized = false;
            this._logger.debug('Chart destroyed');
        }
    }

    initChart() {
        this.chart = Highcharts.chart(this.chartTarget.nativeElement, {
            credits: {
                enabled: false
            },
            margin: [0, 0, 0, 0],
            title: { text: '' },
            plotOptions: {
                series: {
                    turboThreshold: 0 // more than 1000 points to a series
                }
            },
            subtitle: { text: '' },
            xAxis: [{
                id: 0,
                type: 'datetime',
                tickLength: 1,
                lineWidth: 1,
                labels: {
                    formatter: function () {
                        return Highcharts.dateFormat('%I:%M %p', this.value);
                    }
                },
                gridLineWidth: 1
            },
            {
                linkedTo: 0,
                type: 'datetime',
                tickLength: 1,
                lineWidth: 1,
                tickInterval: 24 * 3600 * 1000,
                labels: {
                    formatter: function () {
                        return Highcharts.dateFormat('%a %d %b', this.value);
                    }
                }
            }],
            yAxis: {
                visible: false  // Hide default yAxis, because I create dynamic yAxis
            },
            tooltip: {
                shared: false,
                formatter: function () {
                    const isDigital = this.point.isDigital;
                    let val = '';

                    if (isDigital) {
                        val = this.y === 1 ? this.point.trueString : this.point.falseString;
                    } else {
                        val = this.y;
                    }
                    return `${this.series.name}: ${val} ${this.point.units ? this.point.units : ''}`;
                }
            },
            legend: {
                align: 'center',
                x: 0,
                y: 20,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            }
        });
    }

    clearChartSeries() {
        if (this.initialized) {
            if (this.chart.series) {
                while (this.chart.series.length > 0) {
                    this.chart.series[0].remove(true);
                }
            }
        }
    }

    getData() {
        this.destroyChart();
        this.init(false);
        super.getData();
        this.loading = true;
        this.clearChartSeries();
        const assetMeasures = this.getAssetMeasureIds();
        this._logger.debug(`ASSET MEASURES TO GET DATA: ${assetMeasures.length}`);
        this.gettingAssetMeasuresLog(assetMeasures);
    }

    getAssetMeasureIds(): any[] {
        const assetMeasures: number[] = [];
        const selectedItem = { id: this.itemId, type: this.itemType };

        if (selectedItem.type === ItemTypes.ASSET) {
            const asset = <Asset>this._topology.getItem(selectedItem);
            if (asset) {
                if (!isNaN(asset.id)) {
                    asset.Measures.forEach(assetMeasure => {
                        assetMeasures.push(assetMeasure.id);
                    });
                }
            }
        } else if (selectedItem.type === ItemTypes.ASSET_MEASURE) {
            assetMeasures.push(selectedItem.id);
        }
        return assetMeasures;
    }

    gettingAssetMeasuresLog(assetMeasureIds: number[]) {
        const obs$ = [];
        assetMeasureIds.forEach(assetMeasureId => {
            obs$.push(this._data.getAssetMeasureLogs(assetMeasureId, this.from, this.to));
        });
        this._logger.debug(`ASSET MEASURES TO GET DATA - out: ${obs$.length}`);
        this.getDataSubscrp = forkJoin(obs$)
            .subscribe(res => {
                this._logger.debug(`ASSET MEASURES TO GET DATA - in: ${res.length}`);
                const tmpData = { labels: [], datasets: [], yAxis: [] };
                let yAxisOppositeSide = false;
                let yAxisIndex = '';
                let chartType = 'spline';
                let asset;
                if (this.itemType === ItemTypes.ASSET) {
                    asset = this._topology.assetCache[this.itemId];
                } else {
                    const am = this._topology.assetMeasureCache[this.itemId];
                    asset = am ? this._topology.assetCache[am.AssetID] : undefined;
                }

                if (asset) {
                    res.forEach((assetMeasureLogs, idx) => {
                            const logs = [];
                            const labels = [];

                            // digital series should be of type line
                            chartType = 'spline';
                            let measureId = -1;
                            asset.Measures.forEach(measure => {
                                if (assetMeasureLogs.length > 0 &&
                                    measure.id === (<AssetMeasureLog>assetMeasureLogs[0]).AssetMeasureID) {
                                    measureId = measure.MeasureID;
                                    if (measure.MeasureID === 3) {
                                        chartType = 'line';
                                    }
                                }
                            });

                            if (assetMeasureLogs && assetMeasureLogs.length > 0) {
                                const precision =
                                    this._topology.assetMeasureCache[assetMeasureLogs[0].AssetMeasureID].Precision;

                                yAxisIndex = `yAxis${idx}`;
                                const am = this._topology.assetMeasureCache[(<AssetMeasureLog>assetMeasureLogs[0]).AssetMeasureID];
                                const mUnitsText = am.MeasureID === 3 ? '' : this._common.getMeasureUnitText(measureId);

                                assetMeasureLogs.forEach(assetMeasureLog => {
                                    // toFixed returns string, so /1 returns it to number
                                    const x = moment.utc(assetMeasureLog.Timestamp).valueOf();
                                    logs.push(
                                        {
                                            x,
                                            y: assetMeasureLog.Value.toFixed(precision) / 1,
                                            id: `${moment.utc(assetMeasureLog.Timestamp).valueOf()}_${yAxisIndex}`,
                                            isDigital: am.MeasureID === 3,
                                            trueString: am.TrueString,
                                            falseString: am.FalseString,
                                            units: mUnitsText
                                        });
                                });

                                const name = assetMeasureLogs.length ?
                                    `${this._topology.assetMeasureCache[((<AssetMeasureLog>assetMeasureLogs[0]).AssetMeasureID)].Name}`
                                    : '';
                                /*format: `{value}${mUnitsText}`,*/
                                if (!this.yAxisInitialized) {
                                    tmpData.yAxis.push(
                                        {
                                            id: yAxisIndex,
                                            isDigital: am.MeasureID === 3,
                                            trueString: am.TrueString,
                                            falseString: am.FalseString,
                                            labels: {
                                                formatter: function () {
                                                    const isDigital = this.axis.userOptions.isDigital;
                                                    const trueString = this.axis.userOptions.trueString;
                                                    const falseString = this.axis.userOptions.falseString;
                                                    const val = this.axis.defaultLabelFormatter.call(this);
                                                    const units = mUnitsText;
                                                    if (isDigital) {
                                                        if (val === '1') {
                                                            return trueString;
                                                        } else if (val === '0') {
                                                            return falseString;
                                                        } else {
                                                            return '';
                                                        }
                                                    } else {
                                                        return `${val}${units}`;
                                                    }
                                                },
                                                style: {
                                                    color: Highcharts.getOptions().colors[idx]
                                                }
                                            },
                                            title: {
                                                text: name,
                                                style: {
                                                    color: Highcharts.getOptions().colors[idx]
                                                }
                                            },
                                            opposite: yAxisOppositeSide,
                                        },
                                    );

                                    yAxisOppositeSide = !yAxisOppositeSide;
                                }

                                tmpData.datasets.push({
                                    name: name,
                                    type: chartType,
                                    yAxis: yAxisIndex,
                                    data: logs,
                                    tooltip: {
                                        valueSuffix: `${mUnitsText}`
                                    }
                                });
                            }

                            tmpData.labels = labels;

                            this.loading = false;
                        }
                    );

                    this.addThresholds(res, tmpData);

                    if (!this.yAxisInitialized) {
                        tmpData.yAxis.forEach(yAxis => {
                            this.chart.addAxis(yAxis);
                        });
                        this.yAxisInitialized = true;
                    }

                    tmpData.datasets.forEach(series => {
                        this.chart.addSeries(series);
                    });
                }
            }
        );
    }

    addThresholds(data, dataset) {
        const alarmLowLogs = [];
        const alarmHighLogs = [];
        const warningLowLogs = [];
        const warningHighLogs = [];

        // if there's one asset measure, we will add thresholds to the chart
        const selectedItem = { ID: this.itemId, type: this.itemType };
        let isDigital = false;
        if (selectedItem && data.length === 1) {
            if (data[0].length > 0) {
                const am = this._topology.assetMeasureCache[data[0][0].AssetMeasureID];
                isDigital = am.MeasureID === 3;
            }

            if (!isDigital && data[0] && data[0].length > 0) {
                data[0].forEach((assetMeasureLog) => {
                    const aml = <AssetMeasureLog>assetMeasureLog;
                    alarmLowLogs.push([moment.utc(aml.Timestamp).valueOf(), aml.AlarmLow]);
                    alarmHighLogs.push([moment.utc(aml.Timestamp).valueOf(), aml.AlarmHigh]);
                    warningLowLogs.push([moment.utc(aml.Timestamp).valueOf(), aml.WarningLow]);
                    warningHighLogs.push([moment.utc(aml.Timestamp).valueOf(), aml.WarningHigh]);
                });
            }
        }

        if (!isDigital && selectedItem && data.length === 1) {
            if (data[0] && data[0].length > 0) {
                const measureUnitText = data[0].length ?
                    this._common.getMeasureUnitText(data[0][0].MeasureUnitID) : '';
                dataset.datasets.push(
                    this.createThresholdSeries(alarmLowLogs, '#F25A46', 'COMMON.ALARM_LOW_THRESHOLD', measureUnitText),
                    this.createThresholdSeries(alarmHighLogs, '#F25A46', 'COMMON.ALARM_HIGH_THRESHOLD', measureUnitText),
                    this.createThresholdSeries(warningLowLogs, '#F79320', 'COMMON.WARNING_LOW_THRESHOLD', measureUnitText),
                    this.createThresholdSeries(warningHighLogs, '#F79320', 'COMMON.WARNING_HIGH_THRESHOLD', measureUnitText)
                );
            }
        }
    }

    createThresholdSeries(data, color, label, measureUnitText) {
        return {
            type: 'line',
            yAxis: `yAxis0`,
            data: data,
            name: this._translate.instant(label),
            dashStyle: 'longdash',
            color,
            tooltip: {
                valueSuffix: `${measureUnitText}`
            },
        };
    }

    onCustomTimeChange() {
        if (this.rangeDates.length === 2 &&
            this.rangeDates[0] !== null &&
            this.rangeDates[1] !== null) {
            this.from = moment(this.rangeDates[0])._d;
            this.to = moment(this.rangeDates[1])._d;
            if (this.areDatesValid()) {
                this.getData();
            }
        }
    }

    onTimeChange() {
        this.errorMessage = [];
        if (this.selectedXType > 0) {
            // clear range for custom time
            this.rangeDates = [null, null];

            this._logger.info(`User change time in asset measure chart to last ${this.selectedXType} days`);
            this.to = moment()._d;
            this.from = moment(this.to).subtract(this.selectedXType, 'days')._d;
            if (this.areDatesValid()) {
                this.getData();
            }
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
        } else if (moment(this.to).diff(moment(this.from), 'days') > this.maxSearchFilterDays) {
            isValid = false;
            this.errorMessage.push(
                {
                    severity: 'info',
                    summary: this._translate.instant('WIDGETS.ASSET_MEASURES_CHART.TIME_ERROR'),
                    detail: this._translate.instant('WIDGETS.ASSET_MEASURES_CHART.TIME_IS_TOO_LONG',
                        { days: this.maxSearchFilterDays })
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
}
