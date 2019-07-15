import { Component, Input } from '@angular/core';
import { BaseConfigItem } from '../../base-config-widget/base-config-item';
import { CheckForm } from '../../../shared/types/checkForm';
import { LogService } from '../../../shared/services/log.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../../shared/services/data.service';
import { CommonService } from '../../../shared/services/common.service';
import { DataRowStates } from '../../../shared/data/enums/data-row-state.enum';
import { MessageService } from 'primeng/api';





@Component({
    selector: 'config-forms-info',
    templateUrl: './config-forms-info.component.html',
    styleUrls: ['./config-forms-info.component.scss']
})
export class ConfigFormsInfoComponent extends BaseConfigItem {

    private _form: CheckForm;
    rowStates = DataRowStates;






    constructor(logger: LogService,
        translate: TranslateService,
        common: CommonService,
        msgService: MessageService,
        data: DataService) {
        super(logger, common, translate, msgService, data);
    }








    // Properties
    // -------------------------------------------

    @Input()
    set form(frm: CheckForm) {
        this._form = frm;
        if (this._form) {
        }
    }

    get form(): CheckForm {
        return this._form;
    }






    // Internal "Helper" Methods
    // ----------------------------------
    getiButtonMask(): string {
        if (this._form) {
            return '**:**:**:**:**:**';
        } else {
            return '';
        }
    }


    formiButtonChanged(val: string) {
        if (!this._form) {
            return;
        }

        this._form.IButtonID = val.replace(/[\:\_]/g, '');
        if (this._form.IButtonID === '') {
            this._form.IButtonID = null;
        }

        this.onDirtify();
    }

}
