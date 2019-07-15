import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject
export class CheckStep implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    Name: string;
    @JsonProperty
    CheckType: string;

    RowState: number = DataRowStates.UNCHANGED;
    Selected: boolean;
    NameInEdit: boolean;
    CheckTypeInEdit: boolean;
}
