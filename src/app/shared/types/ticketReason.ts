import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';

@JsonObject
export class TicketReason implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    Name: string;

    RowState: number = DataRowStates.UNCHANGED;
}
