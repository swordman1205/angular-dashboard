import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemTypes } from '../../shared/data/constants/itemType';
import { RouteService } from '../../shared/services/route.service';
import { TopologyService } from '../../shared/services/topology.service';
import { LogService } from '../../shared/services/log.service';
import { MessageService } from 'primeng/api';
import { ConfigurationComponent } from '../configuration.component';
import { AuthService } from '../../shared/services/auth.service';
import { Subject, Observable, Subscription } from 'rxjs';
import { IEcsPath } from '../../shared/interfaces/ecsPath';
import { Events } from '../../shared/data/constants/events';
import { DataRowStates } from '../../shared/data/enums/data-row-state.enum';
import { IECSObject } from '../../shared/interfaces/ecsObject';






@Component({
  selector: 'app-config-info',
  templateUrl: './config-info.component.html',
  styleUrls: ['./config-info.component.scss']
})
export class ConfigInfoContainerComponent implements OnInit, OnDestroy {
  itemTypes = ItemTypes;
  itemType: string;
  itemId: number;
  isDirty = false;

  private canDeactvSource = new Subject<boolean>();
  canDeactv$: Observable<boolean>;

  // getDataSubscrp: Subscription;
  // saveDataSubscrp: Subscription;
  private routeSubscription$: Subscription;
  private authInitSubscription$: Subscription;
  private saveHndlSubscrp: Subscription;
  private getHndlSubscrp: Subscription;
  private _ecsObj: IECSObject;






   constructor(private _router: RouteService,
        private _topology: TopologyService,
        private _logger: LogService,
        private _msgService: MessageService,
        private _config: ConfigurationComponent,
        private _auth: AuthService) {
    }






    // Life Cycle Hooks
    // ---------------------
    get ECSObject(): IECSObject {
      return this._ecsObj;
  }







    // Life Cycle Hooks
    // ---------------------
    ngOnInit(): void {
      this.canDeactv$ = this.canDeactvSource.asObservable();

      this.saveHndlSubscrp = this._config.save.subscribe(
          res => {
              this.saveData();
          },
          err => {
              this._logger.error('Attempt to SAVE Configuration widget data has failed!. Error: ' + err);
          });

      this.getHndlSubscrp = this._config.refresh.subscribe(
          res => {
              this.getData();
          },
          err => {
              this._logger.error('Attempt to GET Configuration widget data has failed!. Error: ' + err);
          });


      this.routeSubscription$ = this._router.getRoutingSubscription()
          .subscribe((path: IEcsPath) => {
              if (path.itemType && path.itemID &&
                 (path.itemType !== this.itemType || path.itemID !== this.itemId)) {
                  this.itemType = path.itemType;
                  this.itemId = path.itemID;

                  if (this._auth.dataInit) {
                      this._ecsObj = this._topology.getItemByTypeAndID(this.itemType, this.itemId);
                      this.getData();
                  }
              }
          });


      // In case of refresh, widget should get data after all services were initialized
      this.authInitSubscription$ = this._auth.message$.subscribe(msg => {
          if (msg === Events.ALL_SERVICES_INITIALIZED) {
              if (this.itemType && this.itemId) {
                this._ecsObj = this._topology.getItemByTypeAndID(this.itemType, this.itemId);
                this.getData();
              }
          }
      });
  }

  ngOnDestroy() {
    // if (this.getDataSubscrp) {
    //     this.getDataSubscrp.unsubscribe();
    // }

    // if (this.saveDataSubscrp) {
    //     this.saveDataSubscrp.unsubscribe();
    // }

    if (this.routeSubscription$) {
        this.routeSubscription$.unsubscribe();
    }

    if (this.saveHndlSubscrp) {
        this.saveHndlSubscrp.unsubscribe();
    }

    if (this.getHndlSubscrp) {
        this.getHndlSubscrp.unsubscribe();
    }

    if (this.authInitSubscription$) {
        this.authInitSubscription$.unsubscribe();
    }
}





  // Public Operations
    // ------------------------
    getData() {

  }


  saveData() {

  }


  dirtifyItem(dirtifyName: string = 'default') {
      if (dirtifyName === 'default') {
          if (this._ecsObj.RowState === DataRowStates.UNCHANGED) {
              this._ecsObj.RowState = DataRowStates.MODIFIED;
          }
      } else {
          // if (!this.extraDirtyObjects) {
          //     this.extraDirtyObjects = [];
          // }
          // if (!this.extraDirtyObjects.includes(dirtifyName)) {
          //     this.extraDirtyObjects.push(dirtifyName);
          // }
      }

      this._config.dirtifyTab();
      this.isDirty = true;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.isDirty) {
        this._msgService.clear();
        this._msgService.add({
            key: 'confirmDialg',
            sticky: true,
            severity: 'warn',
            summary: 'Un-Saved Config Item',
            detail: 'Are you sure you want to navigate out without saving your changes?',
            data: {
                this: this,
                onConfirm: () => {
                    this._msgService.clear('confirmDialg');
                    this.isDirty = false;
                    this._config.unDirtifyAllTabs();
                    this.canDeactvSource.next(true);
                    // this.canDeactvSource.complete();
                },
                onReject: () => {
                    this._msgService.clear('confirmDialg');
                    this._config.restorePrevTab();
                    this.canDeactvSource.next(false);
                    // this.canDeactvSource.complete();
                }
            }
        });
        return this.canDeactv$;
    } else {
        return true;
    }
}

  show(itemType: string): boolean {
    return this.itemType === itemType;
  }
}
