import { LogService } from './../../shared/services/log.service';
import { DataService } from './../../shared/services/data.service';
import { BaseConfigWidgetExtComponent } from '../base-config-widget/base-config-widgetExt.component';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../shared/services/common.service';
import { CookingCycleTemplate } from '../../shared/types/cookingCycleTemplate';
import { TopologyService } from '../../shared/services/topology.service';
import { RouteService } from '../../shared/services/route.service';
import { ConfigurationComponent } from '../configuration.component';
import { MessageService, SelectItem } from 'primeng/api';
import { Actions } from '../../shared/data/constants/actions';
import { MeasureUnit } from '../../shared/types/measureUnit';
import { AuthService } from '../../shared/services/auth.service';






@Component({
  selector: 'app-config-intellitasks',
  templateUrl: './config-intellitasks.component.html',
  styleUrls: ['./config-intellitasks.component.scss']
})
export class ConfigIntelliTasksComponent extends BaseConfigWidgetExtComponent<CookingCycleTemplate> implements OnInit {

  editTemplt: CookingCycleTemplate = new CookingCycleTemplate();
  optUnits: Array<SelectItem>;
  selUnit: MeasureUnit;

  cookinCycCols = [
    // { field: 'icon', header: '' },
    { field: 'Name', header: 'Name' },
    { field: 'StartTemperature', header: 'Start Temperature' },
    { field: 'MarkTemperature', header: 'Mark Temperature' },
    { field: 'UnitName', header: 'Unit' },
    { field: 'Timespan', header: 'Time Span' }
  ];






  constructor(router: RouteService,
    topology: TopologyService,
    data: DataService,
    logger: LogService,
    translate: TranslateService,
    msgService: MessageService,
    config: ConfigurationComponent,
    auth: AuthService,
    common: CommonService) {
    super(router, topology, data, logger, translate, msgService, config, auth, common);

    this.LabelBy = 'Name';
    this.SortBy = 'Name';
    this.DataNames = null;
    this.ExtraDataNames = null;
    this.DataFunctionBag = { Func: this.Data.getLocCookingCycleTemplates, ParamProps: ['locationID'] };
    this.SaveAct = Actions.SAVE_LOCATION_COOKING_CYCLE_TEMPLATES;
  }









  // LifeCycle Hooks
  // ---------------------
  ngOnInit() {
    super.ngOnInit();

    this.ecsObjectChanged.subscribe(
      event => {
        if (this.CurrECSObject) {
          this.editTemplt.Name = this.CurrECSObject.Name;
          this.editTemplt.StartTemperature = this.CurrECSObject.StartTemperature;
          this.editTemplt.MarkTemperature = this.CurrECSObject.MarkTemperature;
          this.editTemplt.Timespan = this.CurrECSObject.Timespan;

          if (this.optUnits && this.optUnits.length > 0) {
            const unit = this.optUnits.find((element: SelectItem) => this.CurrECSObject.Unit.ID === element.value.ID);
            this.selUnit = unit.value;
          }
        } else {
          this.editTemplt.Name = '';
          this.editTemplt.StartTemperature = null;
          this.editTemplt.MarkTemperature = null;
          this.editTemplt.Timespan = null;
        }
      });
  }








  // ----------------------------------
  // Overriding Base Class Operations
  // ----------------------------------
  afterDataRetrieve(extraData: any) {
    this.EcsObjects.forEach((template: CookingCycleTemplate) => {
      template.UnitName = this.Common.getMeasureUnit(template.Unit.ID).Name;
    });

    this.optUnits = [];
    this.Common.commonData.MeasuresUnits.forEach((measrUnit: MeasureUnit) => {
      if (measrUnit.Name === 'F' || measrUnit.Name === 'C') {
        this.optUnits.push({ label: measrUnit.Name, value: measrUnit });
      }
    });

    if (this.optUnits && this.optUnits.length > 0) {
      const unit = this.optUnits.find((element: SelectItem) => this.CurrECSObject.Unit.ID === element.value.ID);
      this.selUnit = unit.value;
    }
  }











  // Event Handlers
  // ------------------------------
  updateTemplate() {
    if (!this.validateselTemplt()) {
      return;
    }

    this.CurrECSObject.Name = this.editTemplt.Name;
    this.CurrECSObject.StartTemperature = this.editTemplt.StartTemperature;
    this.CurrECSObject.MarkTemperature = this.editTemplt.MarkTemperature;
    this.CurrECSObject.Timespan = this.editTemplt.Timespan;
    this.CurrECSObject.Unit = this.selUnit;
    this.dirtifyItem();
  }

  addTemplate() {
    if (!this.validateselTemplt()) {
      return;
    }

    const newTemplt: CookingCycleTemplate = new CookingCycleTemplate();
    newTemplt.Name = this.editTemplt.Name;
    newTemplt.LocationID = this.locationID;
    newTemplt.StartTemperature = this.editTemplt.StartTemperature;
    newTemplt.MarkTemperature = this.editTemplt.MarkTemperature;
    newTemplt.Timespan = this.editTemplt.Timespan;
    newTemplt.Unit = this.selUnit;
    this.addEcsObject(newTemplt);
  }

  deleteTemplate(event, template: CookingCycleTemplate) {
    this.CurrECSObject = template;
    this.MsgService.clear();
    this.MsgService.add({
      key: 'confirmDialg',
      sticky: true,
      severity: 'warn',
      summary: 'INTELLITASKS.DEL_TEMP_TITLE',
      detail: 'INTELLITASKS.DEL_TEMP_MSG',
      data: {
        this: this,
        onConfirm: () => {
          this.MsgService.clear('confirmDialg');
          this.removeEcsObject(event);
        },
        onReject: () => {
          this.MsgService.clear('confirmDialg');

        }
      }
    });
  }






  // Private "Helper" Methods
  // ------------------------------
  private validateselTemplt(): boolean {
    return true;

    // for each(var temp:CookingCycleTemplate in this._arrTemplates.source)
    // 		{
    // 			if(temp.Name == txtName.text)
    // 			{
    // 				Alert.show(resourceManager.getString('Configuration','CookingCyclesConfig.btnInsertTemplateClickHandler.text'),
    // 					resourceManager.getString('Configuration','CookingCyclesConfig.btnInsertTemplateClickHandler.title'), 4, this);

    // 				txtName.setFocus();
    // 				return;
    // 			}
    // 		}

    // 		if(txtTimeSpanMinutes.value <= 1)
    // 		{
    // 			Alert.show(resourceManager.getString('Configuration','CookingCyclesConfig.btnInsertTemplateClickHandler2.text'),
    // 				resourceManager.getString('Configuration','CookingCyclesConfig.btnInsertTemplateClickHandler2.title'));

    // 			txtTimeSpanMinutes.setFocus();
    // 			return;
    // 		}
  }
}
