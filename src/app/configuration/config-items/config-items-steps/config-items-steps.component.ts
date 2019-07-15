import { TranslateService } from '@ngx-translate/core';
import { LogService } from '../../../shared/services/log.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckItem } from '../../../shared/types/checkItem';
import { BaseConfigItem } from '../../base-config-widget/base-config-item';
import { SelectItem, MessageService } from 'primeng/api';
import { CommonService } from '../../../shared/services/common.service';
import { CheckItemStep } from '../../../shared/types/checkItemStep';
import { CheckThreshold } from '../../../shared/types/checkThreshold';
import { DataRowStates } from '../../../shared/data/enums/data-row-state.enum';
import { ServiceHelper } from '../../../shared/services/serviceHelper';
import { CheckStep } from '../../../shared/types/checkStep';
import { CheckAction } from '../../../shared/types/checkAction';
import { CheckChoice } from '../../../shared/types/checkChoice';
import { IECSObject } from '../../../shared/interfaces/ecsObject';







export const CHECK_ITEM_DIALOG_TYPE = {
    CHECK_STEPS: 'CheckSteps',
    CHECK_THRESHOLDS: 'CheckThresholds',
    CHECK_CHOICES: 'CheckChoices'
};







@Component({
    selector: 'config-items-steps',
    templateUrl: './config-items-steps.component.html',
    styleUrls: ['./config-items-steps.component.scss']
})

export class ConfigItemStepsComponent extends BaseConfigItem {

    @Output() refreshLocObjects = new EventEmitter<string>();
    @Output() saveLocObjects = new EventEmitter<string>();
    @Output() removeLocObject = new EventEmitter<{ dialogType: string, ECSObject: any }>();
    @Output() addLocObject = new EventEmitter<{ dialogType: string, ECSObject: any }>();
    @Output() reloadAllObjects = new EventEmitter<string>();

    dialogTypes = CHECK_ITEM_DIALOG_TYPE;
    dialogType: string = CHECK_ITEM_DIALOG_TYPE.CHECK_STEPS;

    private _checkItem: CheckItem;
    private _allCheckSteps: Array<CheckStep>;
    private _allThresholds: Array<CheckThreshold>;
    private _allChoices: Array<CheckChoice>;

    itemSteps: Array<CheckItemStep>;
    stepThresholds: Array<CheckThreshold>;
    stepChoices: Array<CheckChoice>;

    selItemStep: CheckItemStep;
    selThreshold: CheckThreshold;
    selStep: CheckStep;
    selChoice: CheckChoice;
    flgStpProp = false;

    flgDisplayDlg: boolean;
    dialHeader: string;
    downDisabled: boolean;
    upDisabled: boolean;
    stepType: string;
    rowStates = DataRowStates;

    chkTypeOptions: SelectItem[] = [
        { label: 'Numeric', value: 'Numeric' },
        { label: 'Multiple Choice', value: 'Multiple Choice' }];








    constructor(logger: LogService,
        translate: TranslateService,
        common: CommonService,
        msgService: MessageService) {
        super(logger, common, translate, msgService);
    }






    // Properties
    // -------------------------------------------
    @Input()
    set checkItem(chkItem: CheckItem) {
        if (this._checkItem && chkItem && this._checkItem.ID !== chkItem.ID) {
            this.selItemStep = null;
            this.selThreshold = null;
            this.selChoice = null;
        }

        this._checkItem = chkItem;

        this.stepThresholds = null;
        this.stepChoices = null;
        this.flgStpProp = false;

        if (this._checkItem) {
            if (this._checkItem.Steps && this._checkItem.Steps.length > 0) {
                this.setCheckItemStepsProps();
                this.itemSteps = ServiceHelper.sortArray(this._checkItem.Steps, 'DisplayIndex');
            } else {
                this.itemSteps = null;
            }

            this.downDisabled = true;
            this.upDisabled = true;
            this.setSelItemSteps();
        }
    }

