import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';

@JsonObject
export class AlertType implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    RootLocationID: number;
    @JsonProperty
    Name: string;
    @JsonProperty
    AlarmDelay: number;
    @JsonProperty
    SendInterval: number;
    @JsonProperty
    AlarmDuration: number;
    @JsonProperty
    AssetsAlarms: boolean;
    @JsonProperty
    DevicesAlarms: boolean;
    @JsonProperty
    PreventiveMaintenance: boolean;
    @JsonProperty
    RoutersAlarms: boolean;
    @JsonProperty
    AuditAlarms: boolean;

    RowState: number = DataRowStates.UNCHANGED;
}
