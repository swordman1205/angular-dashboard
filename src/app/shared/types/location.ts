import { IItem } from '../interfaces/item';
import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { Asset } from './asset';
import { Device } from './device';
import { LocationTag } from './locationTag';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';



@JsonObject({ knownTypes: [Location, Asset, Device] })
export class Location implements IItem, IECSObject {
    id: number;
    type: string;
    name?: string;
    $id?: string;
    $type?: string;
    tag?: string;
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty({ type: String })
    Name?: string;
    @JsonProperty
    MapX?: number;
    @JsonProperty
    MapY?: number;
    children?: IItem[];
    parentId?: number;
    @JsonProperty
    StatusCode?: number;
    @JsonProperty
    StatusView?: number;
    oldStatusView?: number;
    nameSearch?: string;
    @JsonProperty
    AckType: number;
    AsmStatuses: any;
    @JsonProperty({ type: Array, elements: { type: Asset, name: 'Asset' } })
    Assets: Array<Asset>;
    BypassType: number;
    @JsonProperty({ type: Array, elements: { type: Location, name: 'Location' } })
    Children: Array<Location>;
    @JsonProperty
    CsNumber: string;
    @JsonProperty
    EndDate: string;
    @JsonProperty
    GeoType: number;
    @JsonProperty
    HasMapImage: boolean;
    @JsonProperty({ type: Array, elements: { type: Device, name: 'Device' } })
    IntelliChecks: Array<Device>;
    @JsonProperty
    Latitude: number;
    @JsonProperty
    LockCount: number;
    @JsonProperty
    Longitude: number;
    @JsonProperty
    ParentID: number;
    @JsonProperty
    PlaceID: string;
    @JsonProperty
    Provider: number;
    @JsonProperty({ type: Array, elements: { type: LocationTag, name: 'LocationTag' } })
    Tags: Array<LocationTag>;
    @JsonProperty
    ZoneName: string;
    LDAPGroup: string;
    RowState: number = DataRowStates.UNCHANGED;

    Devices: Array<Device>;
}
