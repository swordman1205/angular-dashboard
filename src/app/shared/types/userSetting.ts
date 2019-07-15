import { JsonObject, JsonProperty } from '../services/io/json-metadata';



@JsonObject
export class UserSetting {
    @JsonProperty({ type: Array, elements: { type: String } })
    AssetTags: Array<string>; // $id, $type, $values
    @JsonProperty
    AssetTagsString: string;
    @JsonProperty({ type: Array, elements: { type: String } })
    LocationTags: Array<string>;  // $id, $type, $values
    @JsonProperty
    LocationTagsString: string;
    @JsonProperty
    UserID: number;
}
