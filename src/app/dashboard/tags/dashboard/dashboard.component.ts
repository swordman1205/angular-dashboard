import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RouteService} from '../../../shared/services/route.service';
import {IEcsPath} from '../../../shared/interfaces/ecsPath';
import {Subscription} from 'rxjs';
import {DxTabsComponent} from 'devextreme-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild('tagsDashboardTabs') tabsComponent: DxTabsComponent;
  private routeSubscription$: Subscription;
  private itemId: number;
  private itemType: string;
  private _tabKey: string;
  private _prevTabKey: string;
  tabIndex = 0;
  tabs = [
    { id: 0, key: 'status', text: 'Status', icon: 'fa fa-fw fa-tachometer', selected: true },
    { id: 1, key: 'alarms', text: 'Alarms', icon: 'fa fa-fw fa-bell' },
    { id: 2, key: 'tickets', text: 'Tickets', icon: 'fa fa-fw fa-ticket' }
    ];

  constructor(private _routeService: RouteService) {
  }

  ngOnInit() {
    this.routeSubscription$ = this._routeService.getRoutingSubscription()
        .subscribe((path: IEcsPath) => {
          this.itemId = path.itemID;
          this.itemType = path.itemType;
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

  onTabClicked(event) {
    this._routeService.tagsDashboardTab = event.itemData.key;
    this.tabIndex = event.itemIndex;
    this.routeToSelectedTab(event.itemIndex);
  }

  private routeToSelectedTab(tabIndex) {
    this._prevTabKey = this._tabKey;
    this._tabKey = this.tabs[tabIndex].key;
    this._routeService.navigateToPath({
      itemType: this.itemType,
      itemID: this.itemId,
      view: this._tabKey
    });
  }

  onResize = event => {
    this.tabsWidth();
    this.tabsComponent.instance.repaint();
  }

  tabsWidth = () => {
    const width = document.getElementById('tabscontainer').offsetWidth;
    return (width - 32);
  }
}
