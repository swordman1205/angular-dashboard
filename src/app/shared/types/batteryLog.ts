import { JsonObject, JsonProperty } from '../services/io/json-metadata';



@JsonObject
export class BatteryLog {
    @JsonProperty
    ID: number;
    @JsonProperty
    DeviceID: number;
    @JsonProperty
    Timestamp?: Date;
    @JsonProperty
    BatteryVoltage: number;
    @JsonProperty
    BatteryStatus: number;
    @JsonProperty
    StatusTimestamp?: Date;
}
