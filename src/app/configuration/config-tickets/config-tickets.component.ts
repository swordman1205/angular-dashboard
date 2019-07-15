import { LogService } from './../../shared/services/log.service';
import { DataService } from './../../shared/services/data.service';
import { BaseConfigWidgetComponent } from './../base-config-widget/base-config-widget.component';
import { Component } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { TicketCause } from '../../shared/types/ticketCause';
import { TicketAction } from '../../shared/types/ticketAction';
import { TopologyService } from '../../shared/services/topology.service';
import { RouteService } from '../../shared/services/route.service';
import { ConfigurationComponent } from '../configuration.component';
import { DataRowStates } from '../../shared/data/enums/data-row-state.enum';
import { ServiceHelper } from '../../shared/services/serviceHelper';
import { AuthService } from '../../shared/services/auth.service';




@Component({
  selector: 'app-config-tickets',
  templateUrl: './config-tickets.component.html',
  styleUrls: ['./config-tickets.component.scss']
})
export class ConfigTicketsComponent extends BaseConfigWidgetComponent {

  currCause: TicketCause;
  selCauses: Array<TicketCause>;
  private _causeItems: Array<SelectItem>;
  dirtyTicketCauses: Array<TicketCause>;
  ticketCauses: Array<TicketCause>;

  currAction: TicketAction;
  selActions: Array<TicketAction>;
  private _actionItems: Array<SelectItem>;
  dirtyTicketActions: Array<TicketAction>;
  ticketActions: Array<TicketAction>;







  constructor(router: RouteService,
    topology: TopologyService,
    data: DataService,
    logger: LogService,
    translate: TranslateService,
    msgService: MessageService,
    config: ConfigurationComponent,
    auth: AuthService) {
    super(router, topology, data, logger, translate, msgService, config, auth);
  }








  // Properties
  // -----------------------------
  get causeItems(): SelectItem[] | any {
    if (this._causeItems && this._causeItems.length > 0) {
      return this._causeItems;
    } else {
      return null;
    }
  }


  get actionItems(): SelectItem[] | any {
    if (this._actionItems && this._actionItems.length > 0) {
      return this._actionItems;
    } else {
      return null;
    }
  }









  getData() {
    this.loading = true;
    this.Logger.info(`Getting data for widget locations config devices - LocationId: ${this.locationID}`);
    super.getData();

    this.getDataSubscrp = this.Data.getLocationData(this.locationID,
      ['ticketCauses',
        'ticketActions'])
      .subscribe(
        res => {
          this.ticketCauses = res['ticketCauses'];
          this.ticketActions = res['ticketActions'];

          this.loadTicketCauses();
          this.loadTicketActions();
          this.setSelectedCause();
          this.setSelectedActions();

          this.Config.unDirtifyTab();
          this.isDirty = false;
          this.loading = false;
        },
        err => {
          this.Logger.error(`error in config location ticket causes/actions ${err}`);
          this.loading = false;
        });

  }



  saveData() {
    this.loading = true;
    this.Logger.info(`Saving data for widget locations config devices - LocationId: ${this.locationID}`);
    super.saveData();

    // Find Dirty TicketCauses
    // ----------------------
    this.dirtyTicketCauses = [];
    this.ticketCauses.forEach((ticketCause: TicketCause) => {
      if (ticketCause.RowState !== DataRowStates.UNCHANGED) {
        this.dirtyTicketCauses.push(ticketCause);
      }
    });


    // Find Dirty ContactAlerts
    // ----------------------
    this.dirtyTicketActions = [];
    this.ticketActions.forEach((ticketAction: TicketAction) => {
      if (ticketAction.RowState !== DataRowStates.UNCHANGED) {
        this.dirtyTicketActions.push(ticketAction);
      }
    });


    if (this.dirtyTicketCauses.length > 0 || this.dirtyTicketActions.length > 0) {
      this.saveDataSubscrp = this.Data.saveLocationTicketItems(this.locationID, this.dirtyTicketCauses, this.dirtyTicketActions)
        .subscribe(
          res => {
            let cuasIndx = -1;
            let actIndx = -1;

            this.Logger.info('Location Alerts were updated to the ECS Server. Location ID: ' + this.locationID);
            const tckCauses = res[0];
            const tckActions = res[1];

            if (tckCauses && tckCauses.length > 0) {
              tckCauses.forEach((ticketCause: TicketCause) => {
                cuasIndx = this.ticketCauses.findIndex((alrt: TicketCause) => ticketCause.ID === alrt.ID);
                if (cuasIndx >= 0) {
                  this.ticketCauses[cuasIndx] = ticketCause;
                }
              });

              if (this.dirtyTicketCauses.length !== tckCauses.length) {
                this.dirtyTicketCauses.forEach((ticketCause: TicketCause) => {
                  if (ticketCause.RowState === DataRowStates.DELETED) {
                    const indx = this.ticketCauses.findIndex((alrt: TicketCause) => alrt.ID === ticketCause.ID);
                    if (indx >= 0) {
                      this.ticketCauses.splice(indx, 1);
                    }
                  }
                });
              }
            }

            if (tckActions && tckActions.length > 0) {
              tckActions.forEach((contcAlrt: TicketAction) => {
                actIndx = this.ticketActions.findIndex((alrt: TicketAction) => contcAlrt.ID === alrt.ID);
                if (cuasIndx >= 0) {
                  this.ticketActions[actIndx] = contcAlrt;
                }
              });

              if (this.dirtyTicketActions.length !== tckActions.length) {
                this.dirtyTicketActions.forEach((ticketAction: TicketAction) => {
                  if (ticketAction.RowState === DataRowStates.DELETED) {
                    const indx = this.ticketActions.findIndex((alrt: TicketAction) => alrt.ID === ticketAction.ID);
                    if (indx >= 0) {
                      this.ticketActions.splice(indx, 1);
                    }
                  }
                });
              }
            }

            this.dirtyTicketCauses = null;
            this.dirtyTicketActions = null;

            this.loadTicketCauses();
            this.loadTicketActions();
            this.setSelectedCause();
            this.setSelectedActions();

            this.Config.unDirtifyTab();
            this.isDirty = false;
            this.loading = false;
          },
          err => {
            this.Logger.error(`error in saving location check forms ${err}`);
            this.loading = false;
          },
          () => {
            this.saveDataSubscrp.unsubscribe();

            this.loading = false;
            this.Config.unDirtifyTab();
            this.isDirty = false;
            this.MsgService.add({
              severity: 'success',
              summary: 'Location Alerts Update',
              detail: 'Updating Location Alerts was successful'
            });
          }
        );
    }
  }