    get checkItem(): CheckItem {
        return this._checkItem;
    }



    @Input()
    set checkSteps(steps: Array<CheckStep>) {
        this._allCheckSteps = steps;
        if (this._allCheckSteps) {
            this.setCheckItemStepsProps();

            if (!this.selItemStep) {
                this.setSelItemSteps();
            }
        }
    }

    get checkSteps(): Array<CheckStep> {
        return this._allCheckSteps;
    }



    @Input()
    set thresholds(thresholds: Array<CheckThreshold>) {
        this._allThresholds = thresholds;
        this.setSelObjects();
    }

    get thresholds(): Array<CheckThreshold> {
        return this._allThresholds;
    }



    @Input()
    set choices(chois: Array<CheckChoice>) {
        this._allChoices = chois;
        this.setSelObjects();
    }

    get choices(): Array<CheckChoice> {
        return this._allChoices;
    }








    // Event Handlers (MAIN)
    // ----------------------------------
    rowSelected(event) {
        if (this.selItemStep) {
            this.stepThresholds = this.selItemStep.Thresholds;
            this.stepChoices = this.selItemStep.Choices;
            this.setUpDownBtns();
            this.setSelObjects();
            this.stepType = this.selItemStep.CheckType;
        }
    }


    rowUnselected(event) {
        this.stepThresholds = null;
        this.stepChoices = null;
    }


    // Open the Steps Edit popup
    editStep() {
        this.dialogType = CHECK_ITEM_DIALOG_TYPE.CHECK_STEPS;
        this.dialHeader = 'Steps';
        this._allCheckSteps.forEach((step: CheckStep) => {
            step.NameInEdit = false;
            step.CheckTypeInEdit = false;
        });
        this.flgDisplayDlg = true;
    }

    moveStepUp(event) {
        const currIndex = this.itemSteps.findIndex((chkItem: CheckItemStep) => this.selItemStep.ID === chkItem.ID);
        const prevIndex = this.getPreviousActiveItemIndex(this.itemSteps, currIndex);
        this.switchDisplayIndices(this.itemSteps, currIndex, prevIndex);

        this.itemSteps = ServiceHelper.sortArray(this._checkItem.Steps, 'DisplayIndex');
        this.selItemStep = this.itemSteps[prevIndex];
        this.setUpDownBtns();
    }

    moveStepDown(event) {
        const currIndex = this.itemSteps.findIndex((chkItem: CheckItemStep) => this.selItemStep.ID === chkItem.ID);
        const nxtIndex = this.getNextActiveItemIndex(this.itemSteps, currIndex);
        this.switchDisplayIndices(this.itemSteps, currIndex, nxtIndex);

        this.itemSteps = ServiceHelper.sortArray(this._checkItem.Steps, 'DisplayIndex');
        this.selItemStep = this.itemSteps[nxtIndex];
        this.setUpDownBtns();
    }

    removeStep() {

    }


    // Open the Threshold/Choice Edit Popup
    editThreshldChoice() {
        this.dialogType = (this.stepType === 'Multiple Choice' ?
            CHECK_ITEM_DIALOG_TYPE.CHECK_CHOICES :
            CHECK_ITEM_DIALOG_TYPE.CHECK_THRESHOLDS);

        if (this.stepType === 'Multiple Choice') {
            this.dialHeader = 'Choices';
            this._allChoices.forEach((choice: CheckChoice) => {
                choice.NameInEdit = false;
                choice.ActsInEdit = false;
            });
        } else {
            this.dialHeader = 'Thresholds';
            this._allThresholds.forEach((threshold: CheckThreshold) => {
                threshold.FromValInEdit = false;
                threshold.ToValInEdit = false;
                threshold.ActsInEdit = false;
            });
        }

        this.flgDisplayDlg = true;
    }

