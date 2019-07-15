import { JsonObject, JsonProperty } from '../services/io/json-metadata';


@JsonObject
export class AssetMeasureLog {
    @JsonProperty
    AlarmBypass: number;
    @JsonProperty
    AlarmClear: number;
    @JsonProperty
    AlarmDeviation: number;
    @JsonProperty
    AlarmHigh: number;
    @JsonProperty
    AlarmLow: number;
    @JsonProperty
    AlertReason: number;
    @JsonProperty
    AssetMeasureID: number;
    @JsonProperty
    BGColor: string;
    @JsonProperty
    ID: number;
    @JsonProperty
    IsStatusFixed: boolean;
    @JsonProperty
    MeasureUnitID: number;
    @JsonProperty
    MeasureUnitName: string;
    @JsonProperty
    PacketStatusInfo: number;
    @JsonProperty
    RowState: number;
    @JsonProperty
    StatusCode: number;
    @JsonProperty
    StatusTimestamp: Date;
    @JsonProperty
    StatusView: number;
    @JsonProperty
    Timestamp: Date;
    @JsonProperty
    UncalibratedValue: number;
    @JsonProperty
    Value: number;
    @JsonProperty
    WarningHigh: number;
    @JsonProperty
    WarningLow: number;
}
