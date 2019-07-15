import { IItem } from '../interfaces/item';
import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { AssetMeasure } from './assetMeasure';
import { AssetTag } from './assetTag';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';



@JsonObject({ knownTypes: [AssetMeasure] })
export class Asset implements IItem, IECSObject {
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
    AssetTypeID: number;
    @JsonProperty
    BypassType: number;
    @JsonProperty
    EndDate: string;
    @JsonProperty
    GeoType: number;
    @JsonProperty
    Latitude: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    Longitude: number;
    @JsonProperty({ type: Array, elements: { type: AssetMeasure, name: 'AssetMeasure' } })
    Measures: Array<AssetMeasure>;
    @JsonProperty
    PlaceID: string;
    @JsonProperty
    Provider: number;
    @JsonProperty
    SerialNumber: string;
    @JsonProperty({ type: Array, elements: { type: AssetTag, name: 'AssetTag' } })
    Tags: Array<AssetTag>;

    RowState: number = DataRowStates.UNCHANGED;
}
