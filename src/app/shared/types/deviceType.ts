import { JsonObject, JsonProperty } from '../services/io/json-metadata';


@JsonObject
export class DeviceType {
  @JsonProperty
  ID: number;
  @JsonProperty
  Manufacturer: string;
  @JsonProperty
  ModelNumber: string;
  @JsonProperty
  Name: string;
  @JsonProperty
  Version: string;
}
