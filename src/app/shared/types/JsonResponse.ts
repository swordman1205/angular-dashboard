import { JsonObject, JsonProperty } from '../services/io/json-metadata';


@JsonObject
export class JsonResponse {
    @JsonProperty
    Action: string;
    @JsonProperty
    HasError: boolean;
    @JsonProperty
    ReturnValue: any;
}
