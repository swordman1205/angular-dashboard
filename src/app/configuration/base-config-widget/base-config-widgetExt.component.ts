import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TopologyService } from '../../shared/services/topology.service';
import { Observable, forkJoin } from 'rxjs';
import { RouteService } from '../../shared/services/route.service';
import { LogService } from '../../shared/services/log.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../shared/services/data.service';
import { CommonService } from '../../shared/services/common.service';
import { ConfigurationComponent } from '../configuration.component';
import { IECSObject } from '../../shared/interfaces/ecsObject';
import { DataRowStates } from '../../shared/data/enums/data-row-state.enum';
import { MessageService, SelectItem } from 'primeng/api';
import { ValidationHelper } from '../../shared/services/validationHelper';
import { ServiceHelper } from '../../shared/services/serviceHelper';
import { BaseConfigWidgetComponent } from './base-config-widget.component';
import { AuthService } from '../../shared/services/auth.service';





@Component({
  selector: 'app-base-configExt-widget',
  templateUrl: './base-config-widget.component.html',
  styleUrls: ['./base-config-widget.component.scss']
})
export class BaseConfigWidgetExtComponent<TEcs extends IECSObject> extends BaseConfigWidgetComponent implements OnInit, OnDestroy {

  @Output() ecsObjectChanged = new EventEmitter<any>();

  private _getData$: Observable<Object>;

  private _items: Array<SelectItem>;
  private _ecsObjects: Array<TEcs>;
  private _dirtyEcsObjects: Array<TEcs>;
  private _currEcsObject: TEcs;

  private _labelBy: string;
  private _sortBy: string;
  private _dataNames: Array<string>;
  private _extraDataNames: Array<string>;
  private _funcBag: IDataFunctionBag;
  private _saveAct: string;








  // --------------------------------------
  // CTor
  // --------------------------------------
  constructor(router: RouteService,
    topology: TopologyService,
    data: DataService,
    logger: LogService,
    translate: TranslateService,
    msgService: MessageService,
    config: ConfigurationComponent,
    auth: AuthService,
    common: CommonService = null) {
    super(router, topology, data, logger, translate, msgService, config, auth, common);
  }









  // ------------------------------------
  // Functional Properties
  // -----------------------------
  get Items(): SelectItem[] | any {
    if (this._items && this._items.length > 0) {
      return this._items;
    } else {
      return null;
    }
  }

  get EcsObjects(): TEcs[] | any {
    return this._ecsObjects;
  }

  set DirtyEcsObjects(dirtyObjs: TEcs[]) {
    this._dirtyEcsObjects = dirtyObjs;
  }

  set CurrECSObject(ecsObj: TEcs) {
    this._currEcsObject = ecsObj;
    this.ECSObject = ecsObj;
    this.ecsObjectChanged.emit();
  }

  get CurrECSObject(): TEcs {
    return this._currEcsObject;
  }

  set LabelBy(lbl: string) {
    this._labelBy = lbl;
  }

  set SortBy(sort: string) {
    this._sortBy = sort;
  }

  set DataNames(getName: Array<string>) {
    this._dataNames = getName;
  }

  set ExtraDataNames(extraDat: Array<string>) {
    this._extraDataNames = extraDat;
  }

  set DataFunctionBag(funcBag: IDataFunctionBag) {
    this._funcBag = funcBag;
  }

  set SaveAct(act: string) {
    this._saveAct = act;
  }







  // ------------------------------
  // Life Cycle Hooks
  // ------------------------------
  ngOnDestroy() {
    super.ngOnDestroy();
    this.ecsObjectChanged.unsubscribe();
  }