  // Event Handlers
  // ---------------------
  onSelectedCauseChanged(event: any) {
    if (this.selCauses && this.selCauses.length === 1) {
      this.currCause = this.selCauses[0];
      this.ECSObject = this.currCause;
    } else {
      this.currCause = null;
      this.ECSObject = null;
    }
  }


  onSelectedActionChanged(event: any) {
    if (this.selActions && this.selActions.length === 1) {
      this.currAction = this.selActions[0];
      this.ECSObject = this.currAction;
    } else {
      this.currAction = null;
      this.ECSObject = null;
    }
  }


  addTicketCause(event: any) {
    if (!this.validateAdditionalItems(this.ticketCauses, 'Name')) {
      return;
    }

    const newCause: TicketCause = new TicketCause();
    newCause.Name = '';
    newCause.RowState = DataRowStates.ADDED;
    this.ticketCauses.push(newCause);

    this._causeItems.push({ label: newCause.Name, value: newCause });
    this._causeItems = ServiceHelper.sortArray(this._causeItems, 'label');
    this.selCauses = [newCause];
    this.currCause = newCause;
    this.ECSObject = this.currCause;
    this.dirtifyItem();
  }


  mergeTicketCause(event: any) {
    if (!(this.selCauses && this.selCauses.length > 1)) {
      return;
    }

    // NEED to add to the FIRST CHOOSEN TicketCause, the ID's of all OTHER choosen causes
    // -----------------------------------------------------------------------------------
    const tmpCause: TicketCause = this.selCauses[0];
    tmpCause.MergedItems = [];
    let cause: TicketCause = null;

    for (let i = 1; i < this.selCauses.length; i++) {
      cause = this.selCauses[i];
      tmpCause.MergedItems.push(cause.ID);

      if (cause.RowState === DataRowStates.ADDED) {
        const indx = this.ticketCauses.findIndex((gCause: TicketCause) => cause === gCause);
        if (indx > -1) {
          this.ticketCauses.splice(indx, 1);
        }
      } else {
        cause.RowState = DataRowStates.DELETED;
      }
    }
  }


  removeTicketCause(event: any) {
    if (!this.currCause) {
      return;
    }

    if (this.currCause.RowState === DataRowStates.ADDED) {
      const indx = this.ticketCauses.findIndex((cause: TicketCause) => cause === this.currCause);
      if (indx > -1) {
        this.ticketCauses.splice(indx, 1);
      }

      const indx2 = this._causeItems.findIndex((item: SelectItem) => item.value === this.currCause);
      if (indx2 > -1) {
        this._causeItems.splice(indx2, 1);
      }

      let flgDirty = false;
      this.ticketCauses.forEach((cause: TicketCause) => {
        if (cause.RowState !== DataRowStates.UNCHANGED) {
          flgDirty = true;
        }
      });

      if (!flgDirty) {
        this.ticketActions.forEach((action: TicketAction) => {
          if (action.RowState !== DataRowStates.UNCHANGED) {
            flgDirty = true;
          }
        });
      }

      if (!flgDirty) {
        this.Config.unDirtifyTab();
        this.isDirty = false;
      }
    } else {
      this.currCause.RowState = DataRowStates.DELETED;
      this.dirtifyItem();
    }
  }



