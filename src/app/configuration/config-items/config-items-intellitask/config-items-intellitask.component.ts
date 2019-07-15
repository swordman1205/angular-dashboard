import { TranslateService } from '@ngx-translate/core';
import { LogService } from '../../../shared/services/log.service';
import { DataService } from '../../../shared/services/data.service';
import { Component, Input } from '@angular/core';
import { CheckItem } from '../../../shared/types/checkItem';
import { BaseConfigItem } from '../../base-config-widget/base-config-item';
import { SelectItem, MessageService } from 'primeng/api';
import { CommonService } from '../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { CookingCycleTemplate } from '../../../shared/types/cookingCycleTemplate';
import { CookingCycleRule } from '../../../shared/types/cookingCycleRule';
import { ServiceHelper } from '../../../shared/services/serviceHelper';
import { DataRowStates } from '../../../shared/data/enums/data-row-state.enum';
import { parse } from 'url';
import { isNumber } from 'util';






@Component({
    selector: 'config-items-intellitask',
    templateUrl: './config-items-intellitask.component.html',
    styleUrls: ['./config-items-intellitask.component.scss']
})
export class ConfigItemIntelliTaskComponent extends BaseConfigItem {

    private _locID: number;
    private _checkItem: CheckItem;

    templates: Array<CookingCycleTemplate>;
    selTemplate: CookingCycleTemplate;
    rules: Array<CookingCycleRule>;
    selRule: CookingCycleRule;

    private getRulesSubscrp: Subscription;
    loading: boolean;
    flgDisplayDlg: boolean;







    constructor(logger: LogService,
        common: CommonService,
        translate: TranslateService,
        msgService: MessageService,
        data?: DataService) {
        super(logger, common, translate, msgService, data);
    }










    // Properties
    // -------------------------------------------
    @Input()
    set checkItem(chkItem: CheckItem) {
        this._checkItem = chkItem;
        if (this._checkItem) {
            if (!isNaN(+this._checkItem.BGColor)) {
                const colorUINT = parseInt(this._checkItem.BGColor, 10);
                this._checkItem.BGColor = '#' + colorUINT.toString(16);
            }

            this.loadCookingCycleRules();
        }
    }

    get checkItem(): CheckItem {
        return this._checkItem;
    }


    @Input()
    set locationID(locID: number) {
        if (locID !== this._locID) {
            this._locID = locID;
            if (this._locID > 0) {
                this.loadLocTemplates();
            }
        }
    }

    get locationID(): number {
        return this._locID;
    }






