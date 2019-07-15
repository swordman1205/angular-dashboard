import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { TopologyService } from '../../shared/services/topology.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseWidgetComponent } from '../../widgets/base-widget/base-widget.component';
import { ItemTypes } from '../../shared/data/constants/itemType';
import { IItem } from '../../shared/interfaces/item';
import { LogService } from '../../shared/services/log.service';
import {AuthService} from '../../shared/services/auth.service';




@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent extends BaseWidgetComponent implements OnInit, OnDestroy {

    @Output() breadcrumsItemClick = new EventEmitter<any>();
    name = 'BreadcrumbsComponent';
    items: any[];
    private sub: any;
    _log: LogService;

    constructor(private _translate: TranslateService,
                private _topology: TopologyService,
                _log: LogService,
                _auth: AuthService) {
        super(_auth, _log);
        this._log = _log;
    }



    ngOnInit() {
        this._log.info('BreadcrumbsComponent - OnInit');
    }

    ngOnDestroy() {
        this._log.info('BreadcrumbsComponent - OnDestroy');
    }

    getData() {
        super.getData();
        if (this.itemType && this.itemId) {
            this.items = [];
            this.buildBreadcrumbs(this.itemType, this.itemId);
        }
    }

    buildBreadcrumbs(itemType, itemId) {
        const item: IItem = this._topology.getItem({ type: itemType, id: itemId });
        let label = item ? (item.Name || item.name) : 'N\\A';
        let icon;

        // IItem icon
        switch (itemType) {
            case ItemTypes.TAGS:
                label = this._translate.instant('WIDGETS.BREADCRUMBS.TAGS');
                icon = 'fas fa-tags';
                break;
            case ItemTypes.ASSET_TAG:
            case ItemTypes.LOCATION_TAG:
                icon = 'fas fa-tag';
                break;
            case ItemTypes.LOCATION:
                icon = 'fas fa-home';
                break;
            case ItemTypes.ASSET:
                icon = 'fas fa-plug';
                break;
            case ItemTypes.ASSET_MEASURE:
                icon = 'fas fa-tachometer';
                break;
        }

        const routerLink = item ? this.createStaticRouterLink(item.type, item.id) : undefined;

        this.items.unshift({
            label: label,
            type: itemType,
            id: itemId,
            icon: icon,
            command: (event: any) => {
                this.breadcrumsItemClick.emit({ type: event.item.type, id: event.item.id });
            },
            routerLink: routerLink,
        });

        const parent = this._topology.getItemParent(itemType, itemId);
        if (parent && !isNaN(parent.id)) {
            this.buildBreadcrumbs(parent.type, parent.id);
        }
    }
}
