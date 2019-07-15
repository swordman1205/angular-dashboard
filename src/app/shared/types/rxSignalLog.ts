import { JsonObject, JsonProperty } from '../services/io/json-metadata';



@JsonObject
export class RxSignalLog {
    @JsonProperty
    ID: number;
    @JsonProperty
    DeviceID: number;
    @JsonProperty
    Timestamp?: Date;
    @JsonProperty
    RxSignalStrength: number;
    @JsonProperty
    StatusTimestamp?: Date;
}
