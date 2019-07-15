import { JsonObject, JsonProperty } from '../services/io/json-metadata';


@JsonObject
export class AssetMeasureLastValue {
  @JsonProperty
  ID: number;
  @JsonProperty
  AssetMeasureID: number;
  @JsonProperty
  AssetMeasureName: string;
  @JsonProperty
  StatusCode: number;
  @JsonProperty
  Precision: number;
  @JsonProperty
  Value: number;
  @JsonProperty
  UncalibratedValue: number;
  @JsonProperty
  Timestamp?: Date;
  @JsonProperty
  WarningLow: number;
  @JsonProperty
  WarningHigh: number;
  @JsonProperty
  AlarmLow: number;
  @JsonProperty
  AlarmHigh: number;
  @JsonProperty
  AlarmDeviation: number;
  @JsonProperty
  AlarmClear: number;
  @JsonProperty
  AlarmBypass: number;
  @JsonProperty
  StatusTimestamp?: Date;
  @JsonProperty
  PacketStatusInfo: number;
  @JsonProperty
  MeasureUnitID: number;
  @JsonProperty
  StatusView: number;
  @JsonProperty
  LocationID: number;
  @JsonProperty
  LocationName: string;
  @JsonProperty
  AssetID: number;
  @JsonProperty
  AssetName: string;
  @JsonProperty
  AssetMeasureTypeID: number;
  @JsonProperty
  TrueString: string;
  @JsonProperty
  FalseString: string;
}
