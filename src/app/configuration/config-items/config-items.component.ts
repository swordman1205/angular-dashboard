import { DataRowStates } from './../../shared/data/enums/data-row-state.enum';
import { LogService } from './../../shared/services/log.service';
import { DataService } from './../../shared/services/data.service';
import { BaseConfigWidgetExtComponent } from '../base-config-widget/base-config-widgetExt.component';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { CheckItem } from '../../shared/types/checkItem';
import { CheckStep } from '../../shared/types/checkStep';
import { CheckThreshold } from '../../shared/types/checkThreshold';
import { CheckChoice } from '../../shared/types/checkChoice';
import { TopologyService } from '../../shared/services/topology.service';
import { RouteService } from '../../shared/services/route.service';
import { ConfigurationComponent } from '../configuration.component';
import { ServiceHelper } from '../../shared/services/serviceHelper';
import { CheckItemStep } from '../../shared/types/checkItemStep';
import { CHECK_ITEM_DIALOG_TYPE } from './config-items-steps/config-items-steps.component';
import { CookingCycleRule } from '../../shared/types/cookingCycleRule';
import { Actions } from '../../shared/data/constants/actions';
import { AuthService } from '../../shared/services/auth.service';






@Component({
    selector: 'app-config-items',
    templateUrl: './config-items.component.html',
    styleUrls: ['./config-items.component.scss']
})
export class ConfigItemsComponent extends BaseConfigWidgetExtComponent<CheckItem> {

    checkSteps: Array<CheckStep>;
    inheritedCheckSteps: Array<CheckStep>;
    locCheckSteps: Array<CheckStep>;

    checkThresholds: Array<CheckThreshold>;
    inheritedCheckThresholds: Array<CheckThreshold>;
    locThresholds: Array<CheckThreshold>;

    checkChoices: Array<CheckChoice>;
    inheritedCheckChoices: Array<CheckChoice>;
    locChoices: Array<CheckChoice>;





    constructor(
        router: RouteService,
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
        this.DataNames = ['checkItems'];
        this.ExtraDataNames = ['checkSteps',
            'inheritedCheckSteps',
            'checkThresholds',
            'inheritedCheckThresholds',
            'checkChoices',
            'inheritedCheckChoices'];
        this.SaveAct = Actions.SAVE_CHECK_ITEMS;
    }













    // Event Handlers
    // --------------------------------
    addCheckItem() {
        if (!this.validate()) {
            return;
        }

        const newCheckItem: CheckItem = new CheckItem();
        newCheckItem.Name = '';
        newCheckItem.Steps = [];
        newCheckItem.RowState = DataRowStates.ADDED;
        this.addEcsObject(newCheckItem);
    }


    copyCheckItem() {
        const newCheckItem: CheckItem = this.CurrECSObject.clone();
        newCheckItem.ID = 0;
        newCheckItem.RowState = DataRowStates.ADDED;

        newCheckItem.Steps.forEach((step: CheckItemStep) => {
            step.ID = 0;
            step.CheckItemID = 0;
            step.RowState = DataRowStates.ADDED;
        });

        this.addEcsObject(newCheckItem);
    }


