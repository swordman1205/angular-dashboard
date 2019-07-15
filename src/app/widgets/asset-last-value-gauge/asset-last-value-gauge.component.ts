import { AfterViewInit, Component, Input } from '@angular/core';
import { TopologyService } from '../../shared/services/topology.service';
import { AssetMeasureLastStatus } from '../../shared/types/assetMeasureLastStatus';

@Component({
    selector: 'app-asset-last-value-gauge',
    templateUrl: './asset-last-value-gauge.component.html',
    styleUrls: ['./asset-last-value-gauge.component.scss']
})
export class AssetLastValueGaugeComponent implements AfterViewInit {

    @Input() data: AssetMeasureLastStatus;
    analogMeasures: Array<number> = [1, 2, 6, 7, 12];  // 1=TEMPERATURE, 2=FAN_SPEED, 6=CURRENT, 7=HUMIDITY, 12=VOLTAGE
    digitalMeasures: Array<number> = [3];  // 3=DIGITAL
    breadCrumbs: string[] = [];

    constructor(private _topology: TopologyService) { }

    ngAfterViewInit() {
        // this.buildBreadCrumbs(this.data[0]);
    }

    buildBreadCrumbs(item: any) {
        const parentId = this._topology.locationCache[item.LocationID].ParentID;
        const parent = this._topology.locationCache[parentId];

        this.breadCrumbs.unshift(item.LocationName);

        if (parent) {
            this.buildBreadCrumbs(parent);
        }
    }

}
