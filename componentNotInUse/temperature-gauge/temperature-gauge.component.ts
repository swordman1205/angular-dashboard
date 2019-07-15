import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { AssetMeasureLastValue } from '../../shared/types/assetMeasureLastValue';
import { CommonService } from '../../shared/services/common.service';
import { defaults } from '../../shared/data/defaults';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts/highcharts';
declare var moment: any;
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);

// https://www.usefuldev.com/blog/post/using-highcharts-in-an-angular-cli-project
// http://jsfiddle.net/gh/get/jquery/2/highcharts/highcharts/tree/master/samples/highcharts/demo/gauge-solid/

@Component({
    selector: 'app-temperature-gauge',
    templateUrl: './temperature-gauge.component.html',
    styleUrls: ['./temperature-gauge.component.scss']
})
export class TemperatureGaugeComponent implements AfterViewInit, OnDestroy {
    @Input() data: AssetMeasureLastValue;
    @ViewChild('chartTarget') chartTarget: ElementRef;
    chart: Highcharts.ChartObject;
    timestamp;
    value;
    status;

    constructor(private _commonDataService: CommonService) {
    }

    ngAfterViewInit() {
        const margins = 0.1 * (this.data.AlarmHigh - this.data.AlarmLow);
        const minValue = this.data.AlarmLow - margins;
        const maxValue = this.data.AlarmHigh + margins;
        setTimeout(() => this.timestamp = moment(this.data.Timestamp).format('MM/DD/YYYY h:mm:ss a'), 0);

        // Units
        let units = (this.data.Value === defaults.NO_DATA || _.isNil(this._commonDataService.getMeasureUnit(this.data.MeasureUnitID)) ?
            '' : this._commonDataService.getMeasureUnit(this.data.MeasureUnitID).Name);
        if (units.toLowerCase() === 'f' || units.toLowerCase() === 'c') {
            units = `°${units}`;
        }

        this.value = this.data.Value === defaults.NO_DATA ? NaN : parseFloat(this.data.Value.toFixed(this.data.Precision));
        setTimeout(() => this.status = this._commonDataService.getStatusViewName(this.data.StatusView), 0);

        const options = {
            chart: {
                type: 'gauge',
                height: '100%'
            },
            title: {
                text: ''
            },
            pane: {
                startAngle: -90,
                endAngle: 90,
                background: []
            },
            yAxis: {
                min: minValue,
                max: maxValue,

                minorTickInterval: 'auto',
                minorTickLength: 10,
                minorTickPosition: 'inside',

                tickPixelInterval: 30,
                tickPosition: 'inside',
                tickLength: 10,
                labels: {
                    step: 2,
                    rotation: 'auto'
                },
                title: {
                    text: units
                },
                plotBands: [{
                    from: minValue,
                    to: (<AssetMeasureLastValue>this.data).AlarmLow,
                    className: 'red-band'
                }, {
                    from: (<AssetMeasureLastValue>this.data).AlarmLow,
                    to: (<AssetMeasureLastValue>this.data).WarningLow,
                    className: 'yellow-band'
                }, {
                    from: (<AssetMeasureLastValue>this.data).WarningLow,
                    to: (<AssetMeasureLastValue>this.data).WarningHigh,
                    className: 'green-band'
                }, {
                    from: (<AssetMeasureLastValue>this.data).WarningHigh,
                    to: (<AssetMeasureLastValue>this.data).AlarmHigh,
                    className: 'yellow-band'
                }, {
                    from: (<AssetMeasureLastValue>this.data).AlarmHigh,
                    to: maxValue,
                    className: 'red-band'
                }]
            },
            series: [{
                name: 'Value',
                data: [this.value],
                tooltip: {
                    valueSuffix: units
                }
            }]

        };
        this.chart = Highcharts.chart(this.chartTarget.nativeElement, options);
    }

    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}
