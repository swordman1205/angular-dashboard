import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject
export class CheckFormItem implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    CheckFormID: number;
    @JsonProperty
    CheckItemID: number;
    @JsonProperty
    Schedule: Date;
    @JsonProperty
    DisplayIndex: number;

    RowState: number = DataRowStates.UNCHANGED;
}