    refreshObjects(dialogType: string) {
        this.loading = true;
        this.Logger.info(`Refreshing CheckSteps data for widget locations config items - LocationId: ${this.locationID}`);
        super.getData();

        switch (dialogType) {
            case CHECK_ITEM_DIALOG_TYPE.CHECK_STEPS: {
                this.refreshSteps();
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_THRESHOLDS: {
                this.refreshThresholds();
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_CHOICES: {
                this.refreshChoices();
                break;
            }
        }

    }


    saveObjects(dialogType: string) {
        this.loading = true;
        this.Logger.info(`Saving data for widget locations config devices - LocationId: ${this.locationID}`);

        switch (dialogType) {
            case CHECK_ITEM_DIALOG_TYPE.CHECK_STEPS: {
                if (!this.validateAdditionalItems(this.checkSteps, 'Name')) {
                    this.loading = false;
                    return;
                }

                this.saveSteps();
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_THRESHOLDS: {
                if (!this.validateAdditionalItems(this.checkThresholds, 'Name')) {
                    this.loading = false;
                    return;
                }

                this.saveThresholds();
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_CHOICES: {
                if (!this.validateAdditionalItems(this.checkChoices, 'Name')) {
                    this.loading = false;
                    return;
                }

                this.saveChoices();
                break;
            }
        }
    }


    removeObject(data: any) {
        switch (data.dialogType) {
            case CHECK_ITEM_DIALOG_TYPE.CHECK_STEPS: {
                const step: CheckStep = <CheckStep>(data.ECSObject);
                if (step.RowState === DataRowStates.ADDED) {
                    const indx = this.checkSteps.findIndex((chkStep: CheckStep) => step.ID === chkStep.ID);
                    this.checkSteps.splice(indx, 1);
                } else {
                    step.RowState = DataRowStates.DELETED;
                }

                this.loadSteps();
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_THRESHOLDS: {
                const threshold: CheckThreshold = <CheckThreshold>(data.ECSObject);

                this.loadThresholds();
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_CHOICES: {
                const choice: CheckChoice = <CheckChoice>(data.ECSObject);

                this.loadSteps();
                break;
            }
        }
    }


    addObject(data: any) {
        switch (data.dialogType) {
            case CHECK_ITEM_DIALOG_TYPE.CHECK_STEPS: {
                const step: CheckStep = <CheckStep>(data.ECSObject);
                this.checkSteps.push(step);
                this.loadSteps();

                this.dirtifyItem();
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_THRESHOLDS: {
                const threshold: CheckThreshold = <CheckThreshold>(data.ECSObject);
                this.checkThresholds.push(threshold);
                this.loadThresholds();

                this.dirtifyItem();
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_CHOICES: {
                const choice: CheckChoice = <CheckChoice>(data.ECSObject);
                this.checkChoices.push(choice);
                this.loadcheckChoices();

                this.dirtifyItem();
                break;
            }
        }
    }


    updateList(dialogType: string) {
        switch (dialogType) {
            case CHECK_ITEM_DIALOG_TYPE.CHECK_STEPS: {
                this.loadSteps();
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_THRESHOLDS: {
                this.loadThresholds();
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_CHOICES: {
                this.loadcheckChoices();
                break;
            }
        }
    }









    // ----------------------------------
    // Overriding Base Class Operations
    // ----------------------------------
    protected afterDataRetrieve(extraData: any) {
        if (extraData) {
            this.checkSteps = extraData['checkSteps'];
            this.inheritedCheckSteps = extraData['inheritedCheckSteps'];
            this.checkThresholds = extraData['checkThresholds'];
            this.inheritedCheckThresholds = extraData['inheritedCheckThresholds'];
            this.checkChoices = extraData['checkChoices'];
            this.inheritedCheckChoices = extraData['inheritedCheckChoices'];
        }

        this.loadSteps();
        this.loadThresholds();
        this.loadcheckChoices();
    }


    protected beforeDataSave(dirtyCheckItems: Array<CheckItem>) {
        if (dirtyCheckItems && dirtyCheckItems.length > 0) {
            dirtyCheckItems.forEach((checkItm: CheckItem) => {
                if (checkItm.BGColor && checkItm.BGColor.startsWith('#')) {
                    checkItm.BGColor = checkItm.BGColor.substring(1);
                    checkItm.BGColor = parseInt(checkItm.BGColor, 16).toString();
                }
            });
        }
    }

    protected saveExtraDirtyObjects() {
        if (!(this.extraDirtyObjects && this.extraDirtyObjects.length > 0)) {
            this.loading = false;
            this.Config.unDirtifyTab();
            return;
        }

        this.loading = true;
        this.Logger.info(`Saving data for widget locations config items (CookingCycleRules) - LocationId: ${this.locationID}`);

        if (this.extraDirtyObjects.includes('rules')) {

            // Find Dirty Location Steps
            // ------------------
            const dirtyRules = [];
            this.EcsObjects.forEach((chkItem: CheckItem) => {
                if (chkItem.Rules && chkItem.Rules.length > 0) {
                    chkItem.Rules.forEach((rule: CookingCycleRule) => {
                        if (rule.RowState !== DataRowStates.UNCHANGED) {
                            rule.CheckItemID = chkItem.ID;
                            dirtyRules.push(rule);
                        }
                    });
                }

                if (chkItem.DeletedRules && chkItem.DeletedRules.length > 0) {
                    dirtyRules.push.apply(dirtyRules, chkItem.DeletedRules);
                }
            });


            // Update Dirty Items
            // ----------------------------------
            if (dirtyRules.length > 0) {
                this.saveDataSubscrp = this.Data.saveCookingCycleRules(dirtyRules)
                    .subscribe(
                        res => {
                            let ruleIndx = -1;
                            let chkItem: CheckItem = null;

                            this.Logger.info('Location CookingCycleRules were updated to the ECS Server. Location ID: ' + this.locationID);
                            res.forEach((rule: CookingCycleRule) => {
                                chkItem = this.EcsObjects.find((itm: CheckItem) => rule.CheckItemID === itm.ID);
                                if (chkItem) {
                                    ruleIndx = chkItem.Rules.findIndex((chkRule: CookingCycleRule) => chkRule.ID === rule.ID);
                                    if (ruleIndx >= 0) {
                                        chkItem.Rules[ruleIndx] = rule;
                                    }
                                }
                            });

                            this.EcsObjects.forEach((itm: CheckItem) => {
                                itm.DeletedRules = null;
                            });

                            // const indx = this.extraDirtyObjects.findIndex((elmnt) => elmnt === 'rules');
                            // if (indx >= 0) {
                            //   this.extraDirtyObjects.splice(indx);
                            // }
                            this.extraDirtyObjects = null;
                        },
                        err => {
                            this.Logger.error(`error in saving CookingCycleRules check items ${err}`);
                            this.loading = false;

                            this.MsgService.clear();
                            this.MsgService.add({
                                severity: 'error',
                                summary: 'Check Items Additional Data Update',
                                detail: 'Updating Location additional Check Item Data has failed'
                            });
                        },
                        () => {
                            this.saveDataSubscrp.unsubscribe();

                            this.loading = false;
                            this.Config.unDirtifyTab();
                            this.isDirty = false;

                            this.MsgService.clear();
                            this.MsgService.add({
                                severity: 'success',
                                summary: 'Check Items Additional Data Update',
                                detail: 'Updating Location additional Check Item Data was successful'
                            });
                        }
                    );
            }
        }
    }





    // Private "Helper" Methods
    // --------------------------
    private loadSteps() {
        if (!(this.checkSteps && this.checkSteps.length > 0) &&
            !(this.inheritedCheckSteps && this.inheritedCheckSteps.length > 0)) {
            return;
        }

        this.locCheckSteps = [];
        this.locCheckSteps.push.apply(this.locCheckSteps, this.checkSteps);
        this.locCheckSteps.push.apply(this.locCheckSteps, this.inheritedCheckSteps);
        this.locCheckSteps = ServiceHelper.sortArray(this.locCheckSteps, 'Name');
    }


    private loadThresholds() {
        if (!(this.checkThresholds && this.checkThresholds.length > 0) &&
            !(this.inheritedCheckThresholds && this.inheritedCheckThresholds.length > 0)) {
            return;
        }

        this.locThresholds = [];
        this.locThresholds.push.apply(this.locThresholds, this.checkThresholds);
        this.locThresholds.push.apply(this.locThresholds, this.inheritedCheckThresholds);
        // this.locThresholds = ServiceHelper.sortArray(this.locThresholds, 'Name');
    }


    private loadcheckChoices() {
        if (!(this.checkChoices && this.checkChoices.length > 0) &&
            !(this.inheritedCheckChoices && this.inheritedCheckChoices.length > 0)) {
            return;
        }

        this.locChoices = [];
        this.locChoices.push.apply(this.locChoices, this.checkChoices);
        this.locChoices.push.apply(this.locChoices, this.inheritedCheckChoices);
        this.locChoices = ServiceHelper.sortArray(this.locChoices, 'Name');

    }


    private refreshSteps() {
        this.getDataSubscrp = this.Data.getLocationData(this.locationID, ['checkSteps'])
            .subscribe(
                res => {
                    this.checkSteps = res['checkSteps'];
                    this.loadSteps();
                    // this.setSelItems();
                    this.loading = false;
                },
                err => {
                    this.Logger.error(`error in config location items >> steps ${err}`);
                    this.loading = false;
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }


    private refreshThresholds() {
        this.getDataSubscrp = this.Data.getLocationData(this.locationID, ['checkThresholds'])
            .subscribe(
                res => {
                    this.checkThresholds = res['checkThresholds'];
                    this.loadThresholds();
                    // this.setSelItems();

                    this.loading = false;
                },
                err => {
                    this.Logger.error(`error in config location items >> thresholds ${err}`);
                    this.loading = false;
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }


    private refreshChoices() {
        this.getDataSubscrp = this.Data.getLocationData(this.locationID, ['checkChoices'])
            .subscribe(
                res => {
                    this.checkChoices = res['checkChoices'];
                    this.loadThresholds();
                    // this.setSelItems();
                    this.loading = false;
                },
                err => {
                    this.Logger.error(`error in config location items >> thresholds ${err}`);
                    this.loading = false;
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }


    private saveSteps() {
        if (!(this.locCheckSteps && this.locCheckSteps.length > 0)) {
            this.loading = false;
            return;
        }

        // Find Dirty Location Steps
        // ------------------
        const dirtySteps = [];
        this.locCheckSteps.forEach((step: CheckStep) => {
            if (step.RowState !== DataRowStates.UNCHANGED) {
                dirtySteps.push(step);
            }
        });


        // Update Dirty Items
        // ----------------------------------
        if (dirtySteps.length > 0) {
            this.saveDataSubscrp = this.Data.saveCheckSteps(this.locationID, dirtySteps)
                .subscribe(
                    res => {
                        let stpIndx = -1;

                        this.Logger.info('Location CheckSteps were updated to the ECS Server. Location ID: ' + this.locationID);
                        res.forEach((step: CheckStep) => {
                            stpIndx = this.locCheckSteps.findIndex((chkStep: CheckStep) => step.ID === chkStep.ID);
                            if (stpIndx >= 0) {
                                this.locCheckSteps[stpIndx] = step;
                            }
                        });

                        this.loadSteps();
                    },
                    err => {
                        this.Logger.error(`error in saving location check steps ${err}`);
                        this.loading = false;

                        this.MsgService.clear();
                        this.MsgService.add({
                            severity: 'error',
                            summary: 'Check Steps Update',
                            detail: 'Updating Location Check Steps has failed!. ' + err
                        });
                    },
                    () => {
                        this.saveDataSubscrp.unsubscribe();
                        this.loading = false;

                        this.MsgService.clear();
                        this.MsgService.add({
                            severity: 'success',
                            summary: 'Check Steps Update',
                            detail: 'Updating Location Check Steps was successful'
                        });
                    }
                );
        }
    }


    private saveThresholds() {
        if (!(this.locThresholds && this.locThresholds.length > 0)) {
            this.loading = false;
            return;
        }

        // Find Dirty Location Thresholds
        // ------------------
        const dirtyThresholds = [];
        this.locThresholds.forEach((threshold: CheckThreshold) => {
            if (threshold.RowState !== DataRowStates.UNCHANGED) {
                dirtyThresholds.push(threshold);
            }
        });


        // Update Dirty Thresholds
        // ----------------------------------
        if (dirtyThresholds.length > 0) {
            this.saveDataSubscrp = this.Data.saveCheckThresholds(this.locationID, dirtyThresholds)
                .subscribe(
                    res => {
                        let threshIndx = -1;

                        this.Logger.info('Location CheckThresholds were updated to the ECS Server. Location ID: ' + this.locationID);
                        res.forEach((threshold: CheckThreshold) => {
                            threshIndx = this.locThresholds.findIndex((thrshld: CheckThreshold) => thrshld.ID === threshold.ID);
                            if (threshIndx >= 0) {
                                this.locThresholds[threshIndx] = threshold;
                            }
                        });

                        this.loadThresholds();
                    },
                    err => {
                        this.Logger.error(`error in saving location check thresholds ${err}`);
                        this.loading = false;

                        this.MsgService.clear();
                        this.MsgService.add({
                            severity: 'error',
                            summary: 'Check Thresholds Update',
                            detail: 'Updating Location Check Thresholds has failed!. ' + err
                        });
                    },
                    () => {
                        this.saveDataSubscrp.unsubscribe();
                        this.loading = false;

                        this.MsgService.clear();
                        this.MsgService.add({
                            severity: 'success',
                            summary: 'Check Thresholds Update',
                            detail: 'Updating Location Check Thresholds was successful'
                        });
                    }
                );
        }
    }


    private saveChoices() {
        if (!(this.locChoices && this.locChoices.length > 0)) {
            this.loading = false;
            return;
        }

        // Find Dirty Location Thresholds
        // ------------------
        const dirtyChoices = [];
        this.locChoices.forEach((choice: CheckChoice) => {
            if (choice.RowState !== DataRowStates.UNCHANGED) {
                dirtyChoices.push(choice);
            }
        });


        // Update Dirty Thresholds
        // ----------------------------------
        if (dirtyChoices.length > 0) {
            this.saveDataSubscrp = this.Data.saveCheckChoices(this.locationID, dirtyChoices)
                .subscribe(
                    res => {
                        let chocIndx = -1;

                        this.Logger.info('Location CheckChoices were updated to the ECS Server. Location ID: ' + this.locationID);
                        res.forEach((choice: CheckChoice) => {
                            chocIndx = this.locChoices.findIndex((choc: CheckChoice) => choc.ID === choice.ID);
                            if (chocIndx >= 0) {
                                this.locChoices[chocIndx] = choice;
                            }
                        });

                        this.loadcheckChoices();
                    },
                    err => {
                        this.Logger.error(`error in saving location check choices ${err}`);
                        this.loading = false;

                        this.MsgService.clear();
                        this.MsgService.add({
                            severity: 'error',
                            summary: 'Check Choices Update',
                            detail: 'Updating Location Check Choices has failed! ' + err
                        });
                    },
                    () => {
                        this.saveDataSubscrp.unsubscribe();
                        this.loading = false;

                        this.MsgService.clear();
                        this.MsgService.add({
                            severity: 'success',
                            summary: 'Check Choices Update',
                            detail: 'Updating Location Check Choices was successful'
                        });
                    }
                );
        }
    }
}

