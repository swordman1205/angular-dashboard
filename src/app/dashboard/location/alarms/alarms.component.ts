import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouteService} from '../../../shared/services/route.service';
import {IEcsPath} from '../../../shared/interfaces/ecsPath';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.scss']
})
export class AlarmsComponent implements OnInit, OnDestroy {

    itemId;
    itemType;
    name = 'AlarmsDashboardComponent';
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
