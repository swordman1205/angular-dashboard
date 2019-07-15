import { JsonObject, JsonProperty } from '../services/io/json-metadata';


@JsonObject
export class UserType {
    @JsonProperty
    Description: string;
    @JsonProperty
    ID: number;
    @JsonProperty
    Name: string;
}
