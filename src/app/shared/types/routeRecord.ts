import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { Hop } from './hop';


@JsonObject({ knownTypes: [Hop] })
export class RouteRecord {
    @JsonProperty
    ID: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    DeviceID: number;
    @JsonProperty
    AssociationType: number;
    @JsonProperty
    PhysicalID: string;
    @JsonProperty
    NetwordAddress: string;
    @JsonProperty
    RecordIndex: number;
    @JsonProperty
    RxOption: number;
    @JsonProperty
    TimeStamp: Date;
    @JsonProperty
    HopsNum: number;
    @JsonProperty
    RecordsCount: number;
    @JsonProperty({ type: Array, elements: { type: Hop, name: 'Hop' } })
    Hops: Array<Hop>;
}
