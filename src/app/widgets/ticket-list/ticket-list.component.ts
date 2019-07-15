import { Component } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { DataService } from '../../shared/services/data.service';
import { ItemTypes } from '../../shared/data/constants/itemType';
import { TopologyService } from '../../shared/services/topology.service';
import { EcsDatetimePipe } from '../../shared/pipes/ecs-datetime.pipe';
import { EcsAckPipe } from '../../shared/pipes/ecs-ack.pipe';
import * as _ from 'lodash';
import {AuthService} from '../../shared/services/auth.service';
import {LogService} from '../../shared/services/log.service';

declare var moment: any;

@Component({
    selector: 'app-ticket-list',
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent extends BaseWidgetComponent {

    data;
    req$;
    itemTypes = ItemTypes;
    openTickets = true;
    from;
    to;
    ticketsLength: { rows: 0 };

    constructor(private _data: DataService,
                private _topology: TopologyService,
                _auth: AuthService,
                _logger: LogService) {
        super(_auth, _logger);
        this.to = moment()._d;
        this.from = moment(this.to).subtract(30, 'days')._d;
    }

    onOpenTicketChange(e) {
        this.openTickets = e.checked;
        if (this.openTickets) {
            this.getData();
        }
    }

    getData() {
        super.getData();
        this.loading = true;

        if (this.itemType === ItemTypes.TAGS) {
            if (this.locationIds.length > 0 && this.assetIds.length === 0) {
                this.req$ = this._data.getTaggedLocationTickets(this.locationIds, this.openTickets, this.from, this.to);
            } else if (this.locationIds.length === 0 && this.assetIds.length > 0) {
                this.req$ = this._data.getTaggedAssetTickets(this.assetIds, this.openTickets, this.from, this.to);
            } else if (this.locationIds.length > 0 && this.assetIds.length > 0) {
                let assetIds = [];
                this.locationIds.forEach(locationId => {
                    const assets = this._topology.getCachedLocation(locationId).Assets;
                    assets.forEach(asset => {
                        assetIds.push(asset.ID);
                    });
                });
                assetIds = _.uniq(assetIds);
                assetIds = assetIds.filter(id => {
                    return this._topology.whiteListAssetsForTags.has(id);
                });
                this.req$ = this._data.getTaggedAssetTickets(this.assetIds, this.openTickets, this.from, this.to);
            } else {
                console.warn('No selected ids found in tags');
            }
        } else {
            this.req$ = this._data.getLocationTickets(this.itemId, this.openTickets, this.from, this.to);
        }

        this.getDataSubscrp = this.req$.subscribe(res => {
            this.ticketsLength = { rows: res.length };
            res.forEach(item => {
                item.AlertTimeParsed = EcsDatetimePipe.prototype.transform(item.AlertTime);
                item.CreatedOnParsed = EcsDatetimePipe.prototype.transform(item.CreatedOn);
                item.ClosedOnParsed = EcsDatetimePipe.prototype.transform(item.ClosedOn);
                item.AcknowledgedParsed = EcsAckPipe.prototype.transform(item.Acknowledged);
            });
            this.data = res;
            this.loading = false;
        }, err => {
            this._logger.error(`Error in TicketList component: ${err}`);
            this.data = [];
        });
    }

    onTimeChange() {
        // TODO: Handle time validations
        /* this.errorMessage = [];
        if (this.selectedXType > 0) {
            this._logger.info(`User change time in asset measure chart to last ${this.selectedXType} days`);
            this.to = moment()._d;
            this.from = moment(this.to).subtract(this.selectedXType, 'days')._d;
        } else {
            this.to = moment(this.to)._d;
            this.from = moment(this.from)._d;
            this._logger.info(`User change time in asset measure chart to custom days: from: ${this.from}, to: ${this.to}`);
        }
        if (this.areDatesValid()) {*/
        this.getData();
        // }
    }
}