  // ------------------------------
  // Public Operations
  // ------------------------------
  getData() {
    super.getData();
    this.loading = true;
    this.Logger.info(`Getting data for widget locations config forms - LocationId: ${this.locationID}`);

    const locDat: Array<string> = [];
    locDat.push.apply(locDat, this._dataNames);
    if (this._extraDataNames && this._extraDataNames.length > 0) {
      locDat.push.apply(locDat, this._extraDataNames);
    }

    if (this._funcBag) {
      let args = null;
      if (this._funcBag.ParamProps && this._funcBag.ParamProps.length > 0) {
        args = [];
        this._funcBag.ParamProps.forEach((prop: string) => {
          const str = this[prop];
          args.push(this[prop]);
        });
      }

      if (locDat && locDat.length > 0) {
        this._getData$ = forkJoin([
          this.Data.getLocationData(this.locationID, locDat),
          this._funcBag.Func.call(this.Data, ...args)]);
      } else {
        this._getData$ = this._funcBag.Func.call(this.Data, ...args);
      }
    } else {
      this._getData$ = this.Data.getLocationData(this.locationID, locDat);
    }

    this.getDataSubscrp = this._getData$
      .subscribe(
        res => {
          let locData: any = null;
          let funcData: any = null;
          this._ecsObjects = [];

          if (this._funcBag) {
            if (this._dataNames && this._dataNames.length > 0) {
              locData = res[0];
              funcData = res[1];
              this._dataNames.forEach((name: string) => {
                this._ecsObjects.push.apply(this._ecsObjects, locData[name]);
              });
            } else {
              this._ecsObjects = <Array<TEcs>>(res);
            }
          } else {
            locData = res;
            this._dataNames.forEach((name: string) => {
              this._ecsObjects.push.apply(this._ecsObjects, locData[name]);
            });
          }

          if (this._ecsObjects && this._ecsObjects.length > 0) {
            this._ecsObjects = ServiceHelper.sortArray(this._ecsObjects, this._sortBy);
          }

          this.beforeSetItems();
          this.loadItems();
          this.setSelectedItem();

          const extrDat = {};
          if (this._extraDataNames && this._extraDataNames.length > 0) {
            this._extraDataNames.forEach((extraName: string) => {
              extrDat[extraName] = locData[extraName];
            });
          }

          if (funcData) {
            extrDat['func'] = funcData;
          }

          this.afterDataRetrieve(extrDat);

          this.Config.unDirtifyTab();
          this.isDirty = false;
          this.loading = false;
        },
        err => {
          this.Logger.error(`error in config location forms ${err}`);
          this.loading = false;
        },
        () => {
          this.getDataSubscrp.unsubscribe();
        });


  }


  saveData() {
    if (this.saveDataSubscrp) {
      this.saveDataSubscrp.unsubscribe();
    }

    this.loading = true;
    this.Logger.info(`Saving data for widget locations config devices - LocationId: ${this.locationID}`);

    if (!(this._ecsObjects && this._ecsObjects.length > 0)) {
      return;
    }

    if (!this.validate()) {
      this.loading = false;
      return;
    }

    // Find Dirty ECS Objects
    // ------------------
    if (!(this._dirtyEcsObjects && this._dirtyEcsObjects.length > 0)) {
      let seq = 0;
      this._dirtyEcsObjects = [];
      this._ecsObjects.forEach((obj: TEcs) => {
        if (obj.RowState !== DataRowStates.UNCHANGED) {
          obj.Seq = seq;
          this._dirtyEcsObjects.push(obj);
          seq++;
        }
      });
    }

    // Update Dirty Items
    // ----------------------------------
    if (this._dirtyEcsObjects.length > 0) {
      // If any sepcial operations needed BEFORE sending the data to ECS Server
      this.beforeDataSave(this._dirtyEcsObjects);

      this.saveDataSubscrp = this.Data.saveLocationData(this.locationID, this._saveAct, this._dirtyEcsObjects)
        .subscribe(
          res => {
            this._dirtyEcsObjects = null;
            let indx = -1;

            this.Logger.info('Location Data was updated to the ECS Server. ' +
              'Location ID: ' + this.locationID + ', Data type name: ' + this._dataNames);

            let currObj: TEcs = null;
            for (let i = this._ecsObjects.length - 1; i > 0; i--) {
              currObj = this._ecsObjects[i];

              switch (currObj.RowState) {
                case DataRowStates.DELETED: {
                  this._ecsObjects.splice(i, 1);
                  break;
                }

                case DataRowStates.ADDED: {
                  indx = res.findIndex((newObj: TEcs) => newObj.Seq === currObj.Seq);
                  if (indx >= 0) {
                    this._ecsObjects[i] = res[indx];
                    this._ecsObjects[i].Seq = undefined;
                  }
                  break;
                }

                case DataRowStates.MODIFIED: {
                  indx = res.findIndex((updObj: TEcs) => updObj.ID === currObj.ID);
                  if (indx >= 0) {
                    this._ecsObjects[i] = res[indx];
                    this._ecsObjects[i].Seq = undefined;
                  }
                  break;
                }
              }

              this._ecsObjects[i].RowState = DataRowStates.UNCHANGED;
            }

            this.beforeSetItems();
            this.loadItems();
            this.setSelectedItem();
            this.afterDataRetrieve(null);
          },
          err => {
            this.Logger.error(`error in saving location asset types ${err}`);
            this.loading = false;

            let flg = false;
            this._dirtyEcsObjects.forEach((obj: TEcs) => {
              if (obj.RowState === DataRowStates.DELETED) {
                flg = true;
                obj.RowState = DataRowStates.UNCHANGED;

                const indx = this._ecsObjects.findIndex((delObj: TEcs) => delObj.ID === obj.ID);
                if (!(indx > -1)) {
                  this._ecsObjects.push(obj);
                }
              }
            });

            if (flg) {
              this.beforeSetItems();
              this.loadItems();
              this.setSelectedItem();
              this.afterDataRetrieve(null);
            }

            this.MsgService.clear();
            this.MsgService.add({
              severity: 'error',
              summary: 'Update Error',
              detail: 'Updating configuration data has failed: ' + err
            });
          },
          () => {
            this.saveDataSubscrp.unsubscribe();

            if (this.extraDirtyObjects && this.extraDirtyObjects.length > 0) {
              this.saveExtraDirtyObjects();
            } else {
              this.loading = false;
              this.Config.unDirtifyTab();
              this.isDirty = false;

              this.MsgService.clear();
              this.MsgService.add({
                severity: 'success',
                summary: 'Update Successful',
                detail: 'Updating configuration data was successful'
              });
            }
          }
        );
    } else {
      this.saveExtraDirtyObjects();
    }
  }


