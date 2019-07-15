import { JsonObject, JsonProperty } from '../services/io/json-metadata';



@JsonObject
export class TxSignalLog {
    @JsonProperty
    ID: number;
    @JsonProperty
    DeviceID: number;
    @JsonProperty
    Timestamp?: Date;
    @JsonProperty
    TxSignalStrength: number;
    @JsonProperty
    StatusTimestamp?: Date;
}
