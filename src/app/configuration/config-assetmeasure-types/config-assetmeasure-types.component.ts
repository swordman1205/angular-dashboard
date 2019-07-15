import { LogService } from './../../shared/services/log.service';
import { DataService } from './../../shared/services/data.service';
import { BaseConfigWidgetExtComponent } from '../base-config-widget/base-config-widgetExt.component';
import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../shared/services/common.service';
import { AssetMeasureType } from '../../shared/types/assetMeasureType';
import { TopologyService } from '../../shared/services/topology.service';
import { RouteService } from '../../shared/services/route.service';
import { ConfigurationComponent } from '../configuration.component';
import { ServiceHelper } from '../../shared/services/serviceHelper';
import { DataRowStates } from '../../shared/data/enums/data-row-state.enum';
import { Measures } from '../../shared/data/constants/measures';
import { Actions } from '../../shared/data/constants/actions';
import { MeasureUnit } from '../../shared/types/measureUnit';
import { Measure } from '../../shared/types/measure';
import { Ports } from '../../shared/data/constants/ports';
import { AuthService } from '../../shared/services/auth.service';




@Component({
  selector: 'app-config-assetmeasure-types',
  templateUrl: './config-assetmeasure-types.component.html',
  styleUrls: ['./config-assetmeasure-types.component.scss']
})
export class ConfigAssetMeasureTypesComponent extends BaseConfigWidgetExtComponent<AssetMeasureType> implements OnInit {

