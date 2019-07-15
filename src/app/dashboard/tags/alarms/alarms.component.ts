import {Component, OnDestroy, OnInit} from '@angular/core';
import {IEcsPath} from '../../../shared/interfaces/ecsPath';
import {Subscription} from 'rxjs';
import {RouteService} from '../../../shared/services/route.service';
import {ItemTypes} from '../../../shared/data/constants/itemType';
import * as _ from 'lodash';
import {TopologyService} from '../../../shared/services/topology.service';

@Component({
    selector: 'app-alarms',
    templateUrl: './alarms.component.html',
    styleUrls: ['./alarms.component.scss']
})
export class AlarmsComponent implements OnInit, OnDestroy {

    locationIds = [];
    assetIds = [];
    itemId;
    itemType;
    name = 'TagAlarmsComponent';
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
