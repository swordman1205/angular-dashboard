import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ItemTypes } from '../../shared/data/constants/itemType';
import { Events } from '../../shared/data/constants/events';
import { AuthService } from '../../shared/services/auth.service';
import { LogService } from '../../shared/services/log.service';

@Component({
    selector: 'app-base-widget',
    templateUrl: './base-widget.component.html',
    styleUrls: ['./base-widget.component.scss']
})
export class BaseWidgetComponent implements OnDestroy, OnChanges {

    @Input() mode;
    @Input() itemType;
    @Input() itemId;
    @Input() locationIds;
    @Input() assetIds;
    @Input() adminMode;

    getDataSubscrp: Subscription;
    routeSubscription$: Subscription;
    loading = false;
    _auth: AuthService;
    _logger: LogService;




    
    constructor(_auth: AuthService, _logger: LogService) {
        this._auth = _auth;
        this._logger = _logger;
        // In case of refresh, widget should get data after all services were initialized
        _auth.message$.subscribe(msg => {
            if (msg === Events.ALL_SERVICES_INITIALIZED) {
                this.getData();
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        this.getData();
    }

    ngOnDestroy() {
        if (this.getDataSubscrp) {
            this.getDataSubscrp.unsubscribe();
        }

        if (this.routeSubscription$) {
            this.routeSubscription$.unsubscribe();
        }
    }

    getData() {
        if (this.getDataSubscrp) {
            this.getDataSubscrp.unsubscribe();
        }
    }

    createStaticRouterLink(itemType, itemId) {
        let routeLink;
        if (itemType === ItemTypes.TAGS) {
            routeLink = [`/${ItemTypes.TAGS}/0/tagsDashboard`];
        } else {
            routeLink = [`/${this.mode}/${itemType}/${itemId}`];
        }

        return routeLink;
    }
}
