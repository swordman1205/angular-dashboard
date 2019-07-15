import { Injectable } from '@angular/core';
import { TopologyService } from './topology.service';
import { Router, UrlSegment, ActivationEnd, UrlSegmentGroup, NavigationEnd, GuardsCheckStart, GuardsCheckEnd } from '@angular/router';
import { DataService } from './data.service';
import { Events } from '../data/constants/events';
import { ItemTypes, Mode } from '../data/constants/itemType';
import { IItem } from '../interfaces/item';
import { LogService } from './log.service';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { IEcsPath } from '../interfaces/ecsPath';
import { ServiceHelper } from './serviceHelper';







@Injectable()
export class RouteService {

    private _itemType;
    private _itemId;
    private _configView = 'devices';
    private _dashView = 'widgets';

    // members that saved on the routing service (not needed to send in path)
    private _mode: string = Mode.LIVE_VIEW;
    private _lastLVPath: IEcsPath;

    private dataSub: Subscription;
    private topolgSub: Subscription;
    private routeMessages$: BehaviorSubject<IEcsPath>;





    constructor(private _topology: TopologyService,
        private _router: Router,
        private _data: DataService,
        private _logger: LogService) {

        this.dataSub = this._data.message$.subscribe(
            // Data Service Message Subscriber next Handler
            res => {
                if (res.eventName === Events.UNAUTHORIZED) {
                    this.navigateToLogin();
                }
            },
            // Data Servvice Message Subscriber error Handler
            err => this._logger.error(`err in route subscriber from data service: ${err}`)
        );


        this.topolgSub = this._topology.message$.subscribe(
            // Topology Servvice Message Subscriber next Handler
            msg => {
                switch (msg) {
                    case Events.TOPOLOGY_IS_NOT_FILTER_BY_TAGS:
                        this.navigateToRoot();
                        break;
                    case Events.TOPOLOGY_IS_FILTER_BY_TAGS:
                        this.navigateToRootTags();
                        break;
                }
            },
            // Topology Servvice Message Subscriber error Handler
            err => this._logger.error(`err in route subscriber from topology service: ${err}`)
        );

        this.routeMessages$ = new BehaviorSubject<IEcsPath>({
            mode: this._mode,
            itemID: this._itemId,
            itemType: this._itemType,
            view: this._dashView
        });

        this._router.events.subscribe(
            event => {
                if (event instanceof NavigationEnd) {
                    const endNav = event;
                }

                if (event instanceof GuardsCheckEnd) {
                    const endNav = event;
                    if (event.url !== event.urlAfterRedirects) {
                        event.shouldActivate = false;
                    }
                }

                if (event instanceof ActivationEnd) {
                    if (event.snapshot.params && !ServiceHelper.isEmpty(event.snapshot.params)) {
                        let flg = false;
                        let view: string;

                        // First, Get the routing parameters (Before the splitting)
                        // --------------------------------------------------------------
                        const params = event.snapshot.params;
                        if (this._itemId !== params['itemId'] ||
                            this._itemType !== params['itemType']) {
                            this._itemId = params['itemId'];
                            this._itemType = params['itemType'];
                            flg = true;
                        }

                        // Second, Get the routing path segments for each parallel route (and Routing outlet)
                        // --------------------------------------------------------------------------------------
                        const urlSegmntGroup: UrlSegmentGroup = event.snapshot['_urlSegment'];
                        if (urlSegmntGroup && urlSegmntGroup.children && urlSegmntGroup.numberOfChildren > 0) {
                            if (urlSegmntGroup.children['live-view'] && urlSegmntGroup.children['live-view'].segments) {
                                const segmnts = urlSegmntGroup.children['live-view'].segments;

                                // First Segment: Make sure the First Segment (According to Routing Model: Outlet name) is not null === setting the Mode
                                if (segmnts[0] && !ServiceHelper.isEmpty(segmnts[0])) {
                                    if (segmnts[0].path !== this._mode) {
                                        this._mode = Mode.LIVE_VIEW;
                                        flg = true;
                                    }
                                }

                                // Second Segment: The Outlet main Container == has NO meaning in routing (in Routing config it's empty path)

                                // Third Segment: It's the first Child/Tab within the Routed Component
                                if (segmnts[2] && !ServiceHelper.isEmpty(segmnts[2])) {
                                    if (this._dashView !== segmnts[2].path) {
                                        this._dashView = segmnts[2].path;
                                        flg = true;
                                    }

                                    if (this._dashView) {
                                        view = this._dashView;
                                    }
                                }
                            }

                            if (urlSegmntGroup.children['config'] && urlSegmntGroup.children['config'].segments) {
                                const segmnts = urlSegmntGroup.children['config'].segments;

                                 // First Segment: Make sure the First Segment (According to Routing Model: Outlet name) is not null === setting the Mode
                                 if (segmnts[0] && !ServiceHelper.isEmpty(segmnts[0])) {
                                    if (segmnts[0].path !== this._mode) {
                                        this._mode = Mode.CONFIG;
                                        flg = true;
                                    }
                                }

                                // Second Segment: It's the first Child/Tab within the Routed Component
                                if (segmnts[1] && !ServiceHelper.isEmpty(segmnts[1])) {
                                    if (this._configView !== segmnts[1].path) {
                                        this._configView = segmnts[1].path;
                                        flg = true;
                                    }

                                    if (!view && this._configView) {
                                        view = this._configView;
                                    }
                                }
                            }
                        } else if (flg) {
                            this.navigateToRoute();
                        }

                        if (flg) {
                            const path: IEcsPath = {
                                mode: this._mode,
                                itemID: this._itemId,
                                itemType: this._itemType,
                                view: (view ? view : (this._mode === Mode.LIVE_VIEW ? this._dashView : this._configView))
                            };

                            this._logger.info('Navigation parameters: Mode: ' +
                            path.mode + ', ItemType: ' +
                            path.itemType + ', ItemID: ' +
                            path.itemID + ', View: ' +
                            path.view);

                            if (this._mode === Mode.LIVE_VIEW) {
                                this._lastLVPath = path;
                            }

                            this.routeMessages$.next(path);
                        }
                    }
                }
            });
    }



