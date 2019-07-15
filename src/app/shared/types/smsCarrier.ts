import { JsonObject, JsonProperty } from '../services/io/json-metadata';


@JsonObject
export class SMSCarrier {
    @JsonProperty
    Carrier: string;
    @JsonProperty
    Gateway: string;
    @JsonProperty
    ID: number;
    @JsonProperty
    Region: string;
}
