import { JsonObject, JsonProperty } from '../services/io/json-metadata';


@JsonObject
export class ApplicationSetting {
  @JsonProperty
  Description: string;
  @JsonProperty
  GroupName: string;
  @JsonProperty
  Name: string;
  @JsonProperty
  Value: string;
}
