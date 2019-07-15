import { JsonObject, JsonProperty } from '../services/io/json-metadata';


@JsonObject
export class MeshRouterStatus {
    @JsonProperty
    StatusType: number;
    @JsonProperty
    NeshRouterID: number;
    @JsonProperty
    RouterPhysicalID: string;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    ParentLocationID: number;
    @JsonProperty
    LocationName: string;
    @JsonProperty
    AssetName: string;
    @JsonProperty
    StatusTimestamp?: Date;
    @JsonProperty
    LastUpdate?: Date;
    @JsonProperty
    DataValid: boolean;
    @JsonProperty
    AlarmClear: number;
    @JsonProperty
    Connected: boolean;
    @JsonProperty
    PowerOk: boolean;
    @JsonProperty
    ChargingFault: boolean;
    @JsonProperty
    StatusCode: number;
    @JsonProperty
    StatusView?: number;
    @JsonProperty
    oldStatusView?: number;
    @JsonProperty
    LogCount: number;
}
