import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';

@JsonObject
export class CheckAction implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    Name: string;

    RowState: number = DataRowStates.UNCHANGED;

    clone(): CheckAction {
        const checkAction: CheckAction = new CheckAction();
        checkAction.ID = this.ID;
        checkAction.LocationID = this.LocationID;
        checkAction.Name = this.Name;

        return checkAction;
    }
}
