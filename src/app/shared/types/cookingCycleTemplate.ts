import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { MeasureUnit } from './measureUnit';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject({ knownTypes: [MeasureUnit] })
export class CookingCycleTemplate implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    Name: string;
    @JsonProperty
    StartTemperature: Number;
    @JsonProperty
    MarkTemperature: Number;
    @JsonProperty
    Timespan: Number;
    @JsonProperty
    TimespanSTR: string;
    @JsonProperty({ type: MeasureUnit })
    Unit: MeasureUnit;

    RowState: number = DataRowStates.UNCHANGED;
    UnitName: string;
}
