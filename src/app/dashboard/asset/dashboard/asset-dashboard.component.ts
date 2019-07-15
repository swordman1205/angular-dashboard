import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ItemTypes} from '../../../shared/data/constants/itemType';
import {Subscription} from 'rxjs';
import {IEcsPath} from '../../../shared/interfaces/ecsPath';
import {RouteService} from '../../../shared/services/route.service';

@Component({
  selector: 'app-asset-dashboard',
  templateUrl: './asset-dashboard.component.html',
  styleUrls: ['./asset-dashboard.component.scss']
})
export class AssetDashboardComponent implements OnInit, OnDestroy {

    @Input() itemId;
    itemType = ItemTypes.ASSET;
    name = 'AssetDashboardComponent';
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
