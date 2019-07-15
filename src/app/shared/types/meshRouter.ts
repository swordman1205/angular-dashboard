import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { MeshRouterLog } from './meshRouterLog';
import { DataRowStates } from '../data/enums/data-row-state.enum';



@JsonObject
export class MeshRouter {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    IntelliGateID: number;
    @JsonProperty
    NodeID: string;
    @JsonProperty
    PhysicalID: string;
    @JsonProperty
    NetworkAddress: string;
    @JsonProperty
    ParentAddress: string;
    @JsonProperty
    DeviceType: number;
    @JsonProperty
    ProfileID: number;
    @JsonProperty
    ManufactureID: number;
    @JsonProperty
    FirmwareVer: number;
    @JsonProperty
    NodeJoinTime: number;
    @JsonProperty
    LastUpdate: Date;
    @JsonProperty
    StartDate: Date;
    @JsonProperty
    EndDate: Date;
    @JsonProperty
    DeviceTypeID: number;
    @JsonProperty
    ParentID: number;
    @JsonProperty
    RSSI: string;
    @JsonProperty
    IsConnected: boolean;
    @JsonProperty
    ZoneID: string;
    @JsonProperty
    LastRTUpdate: Date;
    @JsonProperty
    NotValid: boolean;
    @JsonProperty
    LastLog: MeshRouterLog;

    RowState: number = DataRowStates.UNCHANGED;

    get Label(): string {
        // return ServiceHelper.getDeviceType(DeviceTypeID).Name + " " +
        //     ServiceHelper.getPhysicalIDSnippet(PhysicalID)
        return this.PhysicalID;
    }

    Status: string;
    lblColor: string;
}
