import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouteService} from '../../../shared/services/route.service';
import {Subscription} from 'rxjs';
import {TopologyService} from '../../../shared/services/topology.service';
import {ItemTypes} from '../../../shared/data/constants/itemType';
import * as _ from 'lodash';

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit, OnDestroy {

    locationIds = [];
    assetIds = [];
    name = 'TagsDashboardComponent';
    private subscriber$: Subscription;

    constructor(private _routeService: RouteService, private _topologyService: TopologyService) {
    }

    ngOnInit() {
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
        if (this.subscriber$) {
            this.subscriber$.unsubscribe();
        }
    }

}