  removeEcsObject(event) {
    if (this.CurrECSObject.RowState === DataRowStates.ADDED) {
      const indx = this._ecsObjects.findIndex((obj: TEcs) => obj === this.CurrECSObject);
      if (indx > -1) {
        this._ecsObjects.splice(indx, 1);
      }

      const indx2 = this._items.findIndex((item: SelectItem) => item.value === this.CurrECSObject);
      if (indx2 > -1) {
        this._items.splice(indx2, 1);
      }

      let flgDirty = false;
      this._ecsObjects.forEach((obj: TEcs) => {
        if (obj.RowState !== DataRowStates.UNCHANGED) {
          flgDirty = true;
        }
      });

      if (!flgDirty) {
        this.Config.unDirtifyTab();
        this.isDirty = false;
      }
    } else {
      this.CurrECSObject.RowState = DataRowStates.DELETED;
      this.dirtifyItem();
      this.CurrECSObject = null;
    }
  }







  // ------------------------------
  // Protected Operations
  // ------------------------------
  protected addEcsObject(newObj: TEcs) {
    if (!this.validateItems()) {
      return;
    }

    newObj.RowState = DataRowStates.ADDED;
    this._ecsObjects.push(newObj);
    this._items.push({ label: newObj[this._labelBy], value: newObj });
    this._items = ServiceHelper.sortArray(this._items, 'label');
    this.CurrECSObject = newObj;
    this.dirtifyItem();
  }







  // ------------------------------
  // Private "Helper" Methods
  // -----------------------------
  private loadItems() {
    this._items = new Array<SelectItem>();

    if (!(this._ecsObjects && this._ecsObjects.length > 0)) {
      return;
    }

    this._ecsObjects.forEach((obj: TEcs) => {
      this._items.push({ label: obj[this._labelBy], value: obj });
    });

    if (this._items && this._items.length > 0) {
      this._items = ServiceHelper.sortArray(this._items, 'label');
    }
  }


  private setSelectedItem() {
    if (!(this._items && this._items.length > 0)) {
      return;
    }

    if (this.CurrECSObject) {
      const indx = this._items.findIndex((itm: SelectItem) => itm.value.ID === this.CurrECSObject.ID);
      if (indx > -1) {
        this.CurrECSObject = this._items[indx].value;
      }
    } else {
      this.CurrECSObject = this._items[0].value;
    }
  }


  private validateItems(): boolean {
    if (!(this._ecsObjects && this._ecsObjects.length > 0)) {
      return true;
    }

    const flg: boolean = typeof this._ecsObjects[0][this._labelBy] === 'string';
    const err: string = ValidationHelper.validatDuplicateByName(this._ecsObjects, this._labelBy);

    if (err) {
      this.MsgService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'The current list contains duplicate value. duplicate value:' + err
      });

      return false;
    }

    if (flg) {
      if (!ValidationHelper.validatEmptyName(this._ecsObjects, this._labelBy)) {
        this.MsgService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Can not add empty value'
        });

        return false;
      }
    }

    return true;
  }





  // ---------------------------------
  // Abstract Methods
  // ---------------------------------
  protected beforeSetItems() {
  }

  protected afterDataRetrieve(extraData: any) {
  }

  protected beforeDataSave(arr: Array<TEcs>) {
  }

  protected saveExtraDirtyObjects() {
    this.loading = false;
  }

  protected validate(): boolean {
    return this.validateItems();
  }
}



export interface IDataFunctionBag {
  Func: Function;
  ParamProps?: string[];
}
