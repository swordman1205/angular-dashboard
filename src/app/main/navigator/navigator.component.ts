import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemTypes } from '../../shared/data/constants/itemType';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../shared/services/common.service';
import { TopologyService } from '../../shared/services/topology.service';
import { BaseWidgetComponent } from '../../widgets/base-widget/base-widget.component';
import { IItem } from '../../shared/interfaces/item';
import { Location } from '../../shared/types/location';
import { Events } from '../../shared/data/constants/events';
import { AuthService } from '../../shared/services/auth.service';
import {LogService} from '../../shared/services/log.service';

@Component({
    selector: 'app-navigator',
    templateUrl: './navigator.component.html',
    styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent extends BaseWidgetComponent implements OnInit, OnDestroy {  // extends SelectedItemComponent

    name = 'NavigatorComponent';
    data: any[];
    subscriber$;
    isHierarchicalNavigator = false;
    treeSelected: IItem;

    constructor(private _translate: TranslateService,
                private _common: CommonService,
                private _topology: TopologyService,
                _auth: AuthService,
                _log: LogService) {
        super(_auth, _log);
    }

    ngOnInit() {
        this.subscriber$ = this._topology.message$.subscribe(
            (res) => {
                if (res === Events.TOPOLOGY_IS_FILTER_BY_TAGS) {
                    this.getData();
                } else if (res === Events.NAVIGATOR_VIEW_CHANGE) {
                    this.isHierarchicalNavigator = this._topology.isHierarchicalNavigator;
                }
            });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        if (this.subscriber$) {
            this.subscriber$.unsubscribe();
        }
    }

    getData() {
        if (this.itemType && this.itemId) {
            this.treeSelected = {id: this.itemId, type: this.itemType};
            this.buildModel(this._topology.getItemChildren(this.itemType, this.itemId));
        }
    }

    getItemIcon = itemType => {
        switch (itemType) {
            case ItemTypes.TAGS:
                return 'tags';
                break;
            case ItemTypes.LOCATION_TAG:
            case ItemTypes.ASSET_TAG:
                return 'tag';
                break;
            case ItemTypes.LOCATION:
                return 'home';
                break;
            case ItemTypes.ASSET:
                return 'plug';
                break;
            case ItemTypes.ASSET_MEASURE:
                return 'tachometer-alt';
                break;
        }
    }

    buildModel(children) {
        this.data = [];

        // Back button
        const parentItem = this._topology.getItemParent(this.itemType, this.itemId);
        if (parentItem && !isNaN(parentItem.id)) {
            this.data.push({
                label: `${this._translate.instant('COMMON.BACK')} (${parentItem.name})`,
                type: parentItem.type,
                id: parentItem.id,
                icon: this.getItemIcon(parentItem.type),
                routerLink: this.createStaticRouterLink(parentItem.type, parentItem.id),
                statusIcon: this._common.getStatusViewIcon(parentItem.StatusView)
            });
        }

        // "Regular" Items
        children.forEach(item => {
            this.data.push({
                label: item.name,
                type: item.type,
                id: item.id,
                icon: item.type === ItemTypes.LOCATION ?
                    'home' : item.type === ItemTypes.ASSET ?
                        'plug' : item.type === ItemTypes.LOCATION_TAG ?
                            'tag' : item.type === ItemTypes.ASSET_TAG ?
                                'tag' : 'tachometer-alt',
                data: item,
                routerLink: this.createStaticRouterLink(item.type, item.id),
                statusIcon: this._common.getStatusViewIcon(item.StatusView)
            });
        });
    }

    buildRoots() {
        this.data = [];

        // Back button
        const roots: Location[] = this._topology.getRoots();
        if (roots) {
            roots.forEach((location: Location) => {
                this.data.push({
                    label: `${this._translate.instant('COMMON.BACK')} (${location.name})`,
                    type: location.type,
                    id: location.id,
                    icon: location.type === ItemTypes.LOCATION ? 'home' : 'plug',
                    routerLink: this.createStaticRouterLink(location.type, location.id),
                    statusIcon: this._common.getStatusViewIcon(location.StatusView)
                });

                if (location.Children) {
                    location.Children.forEach((child: Location) => {
                        this.data.push({
                            label: child.name,
                            type: child.type,
                            id: child.id,
                            icon: child.type === ItemTypes.LOCATION ?
                                'home' : child.type === ItemTypes.ASSET ?
                                    'plug' : child.type === ItemTypes.LOCATION_TAG ?
                                        'tag' : child.type === ItemTypes.ASSET_TAG ?
                                            'tag' : 'tachometer-alt',
                            routerLink: this.createStaticRouterLink(child.type, child.id),
                            statusIcon: this._common.getStatusViewIcon(child.StatusView)
                        });
                    });
                }
            });
        }
    }
}
