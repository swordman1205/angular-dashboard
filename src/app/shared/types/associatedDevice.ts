import { JsonObject, JsonProperty } from '../services/io/json-metadata';



@JsonObject
export class AssociatedDevice {
    @JsonProperty
    ID: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    DeviceTypeID: number;
    @JsonProperty
    ParentID: number;
    @JsonProperty
    PhysicalID: string;
    @JsonProperty
    StartDate: Date;
    @JsonProperty
    EndDate: Date;
    @JsonProperty
    AssociationType: number;
    @JsonProperty
    RSSI: string;
    @JsonProperty
    LastUpdate: Date;
}
