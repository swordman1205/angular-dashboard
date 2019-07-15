import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';


@JsonObject
export class AssetMeasureLastStatus {
  $id: number;
  $type: string;
  @JsonProperty
  AlarmClear: number;
  @JsonProperty
  AlarmHigh: number;
  @JsonProperty
  AlarmLow: number;
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
  ID: number;
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
  MeasureUnitDescription: string;
  @JsonProperty
  MeasureUnitID: number;
  @JsonProperty
  MeasureUnitName: string;
  @JsonProperty
  MinValue: number;
  @JsonProperty
  StatusCode: number;
  @JsonProperty
  StatusTimestamp: Date;
  @JsonProperty
  StatusView: number;
  @JsonProperty
  WarningHigh: number;
  @JsonProperty
  WarningLow: number;

  StatusTimestampParsed: string;
  StatusViewParsed: string;
}




