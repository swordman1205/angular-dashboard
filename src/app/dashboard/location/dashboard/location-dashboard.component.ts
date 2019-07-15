import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteService } from '../../../shared/services/route.service';
import { IEcsPath } from '../../../shared/interfaces/ecsPath';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-location-dashboard',
    templateUrl: './location-dashboard.component.html',
    styleUrls: ['./location-dashboard.component.scss']
})
export class LocationDashboardComponent implements OnInit, OnDestroy {

    name = 'LocationDashboardComponent';
    private itemId: number;
    private itemType: string;
    private routeSubscription$: Subscription;

    constructor(private _routeService: RouteService) {
    }

    ngOnInit() {
        this.routeSubscription$ = this._routeService.getRoutingSubscription()
            .subscribe((path: IEcsPath) => {
                this.itemId = path.itemID;
                this.itemType = path.itemType;
            });
    }

    ngOnDestroy() {
        if (this.routeSubscription$) {
            this.routeSubscription$.unsubscribe();
        }
    }
}