  isAnalogPort: boolean;
  isDigitalMeasure: boolean;
  optMeasureTypes: Array<SelectItem>;
  selMeasure: Measure;
  optMeasureUnits: Array<SelectItem>;
  selMeasureUnit: MeasureUnit;
  optAlarmOn: Array<SelectItem>;
  selAlrmOn: string;








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
    this.DataNames = ['assetMeasureTypes'];
    this.ExtraDataNames = null;
    this.SaveAct = Actions.SAVE_LOCATION_ASSETMEASURE_TYPES;
  }





  // LifeCycle Hooks
  // ---------------------
  ngOnInit() {
    super.ngOnInit();

    this.ecsObjectChanged.subscribe(
      (event: any) => {
        // Set the Relevant Measure Type option for the current ASM Type
        const indx = this.optMeasureTypes.findIndex((item: SelectItem) => this.CurrECSObject.MeasureID === item.value.ID);
        if (indx > -1) {
          this.selMeasure = this.optMeasureTypes[indx].value;
        } else {
          this.selMeasure = this.optMeasureTypes[0].value;
        }

        this.isAnalogPort = (this.selMeasure.PortID === Ports.ANALOG);
        this.isDigitalMeasure = (this.CurrECSObject.MeasureID === Measures.DIGITAL);

        this.optAlarmOn = [
          { label: this.CurrECSObject.TrueString, value: this.CurrECSObject.TrueString },
          { label: this.CurrECSObject.FalseString, value: this.CurrECSObject.FalseString }
        ];

        this.selAlrmOn = this.CurrECSObject.AlarmDigital ?
          this.optAlarmOn[0].value :
          this.optAlarmOn[1].value;

        this.optMeasureUnits = [];
        this.Common.commonData.MeasuresUnits.forEach((unit: MeasureUnit) => {
          this.optMeasureUnits.push({ label: unit.Name, value: unit });
        });

        this.updateMeasureUnit();
      }
    );

    this.optMeasureTypes = [];
    this.Common.commonData.Measures.forEach((measure: Measure) => {
      this.optMeasureTypes.push({ label: measure.Name, value: measure });
    });
  }







  // Event Handlers
  // ---------------------
  addAsmType(event) {
    if (!this.validate()) {
      return;
    }

    const newAsmType: AssetMeasureType = new AssetMeasureType();
    newAsmType.Name = '';
    newAsmType.MeasureID = Measures.TEMPERATURE;
    newAsmType.MeasureUnitID = this.Common.getDefaultMeasureUnitID(newAsmType.MeasureID);
    newAsmType.Precision = 1;
    newAsmType.TrueString = 'True';
    newAsmType.FalseString = 'False';
    newAsmType.AlarmHigh = 0;
    newAsmType.WarningHigh = 0;
    newAsmType.WarningLow = 0;
    newAsmType.AlarmLow = 0;
    this.addEcsObject(newAsmType);
  }

  measureChanaged(event) {
    this.CurrECSObject.MeasureID = this.selMeasure.ID;

    this.isAnalogPort = (this.selMeasure.PortID === Ports.ANALOG);
    this.isDigitalMeasure = (this.CurrECSObject.MeasureID === Measures.DIGITAL);

    this.CurrECSObject.MeasureUnitID = 0;
    const defaultMeasureUnit: MeasureUnit = this.Common.getDefaultMeasureUnit(this.CurrECSObject.MeasureID);
    if (defaultMeasureUnit) {
      this.CurrECSObject.MeasureUnitID = defaultMeasureUnit.ID;
    }

    this.updateMeasureUnit();
    this.dirtifyItem();
  }

  measuresUnitChange(event) {
    this.CurrECSObject.MeasureUnitID = this.selMeasureUnit.ID;
    this.dirtifyItem();
  }

  alarmDigitChange(event) {
    this.CurrECSObject.AlarmDigital = (this.selAlrmOn === this.CurrECSObject.TrueString ? true : false);
    this.dirtifyItem();
  }






  // Overloading Base class methods
  // --------------------------
  protected validate(): boolean {
    if (!super.validate()) {
      return false;
    }

    // Validate Values
    let flg = true;
    let isValid = true;
    let measureType: AssetMeasureType = null;
    for (let indx = 0; indx < this.EcsObjects.length && flg; indx++) {
      measureType = this.EcsObjects[indx] as AssetMeasureType;

      if (measureType.MeasureID === Measures.TEMPERATURE ||
        measureType.MeasureID === Measures.FAN_SPEED ||
        measureType.MeasureID === Measures.CURRENT ||
        measureType.MeasureID === Measures.HUMIDITY ||
        measureType.MeasureID === Measures.VOLTAGE) {
        if (!(measureType.WarningHigh < measureType.AlarmHigh)) {
          this.MsgService.add({
            severity: 'warn',
            summary: measureType.Name + ' ' + this.Translate.instant('CONFIG_ASM_TYPES.TITLES.WARN_WAEN_HIGH_TITLE'),
            detail: this.Translate.instant('TCONFIG_ASM_TYPES.MESSAGES.WARN_WAEN_HIGH_MSG')
          });

          flg = false;
          isValid = false;
        }


        if (!(measureType.WarningLow < measureType.WarningHigh)) {
          this.MsgService.add({
            severity: 'warn',
            summary: measureType.Name + ' ' + this.Translate.instant('CONFIG_ASM_TYPES.TITLES.WARN_HIGH_LOW_TITLE'),
            detail: this.Translate.instant('TCONFIG_ASM_TYPES.MESSAGES.WARN_HIGH_LOW_MSG')
          });

          flg = false;
          isValid = false;
        }

        if (!(measureType.AlarmLow < measureType.AlarmHigh)) {
          this.MsgService.add({
            severity: 'warn',
            summary: measureType.Name + ' ' + this.Translate.instant('CONFIG_ASM_TYPES.TITLES.ALARM_HIGH_LOW_TITLE'),
            detail: this.Translate.instant('TCONFIG_ASM_TYPES.MESSAGES.ALARM_HIGH_LOW_MSG')
          });

          flg = false;
          isValid = false;
        }

        if (!(measureType.AlarmLow < measureType.WarningLow)) {
          this.MsgService.add({
            severity: 'warn',
            summary: measureType.Name + ' ' + this.Translate.instant('CONFIG_ASM_TYPES.TITLES.WARN_LOW_ALARM_LOW_TITLE'),
            detail: this.Translate.instant('TCONFIG_ASM_TYPES.MESSAGES.WARN_LOW_ALARM_LOW_MSG')
          });

          flg = false;
          isValid = false;
        }
      }
    }

    return isValid;
  }






  // Private "Helper" Methods
  // ---------------------------------
  private updateMeasureUnit() {
    if (!this.CurrECSObject || this.CurrECSObject.MeasureID === 0) {
      return;
    }

    const measureUnit: MeasureUnit = this.CurrECSObject.MeasureUnitID === 0 ?
      this.Common.getDefaultMeasureUnit(this.CurrECSObject.MeasureID) :
      this.Common.getMeasureUnit(this.CurrECSObject.MeasureUnitID);

    if (!measureUnit) {
      return;
    }

    this.setSelMeasureUnit(measureUnit.ID);
  }


  private setSelMeasureUnit(measureUnitID: number): void {
    const indx = this.optMeasureUnits.findIndex((item: SelectItem) => item.value.ID === measureUnitID);
    if (indx > -1) {
      this.selMeasureUnit = this.optMeasureUnits[indx].value;
    } else {
      this.selMeasureUnit = this.optMeasureUnits[0].value;
    }
  }
}
