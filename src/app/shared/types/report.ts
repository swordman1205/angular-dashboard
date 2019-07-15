import { JsonObject, JsonProperty } from '../services/io/json-metadata';


@JsonObject
export class Report {
    @JsonProperty
    ID: number;
    @JsonProperty
    Name: string;
}
