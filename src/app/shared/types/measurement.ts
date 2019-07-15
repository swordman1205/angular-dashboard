import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject
export class Measurement implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    DeviceID: number;
    @JsonProperty
    DeviceTypePortID: number;
    @JsonProperty
    AssetMeasureID: number;
    @JsonProperty
    StartDate: Date;
    @JsonProperty
    RndDate: Date;
    @JsonProperty
    VirtualChannelID: number;
    // LastStatus: AssetMeasureStatus;

    RowState: number = DataRowStates.UNCHANGED;
}
