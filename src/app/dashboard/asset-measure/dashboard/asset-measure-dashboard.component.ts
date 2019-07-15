import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ItemTypes} from '../../../shared/data/constants/itemType';
import {Subscription} from 'rxjs';
import {IEcsPath} from '../../../shared/interfaces/ecsPath';
import {RouteService} from '../../../shared/services/route.service';

@Component({
  selector: 'app-asset-measure-dashboard',
  templateUrl: './asset-measure-dashboard.component.html',
  styleUrls: ['./asset-measure-dashboard.component.scss']
})
export class AssetMeasureDashboardComponent implements OnInit, OnDestroy {

    @Input() itemId;
    itemType = ItemTypes.ASSET_MEASURE;
    name = 'AssetMeasureDashboardComponent';
    private routeSubscription$: Subscription;

    constructor(private _routeService: RouteService) {
    }

    ngOnInit() {
        this.routeSubscription$ = this._routeService.getRoutingSubscription()
            .subscribe((path: IEcsPath) => {
                this.itemId = path.itemID;
            });
    }

    ngOnDestroy() {
        if (this.routeSubscription$) {
            this.routeSubscription$.unsubscribe();
        }
    }

}
