import { CheckAction } from './checkAction';
import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject({ knownTypes: [CheckAction] })
export class CheckChoice implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    Name: string;
    @JsonProperty({ type: Array, elements: { type: CheckAction, name: 'CheckAction' } })
    CorrectiveActions: Array<CheckAction>;

    RowState: number = DataRowStates.UNCHANGED;
    Selected: boolean;
    NameInEdit: boolean;
    ActsInEdit: boolean;


    clone(): CheckChoice {
        const checkChoice: CheckChoice = new CheckChoice();
        checkChoice.ID = this.ID;
        checkChoice.LocationID = this.LocationID;
        checkChoice.Name = this.Name;

        checkChoice.CorrectiveActions = [];
        if (this.CorrectiveActions && this.CorrectiveActions.length > 0) {
            this.CorrectiveActions.forEach((checkAction: CheckAction) => {
                checkChoice.CorrectiveActions.push(checkAction.clone());
            });
        }

        return checkChoice;
    }
}
