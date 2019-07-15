import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { MeasureUnit } from './measureUnit';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject
export class AssetMeasureType implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    RootLocationID: number;
    @JsonProperty
    Name: string;
    @JsonProperty
    MeasureID: number;
    @JsonProperty
    MeasureUnitID: number;
    @JsonProperty
    WarningLow: Number;
    @JsonProperty
    WarningHigh: Number;
    @JsonProperty
    AlarmLow: Number;
    @JsonProperty
    AlarmHigh: Number;
    @JsonProperty
    AlarmDigital: boolean;
    @JsonProperty
    AlarmTypeID: number;
    @JsonProperty
    AlarmDelay: number;
    @JsonProperty
    AlarmBypass: boolean;
    @JsonProperty
    TrueString: string;
    @JsonProperty
    FalseString: string;
    @JsonProperty
    Precision: number;

    unit: MeasureUnit;
    units: Array<MeasureUnit>;

    RowState: number = DataRowStates.UNCHANGED;
}
