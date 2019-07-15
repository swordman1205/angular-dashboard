
import { JsonObject, JsonProperty } from '../services/io/json-metadata';

@JsonObject
export class Hop {
    @JsonProperty
    ID: number;
    @JsonProperty
    Ordinal: number;
    @JsonProperty
    RouteRecordID: number;
    @JsonProperty
    HopInt: number;
    @JsonProperty
    PhysicalID: string;
    @JsonProperty
    NetwordAddress: string;
    @JsonProperty
    RouterID: number;
}
