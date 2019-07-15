import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject
export class AlarmTypeSchedule implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    AlarmTypeID: number;
    @JsonProperty
    WeekDay: number;
    @JsonProperty
    StartMinute: number;
    @JsonProperty
    EndMinute: number;
    @JsonProperty
    AlarmDelay: number;
    @JsonProperty
    AlarmBypass: boolean;

    RowState: number = DataRowStates.UNCHANGED;
}
