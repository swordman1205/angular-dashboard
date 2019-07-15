import { Component, Input, OnChanges } from '@angular/core';
import { defaults } from '../../shared/data/defaults';
import { CommonService } from '../../shared/services/common.service';
import { AssetMeasureLastValue } from '../../shared/types/assetMeasureLastValue';

declare var moment: any;

@Component({
    selector: 'app-digital-gauge',
    templateUrl: './digital-gauge.component.html',
    styleUrls: ['./digital-gauge.component.scss']
})
export class DigitalGaugeComponent implements OnChanges {

    @Input() data: AssetMeasureLastValue;
    defaults = defaults;
    status = '';
    statusTimestamp = '';

    constructor(private _commonDataService: CommonService) { }

    /*getStatusViewName(value: number): string  {
        return this._commonDataService.getStatusViewName(value);
    }

    getStatusTimeStamp() {
        return moment(this.data.StatusTimestamp).format('MM/DD/YYYY h:mm:ss a');
    }*/

    ngOnChanges() {
        this.status = this._commonDataService.getStatusViewName(this.data.StatusView);
        this.statusTimestamp = moment(this.data.StatusTimestamp).format('MM/DD/YYYY h:mm:ss a');
    }
}
