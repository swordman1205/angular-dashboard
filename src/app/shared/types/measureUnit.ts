import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject
export class MeasureUnit implements IECSObject {
  @JsonProperty
  Description: string;
  @JsonProperty
  Formula: string;
  @JsonProperty
  Seq?: number;
  @JsonProperty
  ID: number;
  @JsonProperty
  MeasureID: number;
  @JsonProperty
  Name: string;
  @JsonProperty
  ReverseFormula: string;

  RowState: number = DataRowStates.UNCHANGED;
}
