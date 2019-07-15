import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject
export class UserAlert implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    UserID: number;
    @JsonProperty
    ObjectTypeID: number;
    @JsonProperty
    ObjectID: number;
    @JsonProperty
    AlertTypeID: number;
    @JsonProperty
    Mail: boolean;
    @JsonProperty
    SMS: boolean;
    @JsonProperty
    Voice: boolean;

    RowState: number = DataRowStates.UNCHANGED;
    UserName: string;

    UsrEdit = false;
    AstEdit = false;
    AsmEdit = false;
    AlrtTypeEdit = false;
}
