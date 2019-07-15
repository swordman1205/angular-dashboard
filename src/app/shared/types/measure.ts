import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';

@JsonObject
export class Measure implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    Name: string;
    @JsonProperty
    PortID: number;

    RowState: number = DataRowStates.UNCHANGED;
}
