import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IEcsPath} from '../../../shared/interfaces/ecsPath';
import {Subscription} from 'rxjs';
import {RouteService} from '../../../shared/services/route.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {

  itemId;
  itemType;
  name = 'DocumentsForAssetComponent';
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