  addTicketAction(event: any) {
    if (!this.validateAdditionalItems(this.ticketActions, 'Name')) {
      return;
    }

    const newAction: TicketAction = new TicketAction();
    newAction.Name = '';
    newAction.RowState = DataRowStates.ADDED;
    this.ticketActions.push(newAction);

    this._actionItems.push({ label: newAction.Name, value: newAction });
    this._actionItems = ServiceHelper.sortArray(this._actionItems, 'label');
    this.selActions = [newAction];
    this.currAction = newAction;
    this.ECSObject = this.currAction;
    this.dirtifyItem();
  }

  mergeTicketAction(event: any) {
    if (!(this.selActions && this.selActions.length > 1)) {
      return;
    }

    // NEED to add to the FIRST CHOOSEN TicketAction, the ID's of all OTHER choosen actions
    // -----------------------------------------------------------------------------------
    const tmpAction: TicketAction = this.selActions[0];
    tmpAction.MergedItems = [];
    let action: TicketAction = null;

    for (let i = 1; i < this.selActions.length; i++) {
      action = this.selActions[i];
      tmpAction.MergedItems.push(action.ID);

      if (action.RowState === DataRowStates.ADDED) {
        const indx = this.ticketActions.findIndex((gAction: TicketAction) => action === gAction);
        if (indx > -1) {
          this.ticketActions.splice(indx, 1);
        }
      } else {
        action.RowState = DataRowStates.DELETED;
      }
    }
  }

  removeTicketAction(event: any) {
    if (!this.currAction) {
      return;
    }

    if (this.currAction.RowState === DataRowStates.ADDED) {
      const indx = this.ticketActions.findIndex((cause: TicketCause) => cause === this.currAction);
      if (indx > -1) {
        this.ticketActions.splice(indx, 1);
      }

      const indx2 = this._actionItems.findIndex((item: SelectItem) => item.value === this.currAction);
      if (indx2 > -1) {
        this._actionItems.splice(indx2, 1);
      }

      let flgDirty = false;
      this.ticketActions.forEach((cause: TicketCause) => {
        if (cause.RowState !== DataRowStates.UNCHANGED) {
          flgDirty = true;
        }
      });

      if (!flgDirty) {
        this.ticketCauses.forEach((cause: TicketCause) => {
          if (cause.RowState !== DataRowStates.UNCHANGED) {
            flgDirty = true;
          }
        });
      }

      if (!flgDirty) {
        this.Config.unDirtifyTab();
        this.isDirty = false;
      }
    } else {
      this.currAction.RowState = DataRowStates.DELETED;
      this.dirtifyItem();
    }
  }







  // Private "Helper" Methods
  // --------------------------
  private loadTicketCauses() {
    if (!(this.ticketCauses && this.ticketCauses.length > 0)) {
      return;
    }

    this._causeItems = new Array<SelectItem>();
    this.ticketCauses.forEach((cause: TicketCause) => {
      this._causeItems.push({ label: cause.Name, value: cause });
    });

    if (this._causeItems && this._causeItems.length > 0) {
      this._causeItems = ServiceHelper.sortArray(this._causeItems, 'label');
    }
  }

  private loadTicketActions() {
    if (!(this.ticketActions && this.ticketActions.length > 0)) {
      return;
    }

    this._actionItems = new Array<SelectItem>();
    this.ticketActions.forEach((action: TicketAction) => {
      this._actionItems.push({ label: action.Name, value: action });
    });

    if (this._actionItems && this._actionItems.length > 0) {
      this._actionItems = ServiceHelper.sortArray(this._actionItems, 'label');
    }
  }

  private setSelectedCause() {
    if (!(this._causeItems && this._causeItems.length > 0)) {
      return;
    }

    if (this.currCause) {
      const indx = this._causeItems.findIndex((itm: SelectItem) => itm.value.ID === this.currCause.ID);
      if (indx > -1) {
        this.currCause = this._causeItems[indx].value;
      }
    } else {
      this.currCause = this._causeItems[0].value;
    }

    this.selCauses = [this.currCause];
  }

  private setSelectedActions() {
    if (!(this._actionItems && this._actionItems.length > 0)) {
      return;
    }

    if (this.currAction) {
      const indx = this._actionItems.findIndex((itm: SelectItem) => itm.value.ID === this.currAction.ID);
      if (indx > -1) {
        this.currAction = this._actionItems[indx].value;
      }
    } else {
      this.currAction = this._actionItems[0].value;
    }

    this.selActions = [this.currAction];
  }
}

