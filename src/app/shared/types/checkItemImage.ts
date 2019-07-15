import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';

@JsonObject
export class CheckItemImage implements IECSObject {
  @JsonProperty
  Seq?: number;
  @JsonProperty
  ID: number;
  @JsonProperty
  LastUpdate: Date;
  @JsonProperty
  Name: string;

  RowState: number = DataRowStates.UNCHANGED;
}
