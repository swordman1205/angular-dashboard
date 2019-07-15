import { IItem } from '../interfaces/item';
import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject
export class AssetMeasure implements IItem, IECSObject {
    id: number;
    type: string;
    name?: string;
    $id?: string;
    $type?: string;
    @JsonProperty
    HasMapImage?: boolean;
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    Name: string;
    @JsonProperty
    MapX?: number;
    @JsonProperty
    MapY?: number;
    children?: IItem[];
    parentId?: number;
    @JsonProperty
    StatusCode: number;
    @JsonProperty
    StatusView: number;
    oldStatusView?: number;
    nameSearch?: string;
    @JsonProperty
    AckType: number;
    @JsonProperty
    AlarmBypass: boolean;
    @JsonProperty
    AlarmClear: boolean;
    @JsonProperty
    AlarmDelay: number;
    @JsonProperty
    AlarmDeviation: number;
    @JsonProperty
    AlarmDigital: boolean;
    @JsonProperty
    AlarmHigh: number;
    @JsonProperty
    AlarmLow: number;
    @JsonProperty
    AlarmTypeID: number;
    @JsonProperty
    AssetID: number;
    @JsonProperty
    AssetMeasureTypeID: number;
    @JsonProperty
    BypassType: number;
    @JsonProperty
    BypassUpdate: Date;
    @JsonProperty
    EndDate: Date;
    @JsonProperty
    FalseString: string;
    @JsonProperty
    MeasureID: number;
    @JsonProperty
    MeasureUnitID: number;
    @JsonProperty
    Precision: number;
    @JsonProperty
    StartDate: Date;
    @JsonProperty
    TrueString: string;
    @JsonProperty
    WarningHigh: number;
    @JsonProperty
    WarningLow: number;
    @JsonProperty
    ZoneID: string;

    RowState: number = DataRowStates.UNCHANGED;
}
