import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject
export class CookingCycleResultDocument implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    CookingCycleResultID: number;
    @JsonProperty
    Path: string;
    @JsonProperty
    Filename: string;
    @JsonProperty
    OrginalFilename: string;

    RowState: number = DataRowStates.UNCHANGED;
}
