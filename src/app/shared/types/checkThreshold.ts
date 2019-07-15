import { CheckAction } from './checkAction';
import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';
import { defaults } from '../data/defaults';


@JsonObject({ knownTypes: [CheckAction] })
export class CheckThreshold implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    LowValue: number;
    @JsonProperty
    HighValue: number;
    @JsonProperty({ type: Array, elements: { type: CheckAction, name: 'CheckAction' } })
    CorrectiveActions: Array<CheckAction>;

    RowState: number = DataRowStates.UNCHANGED;
    Selected: boolean;
    FromValInEdit: boolean;
    ToValInEdit: boolean;
    ActsInEdit: boolean;

    get FromValue(): string {
        return this.LowValue <= defaults.FLOAT_MIN_VALUE ?
            '-infinity' :
            this.LowValue.toString();
    }

    get ToValue(): string {
        return this.HighValue >= defaults.FLOAT_MAX_VALUE ?
            'infinity' :
            this.HighValue.toPrecision(2);
    }

    clone(): CheckThreshold {
        const checkThreshold: CheckThreshold = new CheckThreshold();
        checkThreshold.ID = this.ID;
        checkThreshold.LocationID = this.LocationID;
        checkThreshold.LowValue = this.LowValue;
        checkThreshold.HighValue = this.HighValue;

        checkThreshold.CorrectiveActions = [];
        if (this.CorrectiveActions && this.CorrectiveActions.length > 0) {
            this.CorrectiveActions.forEach((checkAction: CheckAction) => {
                checkThreshold.CorrectiveActions.push(checkAction.clone());
            });
        }

        return checkThreshold;
    }
}
