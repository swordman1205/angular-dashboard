import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject
export class CookingResultSignature implements IECSObject {
    @JsonProperty
    GroupID: string;
    @JsonProperty
    SignedDate: Date;
    @JsonProperty
    ReleaseFromHoldDate: Date;
    @JsonProperty
    SignedUserFirstName: string;
    @JsonProperty
    SignedUserMiddleName: string;
    @JsonProperty
    SignedUserLastName: string;
    @JsonProperty
    ReleasedFromHoldSignFirstName: string;
    @JsonProperty
    ReleasedFromHoldSignMiddleName: string;
    @JsonProperty
    ReleasedFromHoldSignLastName: string;

    RowState: number = DataRowStates.UNCHANGED;
    ID: number;
    Seq?: number;
}
