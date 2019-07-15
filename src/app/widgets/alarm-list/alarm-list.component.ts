import { Component } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { DataService } from '../../shared/services/data.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/forkJoin';
import { CommonService } from '../../shared/services/common.service';
import { ItemTypes } from '../../shared/data/constants/itemType';
import { TopologyService } from '../../shared/services/topology.service';
import { EcsDatetimePipe } from '../../shared/pipes/ecs-datetime.pipe';
import { EcsDurationPipe } from '../../shared/pipes/ecs-duration.pipe';
import { EcsLastValuePipe } from '../../shared/ecs-last-value.pipe';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash';
import { AuthService } from '../../shared/services/auth.service';
import { LogService } from '../../shared/services/log.service';

@Component({
    selector: 'app-alarm-list',
    templateUrl: './alarm-list.component.html',
    styleUrls: ['./alarm-list.component.scss']
})
export class AlarmListComponent extends BaseWidgetComponent {

    getDataSubscrp: Subscription;
    data = [];
    itemTypes = ItemTypes;
    alarmLength = { rows: 0 };

    constructor(private _data: DataService,
        private _common: CommonService,
        private _topology: TopologyService,
        _auth: AuthService,
        _logger: LogService) {
        super(_auth, _logger);
    }

    getData() {
        this.loading = true;
        super.getData();
        const obs$ = [];
        if (this.itemType === ItemTypes.TAGS) {
            if (this.locationIds.length > 0 && this.assetIds.length === 0) {
                obs$.push(this._data.getTaggedLocationAlarms(this.locationIds, false));
                obs$.push(this._data.getTaggedLocationRoutersAlarms(this.locationIds, false));
            } else if (this.locationIds.length === 0 && this.assetIds.length > 0) {
                obs$.push(this._data.getTaggedAssetAlarms(this.assetIds, false));
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
                obs$.push(this._data.getTaggedAssetAlarms(assetIds, false));
            } else {
                console.warn('No selected ids found in tags');
            }
        } else {
            obs$.push(this._data.getLocationAlarms(this.itemId, false));
            obs$.push(this._data.getLocationRoutersAlarms(this.itemId, false));
        }

        this.getDataSubscrp = forkJoin(obs$)
            .subscribe(res => {
                this.data = [...<[any]>res[0] || [], ...<[any]>res[1] || []];
                this.alarmLength = { rows: this.data.length };
                this.data.forEach(item => {
                    item.statusViewParsed = this._common.getStatusViewName(item.StatusView, item.StatusType);
                    item.StatusTimestampParsed = EcsDatetimePipe.prototype.transform(item.StatusTimestamp);
                    item.LastUpdateParsed = EcsDatetimePipe.prototype.transform(item.LastUpdate);
                    item.LastValueParsed = EcsLastValuePipe.prototype.transform(item.LastValue);
                    item.StatusTimestampDurationParsed = EcsDurationPipe.prototype.transform(item.StatusTimestamp);

                    if (item.StatusType === 2) {
                        item.AssetMeasureName += ' (' + item.TemplateName + ')';
                    }
                });
                this.loading = false;
            }, err => {
                this.data = [];
            });
    }

}
