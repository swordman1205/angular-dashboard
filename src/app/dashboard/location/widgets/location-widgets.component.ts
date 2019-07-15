import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ItemTypes} from '../../../shared/data/constants/itemType';
import {Subscription} from 'rxjs';
import {RouteService} from '../../../shared/services/route.service';
import {IEcsPath} from '../../../shared/interfaces/ecsPath';

@Component({
    selector: 'app-location-widgets',
    templateUrl: './location-widgets.component.html',
    styleUrls: ['./location-widgets.component.scss']
})
export class LocationWidgetsComponent implements OnInit, OnDestroy {

    @Input() itemId;
    itemType = ItemTypes.LOCATION;
    name = 'LocationDashboardComponent';
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
