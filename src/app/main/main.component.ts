import { TranslateService } from '@ngx-translate/core';
import {
    Component, AfterViewInit, ElementRef, ViewChild, OnDestroy,
    OnInit, NgZone, Renderer2, ViewEncapsulation
} from '@angular/core';
import { RouteService } from '../shared/services/route.service';
import { LogService } from '../shared/services/log.service';
import { TopologyService } from '../shared/services/topology.service';
import { ScrollPanel } from 'primeng/primeng';
import { Message, MenuItem } from 'primeng/components/common/api';
import { Subscription } from 'rxjs';
import { Mode, ItemTypes } from '../shared/data/constants/itemType';
import { IItem } from '../shared/interfaces/item';
import { statusView } from '../shared/data/constants/statusView';
import { TitleCasePipe } from '@angular/common';



enum MenuOrientation {
    STATIC,
    OVERLAY,
    SLIM,
    HORIZONTAL
}



declare var jQuery: any;




@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainComponent implements AfterViewInit, OnDestroy, OnInit {

    @ViewChild('layoutContainer') layourContainerViewChild: ElementRef;
    @ViewChild('scrollPanel') layoutMenuScrollerViewChild: ScrollPanel;

    name = 'MainComponent';
    item: IItem;

    private _adminMode = true;
    darkMenu = false;
    profileMode = 'inline';
    layoutCompact = true;
    topbarItemClick: boolean;
    topbarMenuActive: boolean;
    activeTopbarItem: any;
    menuClick: boolean;
    resetMenu: boolean;
    overlayMenuActive: boolean;
    staticMenuDesktopInactive: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
    rightPanelActive: boolean;
    rightPanelClick: boolean;
    layoutContainer: HTMLDivElement;
    layoutMenuScroller: HTMLDivElement;
    rotateMenuButton: boolean;
    layoutMode: MenuOrientation = MenuOrientation.STATIC;

    msgs: Message[] = [];
    topologyStatusChange$: Subscription;
    private routeSubscription$: Subscription;
    itemType: string;
    itemId: number;
    tabKey: any;
    mode = Mode.LIVE_VIEW;
    itemTypes = ItemTypes;
    modes = Mode;

    rippleInitListener: any;
    rippleMouseDownListener: any;


    displayConfig = false;
    titleCase: TitleCasePipe;






    // --------------------------------------------------
    // CTor
    // --------------------------------------------------
    constructor(public renderer: Renderer2,
        public zone: NgZone,
        private _router: RouteService,
        private _logger: LogService,
        private _topology: TopologyService,
        private _translate: TranslateService) {

        this.topologyStatusChange$ = _topology.messageStatusChange$.subscribe(
            (data: IItem) => { // The messageStatusChange Subscriber next Handler
                if (data && data.type) {
                    const title = _translate.instant('DASHBOARD.STATUS_CHANGE_TITLE');
                    let description = '';
                    switch (data.type) {
                        case ItemTypes.LOCATION:
                            description = _translate.instant('DASHBOARD.LOCATION_STATUS_CHANGE_DESCRIPTION',
                                {
                                    name: data.Name,
                                    oldStatus: statusView[data.oldStatusView].caption,
                                    newStatus: statusView[data.StatusView].caption
                                });
                            break;
                        case
                            ItemTypes.ASSET:
                            description = _translate.instant('DASHBOARD.ASSET_STATUS_CHANGE_DESCRIPTION',
                                {
                                    name: data.Name,
                                    oldStatus: statusView[data.oldStatusView].caption,
                                    newStatus: statusView[data.StatusView].caption
                                });
                            break;
                        case
                            ItemTypes.ASSET_MEASURE:
                            description = _translate.instant('DASHBOARD.ASSET_MEASURE_STATUS_CHANGE_DESCRIPTION',
                                {
                                    name: data.Name,
                                    oldStatus: statusView[data.oldStatusView].caption,
                                    newStatus: statusView[data.StatusView].caption
                                });
                            break;
                    }

                    this.showInfo(title, description);
                }
            } // End of messageStatusChange Subscriber
        );
    }




    // --------------------------------------------------
    // Life Cycle Operations
    // --------------------------------------------------
    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.bindRipple();
        });

        this.routeSubscription$ = this._router.getRoutingSubscription()
            .subscribe(path => {
                if (path.mode) {
                    this.mode = path.mode;
                }

                this.displayConfig = (this.mode === Mode.CONFIG);

                if (path.itemID && path.itemType) {
                    this.itemId = path.itemID;
                    this.itemType = path.itemType;
                }
            });

            this.titleCase = new TitleCasePipe();
    }

    ngAfterViewInit() {
        this.layoutContainer = <HTMLDivElement>this.layourContainerViewChild.nativeElement;
        setTimeout(() => {
            this.layoutMenuScrollerViewChild.moveBar();
        }, 100);
    }


    ngOnDestroy() {
        if (this.topologyStatusChange$) {
            this.topologyStatusChange$.unsubscribe();
        }

        if (this.routeSubscription$) {
            this.routeSubscription$.unsubscribe();
        }

        this.unbindRipple();
    }



    // --------------------------------------------------
    // Properties
    // --------------------------------------------------
    get adminMode(): boolean {
        return this._adminMode;
    }

    set adminMode(isAdminMode: boolean) {
        this._adminMode = isAdminMode;
    }






    // --------------------------------------------------
    // Public Operations
    // --------------------------------------------------
    init() {
        this.rippleMouseDownListener = this.rippleMouseDown.bind(this);
        document.addEventListener('mousedown', this.rippleMouseDownListener, false);
    }

    navItemClick(event: Event, mnItm: MenuItem, index: number) {
        const item = <any>mnItm;
        this._router.navigateToPath({
            mode: Mode.LIVE_VIEW,
            itemType: item.type,
            itemID: +item.id
        });
    }

    navConfigClick(event: Event, mnItm: MenuItem, index: number) {
        const item = <any>mnItm;
        this._router.navigateToPath({
            mode: Mode.CONFIG,
            itemType: item.type,
            itemID: +item.id
        });
    }


    afterConfigPopupClosed() {
        this._router.navigateOutFromConfig();
        this.displayConfig = false;
    }


    getConfigPopupTitle() {
        const item: IItem = this._topology.getItemByTypeAndID(this.itemType, this.itemId);
        if (item) {
            return this.titleCase.transform(this.itemType) + ' Configuration - ' + item.Name;
        }

        return '';
    }

    breadItemClick(item: IItem) {
        this._router.navigateToPath({
            itemType: item.type,
            itemID: item.id
        });
    }


    // onConfigToggle(event) {
    //     if (this.mode !== event.option.value) {
    //         this.mode = event.option.value;
    //         this._router.mode = this.mode;
    //         this._router.navigateToPath({
    //             itemType: this.itemType,
    //             itemID: this.itemId
    //         });
    //     }

    //     event.originalEvent.preventDefault();
    // }

    bindRipple() {
        this.rippleInitListener = this.init.bind(this);
        document.addEventListener('DOMContentLoaded', this.rippleInitListener);
    }

    rippleMouseDown(e) {
        for (let target = e.target; target && target !== this; target = target['parentNode']) {
            if (!this.isVisible(target)) {
                continue;
            }

            // Element.matches() -> https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
            if (this.selectorMatches(target, '.ripplelink, .ui-button')) {
                const element = target;
                this.rippleEffect(element, e);
                break;
            }
        }
    }

    rippleEffect(element, e) {
        if (element.querySelector('.ink') === null) {
            const inkEl = document.createElement('span');
            this.addClass(inkEl, 'ink');

            if (this.hasClass(element, 'ripplelink')) {
                element.querySelector('span').insertAdjacentHTML('afterend', '<span class=\'ink\'></span>');
            } else {
                element.appendChild(inkEl);
            }
        }

        const ink = element.querySelector('.ink');
        this.removeClass(ink, 'ripple-animate');

        if (!ink.offsetHeight && !ink.offsetWidth) {
            const d = Math.max(element.offsetWidth, element.offsetHeight);
            ink.style.height = d + 'px';
            ink.style.width = d + 'px';
        }

        const x = e.pageX - this.getOffset(element).left - (ink.offsetWidth / 2);
        const y = e.pageY - this.getOffset(element).top - (ink.offsetHeight / 2);

        ink.style.top = y + 'px';
        ink.style.left = x + 'px';
        ink.style.pointerEvents = 'none';
        this.addClass(ink, 'ripple-animate');
    }

    hasClass(element, className) {
        if (element.classList) {
            return element.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
        }
    }

    addClass(element, className) {
        if (element.classList) {
            element.classList.add(className);
        } else {
            element.className += ' ' + className;
        }
    }

    removeClass(element, className) {
        if (element.classList) {
            element.classList.remove(className);
        } else {
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }


    getOffset(el) {
        const rect = el.getBoundingClientRect();

        return {
            top: rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
            left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0),
        };
    }

    selectorMatches(el, selector) {
        const p = Element.prototype;
        const f = p['matches'] || p['webkitMatchesSelector'] || p['mozMatchesSelector'] || p['msMatchesSelector'] || function (s) {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
        };
        return f.call(el, selector);
    }

    isVisible(el) {
        return !!(el.offsetWidth || el.offsetHeight);
    }


    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.menuClick) {
            if (this.isHorizontal() || this.isSlim()) {
                this.resetMenu = true;
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }

            this.menuHoverActive = false;
        }

        if (!this.rightPanelClick) {
            this.rightPanelActive = false;
        }

        this.topbarItemClick = false;
        this.menuClick = false;
        this.rightPanelClick = false;
    }


    onMenuButtonClick(event) {
        this.menuClick = true;
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;

        if (this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;
        } else {
            if (this.isDesktop()) {
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            } else {
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
            }

        }

        event.preventDefault();
    }

    onMenuClick(event) {
        this.menuClick = true;
        this.resetMenu = false;
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;
        this.activeTopbarItem = item;

        event.preventDefault();
    }


    onRightPanelButtonClick(event) {
        this.rightPanelClick = true;
        this.rightPanelActive = !this.rightPanelActive;
        event.preventDefault();
    }

    onRightPanelClick() {
        this.rightPanelClick = true;
    }


    hideOverlayMenu() {
        this.rotateMenuButton = false;
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }

    isHorizontal() {
        return this.layoutMode === MenuOrientation.HORIZONTAL;
    }

    isSlim() {
        return this.layoutMode === MenuOrientation.SLIM;
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.layoutMode === MenuOrientation.OVERLAY;
    }

    changeToStaticMenu() {
        this.layoutMode = MenuOrientation.STATIC;
    }

    changeToOverlayMenu() {
        this.layoutMode = MenuOrientation.OVERLAY;
    }

    changeToHorizontalMenu() {
        this.layoutMode = MenuOrientation.HORIZONTAL;
    }

    changeToSlimMenu() {
        this.layoutMode = MenuOrientation.SLIM;
    }

    unbindRipple() {
        if (this.rippleInitListener) {
            document.removeEventListener('DOMContentLoaded', this.rippleInitListener);
        }
        if (this.rippleMouseDownListener) {
            document.removeEventListener('mousedown', this.rippleMouseDownListener);
        }
    }

    showSuccess(title: string, description: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: title, detail: description });
    }

    showInfo(title: string, description: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: title, detail: description });
    }

    showWarn(title: string, description: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: title, detail: description });
    }

    showError(title: string, description: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: title, detail: description });
    }
}
