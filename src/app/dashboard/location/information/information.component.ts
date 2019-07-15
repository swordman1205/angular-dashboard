import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {RouteService} from '../../../shared/services/route.service';
import {IEcsPath} from '../../../shared/interfaces/ecsPath';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit, OnDestroy {

  itemId;
  itemType;
  name = 'InformationComponent';
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