    // Remove Thresholds/Choices from the current selected CheckItemStep
    removeThreshldChoice() {
        this.dialogType = this.stepType === 'Multiple Choice' ?
            CHECK_ITEM_DIALOG_TYPE.CHECK_CHOICES :
            CHECK_ITEM_DIALOG_TYPE.CHECK_THRESHOLDS;


        // TODO
    }








    // Event Handlers (Popup Dialog)
    // ------------------------------------------------------
    stepRowSelected(event) {
        const edtStep: CheckStep = this._allCheckSteps.find((step: CheckStep) => step.NameInEdit === true || step.CheckTypeInEdit === true);
        if (edtStep && edtStep.ID !== this.selStep.ID) {
            edtStep.NameInEdit = false;
            edtStep.CheckTypeInEdit = false;
        }
    }


    stepRowUnselected(event) {
        this._allCheckSteps.forEach((step: CheckStep) => {
            step.NameInEdit = false;
            step.CheckTypeInEdit = false;
        });
    }

    setStepNameEditMode(event: MouseEvent, chkStep: CheckStep) {
        this._allCheckSteps.forEach((step: CheckStep) => {
            step.CheckTypeInEdit = false;
            if (chkStep.ID === step.ID) {
                if (step.NameInEdit) {
                    return;
                }
                step.NameInEdit = true;
                this.selStep = step;
            } else {
                step.NameInEdit = false;
            }
        });

        event.preventDefault();
        event.stopPropagation();
    }

    setStepChkTypeEditMode(event: MouseEvent, chkStep: CheckStep) {
        this._allCheckSteps.forEach((step: CheckStep) => {
            step.NameInEdit = false;
            if (chkStep.ID === step.ID) {
                if (step.CheckTypeInEdit) {
                    return;
                }
                step.CheckTypeInEdit = true;
                this.selStep = step;
            } else {
                step.CheckTypeInEdit = false;
            }
        });

        event.preventDefault();
        event.stopPropagation();
    }

    dirtifyStep(event: MouseEvent, chkStep: CheckStep) {
        if (chkStep.RowState === DataRowStates.UNCHANGED) {
            chkStep.RowState = DataRowStates.MODIFIED;
            // tab.rightIcon = 'fa fa-exclamation';
        }
    }



    threshldRowSelected(event) {
        const edtThreshold: CheckThreshold = this._allThresholds.find((threshold: CheckThreshold) =>
            threshold.ActsInEdit === true || threshold.FromValInEdit === true || threshold.ToValInEdit === true);

        if (edtThreshold && edtThreshold.ID !== this.selThreshold.ID) {
            edtThreshold.ActsInEdit = false;
            edtThreshold.FromValInEdit = false;
            edtThreshold.ToValInEdit = false;
        }
    }


    threshldRowUnselected(event) {
        this._allThresholds.forEach((threshold: CheckThreshold) => {
            threshold.ActsInEdit = false;
            threshold.FromValInEdit = false;
            threshold.ToValInEdit = false;
        });
    }

    setThresholdsFromEditMode(event: MouseEvent, threshold: CheckThreshold) {
        this._allThresholds.forEach((thresld: CheckThreshold) => {
            thresld.ToValInEdit = false;
            thresld.ActsInEdit = false;
            if (threshold.ID === thresld.ID) {
                if (thresld.FromValInEdit) {
                    return;
                }
                thresld.FromValInEdit = true;
                this.selThreshold = thresld;
            } else {
                thresld.FromValInEdit = false;
            }
        });

        event.preventDefault();
        event.stopPropagation();
    }

    setThresholdsToEditMode(event: MouseEvent, threshold: CheckThreshold) {
        this._allThresholds.forEach((thresld: CheckThreshold) => {
            thresld.FromValInEdit = false;
            thresld.ActsInEdit = false;
            if (threshold.ID === thresld.ID) {
                if (thresld.ToValInEdit) {
                    return;
                }
                thresld.ToValInEdit = true;
                this.selThreshold = thresld;
            } else {
                thresld.ToValInEdit = false;
            }
        });

        event.preventDefault();
        event.stopPropagation();
    }

