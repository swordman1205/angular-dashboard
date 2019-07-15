import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';

@JsonObject
export class TicketAction implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    RootLocationID: number;
    @JsonProperty
    Name: string;
    MergedItems: Array<number>;

    RowState: number = DataRowStates.UNCHANGED;
}
