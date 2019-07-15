import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject
export class PreventiveMaintenance implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    RootLocationID: number;
    @JsonProperty
    Name: string;
    @JsonProperty
    Comments: string;
    @JsonProperty
    StartDate: Date;
    @JsonProperty
    RepeatInterval: number;

    RowState: number = DataRowStates.UNCHANGED;
}