    setThresholdsActsEditMode(event: MouseEvent, threshold: CheckThreshold) {
        this._allThresholds.forEach((thresld: CheckThreshold) => {
            thresld.FromValInEdit = false;
            thresld.ToValInEdit = false;
            if (threshold.ID === thresld.ID) {
                if (thresld.ActsInEdit) {
                    return;
                }
                thresld.ActsInEdit = true;
                this.selThreshold = thresld;
            } else {
                thresld.ActsInEdit = false;
            }
        });

        event.preventDefault();
        event.stopPropagation();
    }

    dirtifyThreshold(event: MouseEvent, threshold: CheckThreshold) {
        if (threshold.RowState === DataRowStates.UNCHANGED) {
            threshold.RowState = DataRowStates.MODIFIED;
            // tab.rightIcon = 'fa fa-exclamation';
        }
    }



    choiceRowSelected(event) {
        const edtChoice: CheckChoice = this._allChoices.find((choice: CheckChoice) => choice.NameInEdit === true || choice.ActsInEdit === true);
        if (edtChoice && edtChoice.ID !== this.selChoice.ID) {
            edtChoice.NameInEdit = false;
            edtChoice.ActsInEdit = false;
        }
    }


    choiceRowUnselected(event) {
        this._allChoices.forEach((choice: CheckChoice) => {
            choice.NameInEdit = false;
            choice.ActsInEdit = false;
        });
    }

    setChoicesNameEditMode(event: MouseEvent, choice: CheckChoice) {
        this._allChoices.forEach((choc: CheckChoice) => {
            choc.ActsInEdit = false;
            if (choice.ID === choc.ID) {
                if (choc.NameInEdit) {
                    return;
                }
                choc.NameInEdit = true;
                this.selChoice = choc;
            } else {
                choc.NameInEdit = false;
            }
        });

        event.preventDefault();
        event.stopPropagation();
    }

    setChoicesActsEditMode(event: MouseEvent, choice: CheckChoice) {
        this._allChoices.forEach((choc: CheckChoice) => {
            choc.NameInEdit = false;
            if (choice.ID === choc.ID) {
                if (choc.ActsInEdit) {
                    return;
                }
                choc.ActsInEdit = true;
                this.selChoice = choc;
            } else {
                choc.ActsInEdit = false;
            }
        });

        event.preventDefault();
        event.stopPropagation();
    }

    dirtifyChoice(event: MouseEvent, choice: CheckChoice) {
        if (choice.RowState === DataRowStates.UNCHANGED) {
            choice.RowState = DataRowStates.MODIFIED;
            // tab.rightIcon = 'fa fa-exclamation';
        }
    }




