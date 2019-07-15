import { CheckItemStep } from './checkItemStep';
import { CookingCycleRule } from './cookingCycleRule';
import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject({ knownTypes: [CheckItemStep, CookingCycleRule] })
export class CheckItem implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    Key: string;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    Name: string;
    @JsonProperty
    Description: string;
    @JsonProperty
    CheckItemImageID: number;
    @JsonProperty({ type: Array, elements: { type: CheckItemStep, name: 'CheckItemStep' } })
    Steps: Array<CheckItemStep>;
    @JsonProperty({ type: Array, elements: { type: CookingCycleRule, name: 'CookingCycleRule' } })
    Rules: Array<CookingCycleRule>;
    @JsonProperty
    BGColor: string;

    RowState: number = DataRowStates.UNCHANGED;
    DeletedRules: Array<CookingCycleRule>;




    clone(): CheckItem {
        const checkItem: CheckItem = new CheckItem();
        checkItem.ID = this.ID;
        checkItem.LocationID = this.LocationID;
        checkItem.Name = this.Name + '_Copy';
        checkItem.Description = this.Description;
        checkItem.CheckItemImageID = this.CheckItemImageID;
        checkItem.BGColor = this.BGColor;

        checkItem.Steps = [];
        if (this.Steps && this.Steps.length > 0) {
            this.Steps.forEach((step: CheckItemStep) => {
                checkItem.Steps.push(step.clone());
            });
        }

        if (this.Rules && this.Rules.length > 0) {
            checkItem.Rules = [];
            this.Rules.forEach((rule: object) => {
                checkItem.Rules.push(CookingCycleRule.clone(rule));
            });
        }

        return checkItem;
    }
}
