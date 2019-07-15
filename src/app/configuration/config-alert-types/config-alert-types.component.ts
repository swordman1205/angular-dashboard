import { LogService } from './../../shared/services/log.service';
import { DataService } from './../../shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../shared/services/common.service';
import { SelectItem, MessageService } from 'primeng/api';
import { AlertType } from '../../shared/types/alertType';
import { TopologyService } from '../../shared/services/topology.service';
import { RouteService } from '../../shared/services/route.service';
import { ConfigurationComponent } from '../configuration.component';
import { DataRowStates } from '../../shared/data/enums/data-row-state.enum';
import { ServiceHelper } from '../../shared/services/serviceHelper';
import { BaseConfigWidgetExtComponent } from '../base-config-widget/base-config-widgetExt.component';
import { Actions } from '../../shared/data/constants/actions';
import { AuthService } from '../../shared/services/auth.service';




@Component({
  selector: 'app-config-alert-types',
  templateUrl: './config-alert-types.component.html',
  styleUrls: ['./config-alert-types.component.scss']
})
export class ConfigAlertTypesComponent extends BaseConfigWidgetExtComponent<AlertType> implements OnInit {

  alarmDelayH: number;
  alarmDelayM: number;
  sendIntrlH: number;
  sendIntrlM: number;
  alarmDuratH: number;
  alarmDuratM: number;






  constructor(router: RouteService,
    topology: TopologyService,
    data: DataService,
    logger: LogService,
    translate: TranslateService,
    msgService: MessageService,
    config: ConfigurationComponent,
    auth: AuthService) {
    super(router, topology, data, logger, translate, msgService, config, auth);

    this.LabelBy = 'Name';
    this.SortBy = 'Name';
    this.DataNames = ['alertTypes'];
    this.ExtraDataNames = null;
    this.SaveAct = Actions.SAVE_ALERT_TYPES;
  }







  // LifeCycle Hooks
  // ---------------------
  ngOnInit() {
    super.ngOnInit();
    this.ecsObjectChanged.subscribe(
      event => {
        this.alarmDelayH = Math.floor(this.CurrECSObject.AlarmDelay / 60);
        this.alarmDelayM = this.CurrECSObject.AlarmDelay % 60;
        this.sendIntrlH = Math.floor(this.CurrECSObject.SendInterval / 60);
        this.sendIntrlM = this.CurrECSObject.SendInterval % 60;
        this.alarmDuratH = Math.floor(this.CurrECSObject.AlarmDuration / 60);
        this.alarmDuratM = this.CurrECSObject.AlarmDuration % 60;
      }
    );
  }



  // Event Handlers
  // --------------------------------
  alarmDelayChanged(event) {
    if (this.CurrECSObject) {
      this.CurrECSObject.AlarmDelay = this.alarmDelayH * 60 + this.alarmDelayM;
      this.dirtifyItem();
    }
  }


  sendIntrvlChanged(event) {
    if (this.CurrECSObject) {
      this.CurrECSObject.SendInterval = this.sendIntrlH * 60 + this.sendIntrlM;
      this.dirtifyItem();
    }
  }


  alarmDuratChanged(event) {
    if (this.CurrECSObject) {
      this.CurrECSObject.AlarmDuration = this.alarmDuratH * 60 + this.alarmDuratM;
      this.dirtifyItem();
    }
  }


  addAlertType(event) {
    if (!this.validate()) {
      return;
    }

    const newAlrtType: AlertType = new AlertType();
    newAlrtType.Name = '';
    newAlrtType.AlarmDelay = 0;
    newAlrtType.SendInterval = 60;
    newAlrtType.AlarmDuration = 180;
    newAlrtType.AssetsAlarms = true;
    newAlrtType.DevicesAlarms = true;
    newAlrtType.PreventiveMaintenance = true;
    newAlrtType.RoutersAlarms = true;
    this.addEcsObject(newAlrtType);
  }

}