    // According to the selected CheckStep add/remove CheckItemStep to the current CheckItem
    stepChckChanged(selected: boolean, step: CheckStep) {
        step.CheckTypeInEdit = false;
        step.NameInEdit = false;

        if (selected) {
            let checkItemStep: CheckItemStep = null;
            let lastCheckItemStep: CheckItemStep = null;

            if (this.itemSteps) {
                checkItemStep = this.itemSteps.find((itmStep: CheckItemStep) => itmStep.CheckStepID === step.ID);
                for (let i = this.itemSteps.length - 1; i >= 0; i--) {
                    if (this.itemSteps[i].RowState !== DataRowStates.DELETED) {
                        lastCheckItemStep = this.itemSteps[i];
                        break;
                    }
                }
            } else {
                this._checkItem.Steps = [];
                this.itemSteps = this._checkItem.Steps;
            }

            if (!checkItemStep) {
                checkItemStep = new CheckItemStep();
                checkItemStep.CheckStepID = step.ID;
                checkItemStep.Thresholds = [];
                checkItemStep.Choices = [];
                checkItemStep.RowState = DataRowStates.ADDED;
                this._checkItem.Steps.push(checkItemStep);
                this.onDirtify();
            } else if (checkItemStep.RowState === DataRowStates.DELETED) {
                checkItemStep.RowState = DataRowStates.UNCHANGED;
            } else {
                return;
            }

            checkItemStep.DisplayIndex = lastCheckItemStep ? lastCheckItemStep.DisplayIndex + 1 : 0;
            this.selItemStep = checkItemStep;
            this.selThreshold = null;
            this.selChoice = null;
            this.setSelItemSteps();

        } else {
            const checkItemStep: CheckItemStep = this.itemSteps.find((itmStep: CheckItemStep) => itmStep.CheckStepID === step.ID);
            if (!checkItemStep || checkItemStep.RowState === DataRowStates.DELETED) {
                return;
            }

            if (checkItemStep.DisplayIndex < this.itemSteps.length - 1) {
                const startIndx = checkItemStep.DisplayIndex + 1;
                for (let i = startIndx; i < this.itemSteps.length; i++) {
                    if (this.itemSteps[i].RowState !== DataRowStates.DELETED) {
                        this.itemSteps[i].DisplayIndex--;
                        this.itemSteps[i].RowState = DataRowStates.MODIFIED;
                    }
                }

                this.onDirtify();
            }

            if (checkItemStep.RowState === DataRowStates.ADDED) {
                const indx = this.itemSteps.findIndex((itmStep: CheckItemStep) => itmStep.ID === checkItemStep.ID);
                this.itemSteps.splice(indx, 1);
            } else {
                checkItemStep.RowState = DataRowStates.DELETED;
                checkItemStep.DisplayIndex = -1;
                this.onDirtify();
            }
        }
    }


    thresholdChckChanged(selected: boolean, threshold: CheckThreshold) {
        if (selected) {
            const stpThreshold: CheckThreshold = this.thresholds.find((threhld: CheckThreshold) => threshold.ID === threhld.ID);
            if (stpThreshold) {
                this.stepThresholds.push(stpThreshold);
                this.onDirtify();
            }
        } else {
            const indx = this.stepThresholds.findIndex((threhld: CheckThreshold) => threshold.ID === threhld.ID);
            if (indx >= 0) {
                this.stepThresholds.splice(indx, 1);
                this.onDirtify();
            }
        }
    }


    choiceChckChanged(selected: boolean, choice: CheckChoice) {
        if (selected) {
            const stpChoice: CheckChoice = this.choices.find((choc: CheckChoice) => choice.ID === choc.ID);
            if (stpChoice) {
                this.stepChoices.push(stpChoice);
                this.onDirtify();
            }
        } else {
            const indx = this.stepChoices.findIndex((choc: CheckChoice) => choice.ID === choc.ID);
            if (indx >= 0) {
                this.stepChoices.splice(indx, 1);
                this.onDirtify();
            }
        }
    }



    // Refresh Location List of Steps/Thresholds/Choices
    // --------------------------------------------------
    refresh() {
        this.refreshLocObjects.emit(this.dialogType);
    }


    // Save Location List of Steps/Thresholds/Choices
    // --------------------------------------------------
    save() {
        this.saveLocObjects.emit(this.dialogType);
    }


