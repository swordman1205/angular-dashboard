import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { CheckFormItem } from './checkFormItem';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject({ knownTypes: [CheckFormItem] })
export class CheckForm implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    Name: string;
    @JsonProperty
    Scheduled: boolean;
    @JsonProperty
    Description: string;
    @JsonProperty
    IButtonID: string;
    @JsonProperty({ type: Array, elements: { type: CheckFormItem, name: 'CheckFormItem' } })
    Items: Array<CheckFormItem>;

    RowState: number = DataRowStates.UNCHANGED;
    Sync: boolean;
}
