import { Component, enableProdMode, OnDestroy, OnInit } from '@angular/core';
import { slideInDownAnimation } from '../animation/route-animation';
import 'rxjs/add/operator/map';
import { MessageService } from 'primeng/api';
import { TopologyService } from '../shared/services/topology.service';
import { DataService } from '../shared/services/data.service';
import { LogService } from '../shared/services/log.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../shared/services/common.service';
import { Subscription } from 'rxjs';
import { RouteService } from '../shared/services/route.service';
import { IEcsPath } from '../shared/interfaces/ecsPath';






// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }


@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.scss'],
    animations: [slideInDownAnimation]
})
export class MapsComponent implements OnInit, OnDestroy {
    private _routeSubscription$: Subscription;
    private _getDataSubscrp: Subscription;

    itemType: string;
    itemId: number;
    locationID: number;

    loading: boolean;

    // keys = {};

    markers: Marker[] = [{
        location: '40.7825, -73.966111'
    }, {
        location: [40.755833, -73.986389]
    }, {
        location: {
            lat: 40.753889,
            lng: -73.981389
        }
    }, {
        location: 'Brooklyn Bridge,New York,NY'
    }];

    routes: Route[] = [{
        weight: 6,
        color: 'blue',
        opacity: 0.5,
        mode: '',
        locations: [
            [40.782500, -73.966111],
            [40.755833, -73.986389],
            [40.753889, -73.981389],
            'Brooklyn Bridge,New York,NY'
        ]

    }];











    // CTor
    // -------------------------------
    constructor(private router: RouteService,
        private topology: TopologyService,
        private common: CommonService,
        private data: DataService,
        private logger: LogService,
        private translate: TranslateService,
        private msgService: MessageService) {

    }







    // LifeCycle Hooks
    // -------------------------------
    ngOnInit(): void {

        this._routeSubscription$ = this.router.getRoutingSubscription()
            .subscribe((path: IEcsPath) => {
                this.itemType = path.itemType;
                this.itemId = path.itemID;

                if (this.itemType && this.itemId) {
                    const item = this.topology.getItemLocation(this.itemType, this.itemId);
                    if (this.locationID !== item.ID) {
                        this.locationID = item.ID;

                        this.getData();
                    }
                }
            });
    }

    ngOnDestroy(): void {
        if (this._routeSubscription$) {
            this._routeSubscription$.unsubscribe();
        }
    }





    setMode(e) {
        this.routes = this.routes.map(function (item) {
            item.mode = e.value;
            return item;
        });
    }

    selectColor(e) {
        this.routes = this.routes.map(function (item) {
            item.color = e.value;
            return item;
        });
    }


    // Properties
    // -------------------------------










    // Data Manipulation
    // -------------------------------
    getData() {
        this.loading = true;
        this.logger.info(`Getting data for widget locations config devices - LocationId: ${this.locationID}`);
        // super.getData();


        this._getDataSubscrp = this.data.getLocationReports(this.locationID)
            .subscribe(
                res => {

                    // this.Config.unDirtifyTab();
                    // this.isDirty = false;
                    this.loading = false;
                },
                err => {
                    this.logger.error(`error in config location devices ${err}`);
                    this.loading = false;
                    this._getDataSubscrp.unsubscribe();
                },
                () => {
                    this._getDataSubscrp.unsubscribe();
                });

    }









    // Event Handlers
    // -----------------------------

}



export class Marker {
    location: any;
}

export class Route {
    weight: number;
    color: string;
    opacity: number;
    mode: string;
    locations: any[];
}
