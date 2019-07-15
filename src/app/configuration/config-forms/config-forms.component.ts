import { LogService } from './../../shared/services/log.service';
import { DataService } from './../../shared/services/data.service';
import { BaseConfigWidgetExtComponent } from '../base-config-widget/base-config-widgetExt.component';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { CheckForm } from '../../shared/types/checkForm';
import { CheckItem } from '../../shared/types/checkItem';
import { TopologyService } from '../../shared/services/topology.service';
import { RouteService } from '../../shared/services/route.service';
import { ConfigurationComponent } from '../configuration.component';
import { ServiceHelper } from '../../shared/services/serviceHelper';
import { DataRowStates } from '../../shared/data/enums/data-row-state.enum';
import { Actions } from '../../shared/data/constants/actions';
import { AuthService } from '../../shared/services/auth.service';






@Component({
  selector: 'app-config-forms',
  templateUrl: './config-forms.component.html',
  styleUrls: ['./config-forms.component.scss']
})
export class ConfigFormsComponent extends BaseConfigWidgetExtComponent<CheckForm> {

  checkItems: Array<CheckItem>;
  inheritedCheckItems: Array<CheckItem>;
  locCheckItems: Array<CheckItem>;








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
    this.DataNames = ['checkForms'];
    this.ExtraDataNames = ['checkItems', 'inheritedCheckItems'];
    this.SaveAct = Actions.SAVE_CHECK_FORMS;
  }










  // ----------------------------------
  // Overriding Base Class Operations
  // ----------------------------------
  protected afterDataRetrieve(extraData: any) {
    if (extraData) {
      this.checkItems = extraData['checkItems'];
      this.inheritedCheckItems = extraData['inheritedCheckItems'];
    }

    this.loadCheckItems();
  }

  protected saveExtraDirtyObjects() {
    if (!(this.extraDirtyObjects && this.extraDirtyObjects.length > 0)) {
      return;
    }

    this.loading = true;
    this.Logger.info(`Saving data for widget locations config items (CookingCycleRules) - LocationId: ${this.locationID}`);
    super.saveData();

    if (this.extraDirtyObjects.includes('rules')) {
    }
  }

  protected validate(): boolean {
    if (!super.validate()) {
      return false;
    }

    return this.validateCheckForms(this.EcsObjects);
  }









  // Event Handlers
  // --------------------------------
  addForm() {
    if (!this.validate()) {
      return;
    }

    const newCheckForm: CheckForm = new CheckForm();
    newCheckForm.Name = '';
    newCheckForm.Items = [];
    this.addEcsObject(newCheckForm);
  }


  getLableColor(checkForm: CheckForm) {
    return checkForm.RowState === DataRowStates.DELETED ? 0xCCCCCC : 0;
  }








  // Private "Helper" Methods
  // --------------------------
  private loadCheckItems() {
    if (!(this.checkItems && this.checkItems.length > 0) &&
      !(this.inheritedCheckItems && this.inheritedCheckItems.length > 0)) {
      return;
    }

    this.locCheckItems = [];
    this.locCheckItems.push.apply(this.locCheckItems, this.checkItems);
    this.locCheckItems.push.apply(this.locCheckItems, this.inheritedCheckItems);
    this.locCheckItems = ServiceHelper.sortArray(this.locCheckItems, 'Name');
  }


  private validateCheckForms(forms: Array<CheckForm>): boolean {
    let flg = true;
    if (forms && forms.length > 0) {
      forms.forEach((frm: CheckForm) => {
        if (flg && !this.iButtonRegExValidate(frm)) {
          this.loading = false;
          this.CurrECSObject = frm;
          flg = false;

          this.MsgService.clear();
          this.MsgService.add({
            severity: 'warn',
            summary: 'IButtonID Validation',
            detail: 'IButtonID is invalid'
          });
        }
      });
    }

    return flg;
  }


  private iButtonRegExValidate(checkForm: CheckForm): boolean {
    if (!(checkForm.IButtonID && checkForm.IButtonID.length > 0)) {
      return true;
    }

    //   const MACRegex = new RegExp(Formatter.REGEX_PHYSICAL_ID);
    //   const flg = MACRegex.test(checkForm.IButtonID);
    //   return MACRegex.test(checkForm.IButtonID);

    return true;
  }
}
