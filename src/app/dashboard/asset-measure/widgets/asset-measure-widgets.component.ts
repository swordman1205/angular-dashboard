import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ItemTypes } from '../../../shared/data/constants/itemType';
import {Subscription} from 'rxjs';
import {RouteService} from '../../../shared/services/route.service';
import {IEcsPath} from '../../../shared/interfaces/ecsPath';

@Component({
    selector: 'app-asset-measure-widgets',
    templateUrl: './asset-measure-widgets.component.html',
    styleUrls: ['./asset-measure-widgets.component.scss']
})
export class AssetMeasureWidgetsComponent implements OnInit, OnDestroy {

    @Input() itemId;
    name = 'AssetMeasureWidgetsComponent';
    itemType = ItemTypes.ASSET_MEASURE;
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
