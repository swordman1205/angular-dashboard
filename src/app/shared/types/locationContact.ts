import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject
export class LocationContact implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    ContactName: string;
    @JsonProperty
    AddressText: string;
    @JsonProperty
    Street: string;
    @JsonProperty
    City: string;
    @JsonProperty
    State: string;
    @JsonProperty
    PostalCode: string;
    @JsonProperty
    Country: string;
    @JsonProperty
    Phone1: string;
    @JsonProperty
    Phone2: string;
    @JsonProperty
    MobilePhone: string;
    @JsonProperty
    Fax: string;
    @JsonProperty
    Email: string;
    @JsonProperty
    Email2: string;
    @JsonProperty
    Email3: string;
    @JsonProperty
    URL: string;
    @JsonProperty
    ZoneName: string;

    RowState: number = DataRowStates.UNCHANGED;
}
