import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ItemTypes } from '../../../shared/data/constants/itemType';
import {IEcsPath} from '../../../shared/interfaces/ecsPath';
import {Subscription} from 'rxjs';
import {RouteService} from '../../../shared/services/route.service';

@Component({
    selector: 'app-asset-widgets',
    templateUrl: './asset-widgets.component.html',
    styleUrls: ['./asset-widgets.component.scss']
})
export class AssetWidgetsComponent implements OnInit, OnDestroy {

    @Input() itemId;
    itemType = ItemTypes.ASSET;
    name = 'AssetWidgetsComponent';
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