    set locationDashboardSelectedTab(tabName: string) {
        // this._locDashboardTab = tabName;
        this._dashView = tabName;
    }

    set tagsDashboardTab(tabName: string) {
        // this._tagsDashboardTab = tabName;
        this._dashView = tabName;
    }

    getRoutingSubscription(): Observable<IEcsPath> {
        return this.routeMessages$.asObservable();
    }

    navigateToItemView(item: IItem, isConfig?: boolean) {
        if (isConfig) {
            this._mode = Mode.CONFIG;
            this._configView = item.view;
        } else {
            this._mode = Mode.LIVE_VIEW;
            this._dashView = item.view;
        }

        this._itemType = item.type;
        this._itemId = item.id;
        this.navigateToRoute();
    }

    navigateToPath(path: IEcsPath) {
        if (path.mode) {
            this._mode = path.mode;
        }

        if (this._mode === Mode.LIVE_VIEW) {
            if (path.view) {
                this._dashView = path.view;
            }
        } else {
            if (path.view) {
                this._configView = path.view;
            }
        }

        this._itemType = path.itemType;
        this._itemId = path.itemID;
        this.navigateToRoute();
    }

    navigateOutFromConfig() {
        this.setLastLVPathProps();
        this.navigateToRoute();
    }

    // Navigate According to given URL
    // ----------------------------------
    navigateToUrl(url: string | UrlSegment[]) {
        switch (typeof url) {
            case 'string':
                this._router.navigate([url]);
                break;
            case 'object':
                this._router.navigate(<UrlSegment[]>url);
                break;
        }
    }

    navigateToRoot() {
        let rootLocationId;
        if (this._topology.roots && this._topology.roots.length > 0) {
            rootLocationId = this._topology.roots[0].ID;
            this.navigateToPath({
                mode: this._mode,
                itemID: rootLocationId,
                itemType: ItemTypes.LOCATION
            });
        } else {
            this.navigateToLogin();
        }
    }

    navigateToLogin() {
        this._router.navigate(['/login']);
    }

    getCurrentUrl() {
        return window.location.pathname;
    }

    private navigateToRoute() {
        const baseRouteLink = `/${this._itemType}/${this._itemId}`;
        if (this._mode === Mode.CONFIG) {
            this._router.navigate([baseRouteLink,
                {outlets: {'config': ['configuration', this._configView], 'live-view': null }}]);
        } else {
             this._router.navigate([baseRouteLink,
                {outlets: {'live-view': ['live-view', this._itemType + 'Dashboard', this._dashView], 'config': null }}]);
        }
    }

    private navigateToRootTags() {
        this.navigateToPath({
            mode: Mode.LIVE_VIEW,
            itemType: ItemTypes.TAGS,
            itemID: 0
        });
    }

    private setLastLVPathProps() {
        if (this._lastLVPath) {
            this._itemType = this._lastLVPath.itemType;
            this._itemId = this._lastLVPath.itemID;
            this._mode = this._lastLVPath.mode;
            this._dashView = this._lastLVPath.view;
        }
    }
}