    // Add Location Step from Location's CheckSteps List
    // -----------------------------------------------------
    add() {
        switch (this.dialogType) {
            case CHECK_ITEM_DIALOG_TYPE.CHECK_STEPS: {
                if (!this.validateItems(this._allCheckSteps, 'Name')) {
                    return;
                }

                const newCheckStep: CheckStep = new CheckStep();
                newCheckStep.ID = 0;
                newCheckStep.Name = '';
                newCheckStep.CheckType = 'Numeric';
                newCheckStep.LocationID = this._checkItem.LocationID;
                newCheckStep.RowState = DataRowStates.ADDED;
                this.selStep = newCheckStep;
                this.addLocObject.emit({ dialogType: this.dialogType, ECSObject: newCheckStep });
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_THRESHOLDS: {
                if (!this.validateItems(this._allThresholds, 'Name')) {
                    return;
                }

                const newThreshold: CheckThreshold = new CheckThreshold();
                newThreshold.ID = 0;
                newThreshold.CorrectiveActions = [];
                newThreshold.HighValue = Number.MAX_VALUE;
                newThreshold.LowValue = Number.MIN_SAFE_INTEGER;
                newThreshold.LocationID = this._checkItem.LocationID;
                newThreshold.RowState = DataRowStates.ADDED;
                this.selThreshold = newThreshold;
                this.addLocObject.emit({ dialogType: this.dialogType, ECSObject: newThreshold });
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_CHOICES: {
                if (!this.validateItems(this._allChoices, 'Name')) {
                    return;
                }

                const newChkChoice: CheckChoice = new CheckChoice();
                newChkChoice.ID = 0;
                newChkChoice.Name = '';
                newChkChoice.CorrectiveActions = [];
                newChkChoice.LocationID = this._checkItem.LocationID;
                newChkChoice.RowState = DataRowStates.ADDED;
                this.selChoice = newChkChoice;
                this.addLocObject.emit({ dialogType: this.dialogType, ECSObject: newChkChoice });
                break;
            }
        }
    }

    // Remove the Threshold/Choice Edit Popup
    // -------------------------------------------
    remove() {
        switch (this.dialogType) {
            case CHECK_ITEM_DIALOG_TYPE.CHECK_STEPS: {
                this.removeLocObject.emit({ dialogType: this.dialogType, ECSObject: this.selStep });
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_THRESHOLDS: {
                this.removeLocObject.emit({ dialogType: this.dialogType, ECSObject: this.selThreshold });
                break;
            }

            case CHECK_ITEM_DIALOG_TYPE.CHECK_CHOICES: {
                this.removeLocObject.emit({ dialogType: this.dialogType, ECSObject: this.selChoice });
                break;
            }
        }
    }

    updateAllSteps(event) {
        this.reloadAllObjects.emit(this.dialogType);
    }










    // Internal "Helper" Methods
    // ----------------------------------
    getThreshldActions(threshold: CheckThreshold): string {
        if (!threshold) {
            return;
        }

        let selThreshld: CheckThreshold = null;
        if (this._checkItem) {
            this._allThresholds.forEach((thresh: CheckThreshold) => {
                if (thresh.ID === threshold.ID) {
                    selThreshld = thresh;
                }
            });
        }

        let result = '';
        selThreshld.CorrectiveActions.forEach((action: CheckAction) => {
            result += ((result.length !== 0) ? ' / ' : '') + action.Name;
        });

        return result;
    }


    getChoiceActions(choice: CheckChoice): string {
        if (!choice) {
            return;
        }

        let selChoce: CheckChoice = null;
        if (this._checkItem) {
            this._allChoices.forEach((choce: CheckChoice) => {
                if (choce.ID === choice.ID) {
                    selChoce = choce;
                }
            });
        }

        let result = '';
        selChoce.CorrectiveActions.forEach((action: CheckAction) => {
            result += ((result.length !== 0) ? ' / ' : '') + action.Name;
        });

        return result;
    }








    // Private "Helper" Methods
    // ---------------------------------
    private setSelItemSteps() {
        if (!(this.itemSteps && this.itemSteps.length > 0)) {
            if (this._allCheckSteps && this._allCheckSteps.length > 0) {
                this._allCheckSteps.forEach((step: CheckStep) => step.Selected = false);
            }

            return;
        }

        if (this.selItemStep) {
            const indx = this.itemSteps.findIndex((itm: CheckItemStep) => itm.ID === this.selItemStep.ID);
            if (indx > -1) {
                this.selItemStep = this.itemSteps[indx];
            }
        } else {
            this.selItemStep = this.itemSteps[0];
        }

        if (this._allCheckSteps && this._allCheckSteps.length > 0) {
            this._allCheckSteps.forEach((step: CheckStep) => {
                const chcItmStep = this.itemSteps.find((itmStep: CheckItemStep) => step.ID === itmStep.CheckStepID);
                step.Selected = chcItmStep ? true : false;
            });
        }

        this.rowSelected(null);
    }

    private setCheckItemStepsProps() {
        if (!(this._allCheckSteps && this._allCheckSteps.length > 0) ||
            !(this._checkItem && this._checkItem.Steps && this._checkItem.Steps.length > 0)) {
            return;
        }

        if (this.flgStpProp) {
            return;
        }

        this.flgStpProp = true;
        this._checkItem.Steps.forEach((chkItmStep: CheckItemStep) => {
            const chkStep = this._allCheckSteps.find((step: CheckStep) => step.ID === chkItmStep.CheckStepID);
            chkItmStep.Name = chkStep.Name;
            chkItmStep.CheckType = chkStep.CheckType;
        });
    }

    private setUpDownBtns() {
        this.upDisabled = !(this.selItemStep.RowState !== DataRowStates.DELETED &&
            this.getPreviousActiveItemIndex(this.itemSteps, this.selItemStep.DisplayIndex) !== -1);

        this.downDisabled = !(this.selItemStep.RowState !== DataRowStates.DELETED &&
            this.getNextActiveItemIndex(this.itemSteps, this.selItemStep.DisplayIndex) !== -1);
    }

    private setSelObjects() {
        if (!(this.stepThresholds && this.stepThresholds.length > 0)) {
            if (this._allThresholds && this._allThresholds.length > 0) {
                this._allThresholds.forEach((threshld: CheckThreshold) => threshld.Selected = false);
            }
        } else {
            if (this._allThresholds && this._allThresholds.length > 0) {
                this._allThresholds.forEach((threshld: CheckThreshold) => {
                    const currThreshld = this.stepThresholds.find((thres: CheckThreshold) => thres.ID === threshld.ID);
                    threshld.Selected = currThreshld ? true : false;
                });
            }
        }

        if (!(this.stepChoices && this.stepChoices.length > 0)) {
            if (this._allChoices && this._allChoices.length > 0) {
                this._allChoices.forEach((choice: CheckChoice) => choice.Selected = false);
            }
        } else {
            if (this._allChoices && this._allChoices.length > 0) {
                this._allChoices.forEach((choice: CheckChoice) => {
                    const currChoice = this.stepChoices.find((chc: CheckChoice) => chc.ID === choice.ID);
                    choice.Selected = currChoice ? true : false;
                });
            }
        }
    }


    private getPreviousActiveItemIndex(arr: Array<IECSObject>, itemIndex: number): number {
        let prevIndx = -1;
        let flg = true;

        for (let i: number = itemIndex - 1; i > -1 && flg; i--) {
            if (arr[i].RowState !== DataRowStates.DELETED) {
                prevIndx = i;
                flg = false;
            }
        }

        return prevIndx;
    }


    private getNextActiveItemIndex(arr: Array<IECSObject>, itemIndex: number): number {
        let nxtIndx = -1;
        let flg = true;

        for (let i: number = itemIndex + 1; i < arr.length && flg; i++) {
            if (arr[i].RowState !== DataRowStates.DELETED) {
                nxtIndx = i;
                flg = false;
            }
        }

        return nxtIndx;
    }


    private switchDisplayIndices(arr: Array<any>, itemIndexA: number, itemIndexB: number) {
        if (itemIndexA === itemIndexB) {
            return;
        }

        const itemA = arr[itemIndexA];
        const itemB = arr[itemIndexB];

        const itemA_DisplayIndex = itemA.DisplayIndex;
        itemA.DisplayIndex = itemB.DisplayIndex;
        itemB.DisplayIndex = itemA_DisplayIndex;

        itemA.RowState = DataRowStates.MODIFIED;
        itemB.RowState = DataRowStates.MODIFIED;
        this.onDirtify();
    }
}
