import { CheckThreshold } from './checkThreshold';
import { CheckChoice } from './checkChoice';
import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';



@JsonObject({ knownTypes: [CheckThreshold, CheckChoice] })
export class CheckItemStep implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    CheckItemID: number;
    @JsonProperty
    CheckStepID: number;
    @JsonProperty
    DisplayIndex: number;
    @JsonProperty({ type: Array, elements: { type: CheckThreshold, name: 'CheckThreshold' } })
    Thresholds: Array<CheckThreshold>;
    @JsonProperty({ type: Array, elements: { type: CheckChoice, name: 'CheckChoice' } })
    Choices: Array<CheckChoice>;

    isMultipleChoice: boolean;
    Name: string;
    CheckType: string;

    RowState: number = DataRowStates.UNCHANGED;


    clone(): CheckItemStep {
        const checkItemStep: CheckItemStep = new CheckItemStep();
        checkItemStep.ID = this.ID;
        checkItemStep.CheckItemID = this.CheckItemID;
        checkItemStep.CheckStepID = this.CheckStepID;
        checkItemStep.DisplayIndex = this.DisplayIndex;

        checkItemStep.Thresholds = [];
        if (this.Thresholds && this.Thresholds.length > 0) {
            this.Thresholds.forEach((threshld: CheckThreshold) => {
                checkItemStep.Thresholds.push(threshld.clone());
            });
        }

        checkItemStep.Choices = [];
        if (this.Choices && this.Choices.length > 0) {
            this.Choices.forEach((choice: CheckChoice) => {
                checkItemStep.Choices.push(choice.clone());
            });
        }

        checkItemStep.isMultipleChoice = this.isMultipleChoice;
        return checkItemStep;
    }
}
