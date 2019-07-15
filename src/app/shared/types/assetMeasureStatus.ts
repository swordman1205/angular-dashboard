import { IItem } from '../interfaces/item';
import { JsonObject, JsonProperty } from '../services/io/json-metadata';

@JsonObject
export class AssetMeasureStatus {
    @JsonProperty
    ID: number;
    @JsonProperty
    Name: string;
    @JsonProperty
    StatusCode: number;
    @JsonProperty
    StatusView: number;
    oldStatusView?: number;
    nameSearch?: string;
    @JsonProperty
    AlarmClear: number;
    @JsonProperty
    AlertReason: number;
    @JsonProperty
    AssetID: number;
    @JsonProperty
    AssetMeasureID: number;
    @JsonProperty
    AssetMeasureName: string;
    @JsonProperty
    AssetName: string;
    @JsonProperty
    BypassType: number;
    @JsonProperty
    ConnStatus: number;
    @JsonProperty
    CreatedOn: Date;
    @JsonProperty
    FalseString: string;
    @JsonProperty
    IsLastStatus: boolean;
    @JsonProperty
    LastUpdate: Date;
    @JsonProperty
    LastValue: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    LocationName: string;
    @JsonProperty
    LogCount: number;
    @JsonProperty
    MaxValue: number;
    @JsonProperty
    MeasureID: number;
    @JsonProperty
    MeasureName: string;
    @JsonProperty
    MeasureUnitDescription: string;
    @JsonProperty
    MeasureUnitID: number;
    @JsonProperty
    MeasureUnitName: string;
    @JsonProperty
    MinValue: number;
    @JsonProperty
    Precision: number;
    @JsonProperty
    RowState: number;
    @JsonProperty
    StatusCategory: number;
    @JsonProperty
    StatusCodeCounter: number;
    @JsonProperty
    StatusTimestamp: Date;
    @JsonProperty
    StatusType: number;
    @JsonProperty
    TrueString: string;
    statusViewParsed: string;
}
