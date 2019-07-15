import { JsonObject, JsonProperty } from '../services/io/json-metadata';

@JsonObject
export class Port {
    @JsonProperty
    ID: number;
    @JsonProperty
    Pluggable: boolean;
    @JsonProperty
    Type: string;
}

