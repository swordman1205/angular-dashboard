import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { CookingCycleResultDocument } from './cookingCycleResultDocument';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject({ knownTypes: [CookingCycleResultDocument] })
export class CookingCycleResultGroup implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    RuleID: string;    // is collection of all of the results i.e: 1,2,3
    @JsonProperty
    RuleName: string;
    @JsonProperty
    ProductName: string;
    @JsonProperty
    ProductID: number;
    @JsonProperty
    MonitoringStart: Date;
    @JsonProperty
    MonitoringFinish: Date;
    @JsonProperty
    StartTime: string;
    @JsonProperty
    ElapsedTime: string;
    @JsonProperty
    SignerName: string;
    @JsonProperty
    SignedDate: string;
    @JsonProperty
    SignString: string;
    @JsonProperty
    ReleaseFromHoldName: string;
    @JsonProperty
    ReleaseFromHoldDate: string;
    @JsonProperty
    ReleaseString: string;
    @JsonProperty
    GroupID: string;
    @JsonProperty
    CoolingCCP: number;
    @JsonProperty
    HeatingCCP: number;
    @JsonProperty
    LabOk: number;
    @JsonProperty({ type: Array, elements: { type: CookingCycleResultDocument, name: 'CookingCycleResultDocument' } })
    documents: Array<CookingCycleResultDocument>;

    RowState: number = DataRowStates.UNCHANGED;
}
