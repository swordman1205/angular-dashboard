import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {RouteService} from '../../../shared/services/route.service';
import {IEcsPath} from '../../../shared/interfaces/ecsPath';
import {TopologyService} from '../../../shared/services/topology.service';
import {ItemTypes} from '../../../shared/data/constants/itemType';
import * as _ from 'lodash';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit, OnDestroy {

  locationIds = [];
  assetIds = [];
  itemId;
  itemType;
  name = 'TagTicketsComponent';
  private subscriber$: Subscription;
  private routeSubscription$: Subscription;

  constructor(private _routeService: RouteService, private _topologyService: TopologyService) {
  }

  ngOnInit() {
    this.routeSubscription$ = this._routeService.getRoutingSubscription()
        .subscribe((path: IEcsPath) => {
          this.itemId = path.itemID;
          this.itemType = path.itemType;
        });

    this.subscriber$ = this._topologyService.message$.subscribe(res => {
      if (res === `TOPOLOGY_IS_FILTER_BY_TAGS`) {
        let locationIds = [];
        let assetIds = [];

        this._topologyService.selectedTags.forEach(tag => {
          if (tag.type === ItemTypes.LOCATION_TAG) {
            locationIds = [...tag.ids];
          } else if (tag.type === ItemTypes.ASSET_TAG) {
            assetIds = [...tag.ids];
          }
        });
        this.locationIds = _.uniq(locationIds);
        this.assetIds = _.uniq(assetIds);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription$) {
      this.routeSubscription$.unsubscribe();
    }
    if (this.subscriber$) {
      this.subscriber$.unsubscribe();
    }
  }

}
