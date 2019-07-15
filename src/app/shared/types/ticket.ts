import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';

@JsonObject
export class Ticket implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    AssetID: number;
    @JsonProperty
    ObjectTypeID: number;
    @JsonProperty
    ObjectID: number;
    @JsonProperty
    ObjectName: string;
    @JsonProperty
    CreatedOn: Date;
    @JsonProperty
    CreatedBy: number;
    @JsonProperty
    ClosedOn: Date;
    @JsonProperty
    CloserTypeID: number;
    @JsonProperty
    ClosedBy: number;
    @JsonProperty
    TicketReasonID: number;
    @JsonProperty
    TicketCauseID: number;
    @JsonProperty
    TicketActionID: number;
    @JsonProperty
    Cost: number;
    @JsonProperty
    InWarranty: boolean;
    @JsonProperty
    Acknowledged: boolean;
    @JsonProperty
    PrevMainID: number;
    @JsonProperty
    AlertTime: Date;
    @JsonProperty
    LocationName: string;
    @JsonProperty
    AssetName: string;
    @JsonProperty
    AssetMeasureName: string;
    @JsonProperty
    TicketReasonName: string;
    @JsonProperty
    TicketCauseName: string;
    @JsonProperty
    TicketActionName: string;
    @JsonProperty
    AssetTypeName: string;
    @JsonProperty
    Manufacturer: string;
    @JsonProperty
    ModelNumber: string;
    @JsonProperty
    SerialNumber: string;
    @JsonProperty
    DeviceID: number;
    @JsonProperty
    DeviceTypeID: number;

    RowState: number = DataRowStates.UNCHANGED;
}
