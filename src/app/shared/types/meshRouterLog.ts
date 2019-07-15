
import { JsonObject, JsonProperty } from '../services/io/json-metadata';

@JsonObject
export class MeshRouterLog {
    @JsonProperty
    ID: number;
    @JsonProperty
    RouterID: number;
    @JsonProperty
    RSSI: number;
    @JsonProperty
    Slots: number;
    @JsonProperty
    RouteLastUpdate: Date;
    @JsonProperty
    DataValid: boolean;
    @JsonProperty
    PowerOK: boolean;
    @JsonProperty
    Charging: boolean;
    @JsonProperty
    ChargingFault: boolean;
    @JsonProperty
    IOLastUpdate: Date;
    @JsonProperty
    IsLast: boolean;
    @JsonProperty
    LogsCount: number;
}