    // Data Manipulation
    // ------------------
    private loadLocTemplates() {
        this.loading = true;
        this.Logger.info(`Getting Location IntelliTask Templates for Location: ${this._locID}`);

        this.getDataSubscrp = this.Data.getLocCookingCycleTemplates(this._locID)
            .subscribe(
                res => {
                    this.templates = ServiceHelper.sortArray(res, 'Name');
                    // this.filterRecords();
                    this.loading = false;
                },
                err => {
                    this.Logger.error(`error in config Items IntelliTask tamplates ${err}`);
                    this.loading = false;
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }


    private loadCookingCycleRules() {
        this.loading = true;
        this.Logger.info(`Getting Location IntelliTask Templates for Location: ${this._locID}`);

        this.getRulesSubscrp = this.Data.getCookingCycleRules(this._checkItem.ID)
            .subscribe(
                res => {
                    this.rules = ServiceHelper.sortArray(res, 'Ordinal');
                    this._checkItem.Rules = this.rules;
                    this.loading = false;
                },
                err => {
                    this.Logger.error(`error in config Items IntelliTask rules ${err}`);
                    this.loading = false;
                },
                () => {
                    this.getRulesSubscrp.unsubscribe();
                });
    }









    // Event Handlers
    // ----------------------------------
    rowSelected(event) {
        const edtRule: CookingCycleRule = this.rules.find((rule: CookingCycleRule) => rule.NameInEdit === true);
        if (edtRule && edtRule.ID !== this.selRule.ID) {
            edtRule.NameInEdit = false;
        }
    }


    rowUnselected(event) {
        this.rules.forEach((rule: CookingCycleRule) => rule.NameInEdit = false);
    }


    setRuleNameEditMode(event: MouseEvent, cookRule: CookingCycleRule) {
        this.rules.forEach((rule: CookingCycleRule) => {
            if (cookRule.ID === rule.ID) {
                if (rule.NameInEdit) {
                    return;
                }
                rule.NameInEdit = true;
                this.selRule = rule;
            } else {
                rule.NameInEdit = false;
            }
        });

        event.preventDefault();
        event.stopPropagation();
    }


    dirtifyRule(event: MouseEvent, cookRule: CookingCycleRule) {
        if (cookRule.RowState === DataRowStates.UNCHANGED) {
            cookRule.RowState = DataRowStates.MODIFIED;
            // tab.rightIcon = 'fa fa-exclamation';
            this.onDirtify('rules');
        }
    }


    addRule(event) {
        if (this.selTemplate) {
            const newRule: CookingCycleRule = new CookingCycleRule();

            if (!this._checkItem.Rules) {
                this._checkItem.Rules = this.rules = [];
            }

            newRule.CheckItemID = this._checkItem.ID;
            newRule.StartTemperature = this.selTemplate.StartTemperature;
            newRule.MarkTemperature = this.selTemplate.MarkTemperature;
            newRule.Timespan = this.selTemplate.Timespan;
            newRule.Name = this.selTemplate.Name;
            newRule.Ordinal = this._checkItem.Rules.length;
            newRule.TemplateID = this.selTemplate.ID;
            newRule.Unit = this.selTemplate.Unit;
            newRule.RowState = DataRowStates.ADDED;

            this.rules.push(newRule);
            this.selRule = this.rules[this.rules.length - 1];
            this.onDirtify('rules');
        }
    }


    removeRule(event) {
        if (this.selRule) {
            if (this.selRule.ID > 0) {
                this.selRule.RowState = DataRowStates.DELETED;

                if (!this._checkItem.DeletedRules) {
                    this._checkItem.DeletedRules = [];
                }

                this._checkItem.DeletedRules.push(this.selRule);
            }

            this.rules.splice(this.selRule.Ordinal, 1);

            for (let indx = 0; indx < this.rules.length; indx++) {
                if (this.rules[indx].Ordinal !== indx) {
                    this.rules[indx].Ordinal = indx;
                    this.rules[indx].RowState = DataRowStates.MODIFIED;
                }
            }

            this.onDirtify('rules');
        }
    }


    moveUp(event) {
        if (this.selRule && this.selRule.Ordinal > 0) {
            this.rules.forEach((rule: CookingCycleRule) => {
                if (rule.Ordinal === this.selRule.Ordinal - 1) {
                    rule.Ordinal = rule.Ordinal + 1;
                    rule.RowState = DataRowStates.MODIFIED;

                    this.selRule.Ordinal = this.selRule.Ordinal - 1;
                    this.selRule.RowState = DataRowStates.MODIFIED;
                }
            });

            ServiceHelper.sortArray(this.rules, 'Ordinal');
            this.onDirtify('rules');
        }
    }

    moveDown(event) {
        if (this.selRule && this.selRule.Ordinal < this.rules.length - 1) {
            this.rules.forEach((rule: CookingCycleRule) => {
                if (rule.Ordinal === this.selRule.Ordinal + 1) {
                    rule.Ordinal = rule.Ordinal - 1;
                    rule.RowState = DataRowStates.MODIFIED;

                    this.selRule.Ordinal = this.selRule.Ordinal + 1;
                    this.selRule.RowState = DataRowStates.MODIFIED;
                }
            });

            ServiceHelper.sortArray(this.rules, 'Ordinal');
            this.onDirtify('rules');
        }
    }
}
