import { Subscription } from 'rxjs/Subscription';
import { TopologyService } from '../shared/services/topology.service';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { RouteService } from '../shared/services/route.service';
import { IEcsPath } from '../shared/interfaces/ecsPath';
import { slideInDownAnimation } from '../animation/route-animation';
import 'rxjs/add/operator/map';
import { TranslateService } from '@ngx-translate/core';
import { DxListComponent } from 'devextreme-angular';
import { DxDrawerComponent } from 'devextreme-angular';
import { Mode } from '../shared/data/constants/itemType';




@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
    animations: [slideInDownAnimation]
})
export class ConfigurationComponent implements OnInit, OnDestroy {

    @ViewChild('configTabs') _configTabs: DxListComponent;
    @Output() refresh = new EventEmitter<any>();
    @Output() save = new EventEmitter<any>();

    itemType: string;
    itemId: number;

    private routeSubscription$: Subscription;
    tabIndex = 0;
    private _tabKey: string;
    private _prevTabKey: string;
    selectedTab: string;

    tabs = [
        { id: 0, key: 'info', text: this._translate.instant('CONFIGS.INFO'), icon: 'fa fa-object-ungroup', isDirty: false, selected: true },
        { id: 1, key: 'devices', text: this._translate.instant('CONFIGS.DEVICES'), icon: 'fa fa-object-ungroup', isDirty: false, selected: false },
        { id: 2, key: 'items', text: this._translate.instant('CONFIGS.ITEMS'), icon: 'fa fa-list-alt', isDirty: false },
        { id: 3, key: 'forms', text: this._translate.instant('CONFIGS.FORMS'), icon: 'fab fa-wpforms', isDirty: false },
        { id: 4, key: 'alarmTypes', text: this._translate.instant('CONFIGS.ALARM_TYPES'), icon: 'fa fa-exclamation-triangle', isDirty: false },
        { id: 5, key: 'alertTypes', text: this._translate.instant('CONFIGS.ALERT_TYPES'), icon: 'fa fa-exclamation-circle', isDirty: false },
        { id: 6, key: 'alerts', text: this._translate.instant('CONFIGS.ALERTS'), icon: 'fa fa-bell', isDirty: false },
        { id: 7, key: 'assetTypes', text: this._translate.instant('CONFIGS.ASSET_TYPES'), icon: 'fa fa-plug', isDirty: false },
        { id: 8, key: 'asmTypes', text: this._translate.instant('CONFIGS.ASSETMEASURE_TYPES'), icon: 'far fa-tachometer-alt', isDirty: false },
        { id: 9, key: 'maintenance', text: this._translate.instant('CONFIGS.MAINTENANCE'), icon: 'fas fa-toolbox', isDirty: false },
        { id: 10, key: 'tickets', text: this._translate.instant('CONFIGS.TICKETS'), icon: 'fas fa-ticket-alt', isDirty: false },
        { id: 11, key: 'permissions', text: this._translate.instant('CONFIGS.PERMISSIONS'), icon: 'fa fa-thumbs-up', isDirty: false },
        { id: 12, key: 'intelliTasks', text: this._translate.instant('CONFIGS.INTELLITASKS'), icon: 'fa fa-tasks', isDirty: false }
    ];

     @ViewChild(DxDrawerComponent) drawer: DxDrawerComponent;
    // elementAttr: any;



    toolbarButtons = [{
        widget: 'dxButton',
        location: 'before',
        options: {
            icon: 'menu',
            onClick: () => this.drawer.instance.toggle()
        }
    },  {
        widget: 'dxButton',
        location: 'after',
        options: {
            icon: 'refresh',
            onClick: () => this.refreshHandler()
        }
    }, {
        widget: 'dxButton',
        location: 'after',
        options: {
            icon: 'save',
            onClick: () =>  this.saveHandler()
        }
    }];





    constructor(private _topolgySrvc: TopologyService,
        private _router: RouteService,
        private _translate: TranslateService) {
    }



    ngOnInit() {
        this.routeSubscription$ = this._router.getRoutingSubscription()
            .subscribe((path: IEcsPath) => {
                this.itemId = path.itemID;
                this.itemType = path.itemType;

                if (path.view && path.view !== this._tabKey) {
                    const indx = this.tabs.indexOf(this.tabs.find(view => view.key === path.view));
                    if (indx > - 1 && indx !== this.tabIndex) {
                        this.tabIndex = indx;
                    }
                }
            });

        this.onResize.bind(this);
        window.addEventListener('resize', this.onResize, false);
    }

    ngOnDestroy() {
        if (this.routeSubscription$) {
            this.routeSubscription$.unsubscribe();
        }

        window.removeEventListener('resize', this.onResize, false);
    }

    dirtifyTab() {
        const tab = this._configTabs.items[this.tabIndex];
        tab.isDirty = true;
    }


    unDirtifyTab() {
        const tab = this._configTabs.items[this.tabIndex];
        tab.isDirty = false;
    }


    unDirtifyAllTabs() {
        this._configTabs.items.forEach(tab => tab.isDirty = false);
    }

    setActiveTabIndx() {
        if (this.tabs[this.tabIndex].key === this._tabKey) {
            return;
        }

        this.tabIndex = this.tabs.findIndex((tab: any) => tab.key === this._tabKey);
    }

    restorePrevTab() {
        if (this.tabs[this.tabIndex].key === this._prevTabKey) {
            return;
        }

        this.tabIndex = this.tabs.findIndex((tab: any) => tab.key === this._prevTabKey);
    }

    onTabChanged(event: { itemIndex: number; }) {
        this.tabIndex = event.itemIndex;
        this.routeToSelectedTab(event.itemIndex);
    }

    refreshHandler() {
        this.refresh.emit();
    }


    saveHandler() {
        this.save.emit();
    }

    private routeToSelectedTab(tabIndex: number) {
        this._prevTabKey = this._tabKey;
        this._tabKey = this.tabs[tabIndex].key;
        this._router.navigateToPath({
            mode: Mode.CONFIG,
            itemType: this.itemType,
            itemID: this.itemId,
            view: this._tabKey
        });
    }

    onResize = event => {
        this.tabsWidth();
        this._configTabs.instance.repaint();
    }

    tabsWidth = () => {
        const width = document.getElementById('tabscontainer').offsetWidth;
        return (width - 32);
    }
}
