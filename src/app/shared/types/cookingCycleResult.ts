import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { MeasureUnit } from './measureUnit';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject({ knownTypes: [MeasureUnit] })
export class CookingCycleResult implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    RuleID: number;
    @JsonProperty
    RuleName: string;
    @JsonProperty
    RuleStartTemperature: Number;
    @JsonProperty
    RuleMarkTemperature: Number;
    @JsonProperty
    StartTime: Date;
    @JsonProperty
    RuleTimeSpan: number;
    @JsonProperty
    RuleOrdinal: number;
    @JsonProperty
    CookingCycleGroup: string;
    @JsonProperty
    AssetMeasureID: number;
    @JsonProperty
    CheckItemID: number;
    @JsonProperty
    MonitoringStart: Date;
    @JsonProperty
    MonitoringFinish: Date;
    @JsonProperty
    StartTemperature: Number;
    @JsonProperty
    MarkTemperature: Number;
    @JsonProperty
    Timespan: number;
    @JsonProperty
    Result: number;
    @JsonProperty
    ThermometerCalibration: number;
    @JsonProperty
    HeatingCcp: number;
    @JsonProperty
    CoolingCcp: number;
    @JsonProperty
    LabOk: number;
    @JsonProperty
    SignedDate: Date;
    @JsonProperty
    SignedUserID: number;
    @JsonProperty
    ReleasedFromHoldSignedDate: Date;
    @JsonProperty
    ReleasedFromHoldSignedUserID: number;

    ProductName: string;
    SignedUserFirstName: string;
    SignedUserMiddleName: string;
    SignedUserLastName: string;
    ReleasedFromHoldSignFirstName: string;
    ReleasedFromHoldSignMiddleName: string;
    ReleasedFromHoldSignLastName: string;
    Unit: MeasureUnit;

    RowState: number = DataRowStates.UNCHANGED;
}
