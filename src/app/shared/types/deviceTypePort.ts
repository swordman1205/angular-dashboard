import { JsonObject, JsonProperty } from '../services/io/json-metadata';

@JsonObject
export class DeviceTypePort {
  @JsonProperty
  DeviceTypeID: number;
  @JsonProperty
  ID: number;
  @JsonProperty
  Name: string;
  @JsonProperty
  PortID: number;
  @JsonProperty
  RowState: number;

  Icon: string;
  PortType: string;
  Measurement: any;
  EditMode: boolean;
}
