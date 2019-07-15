import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';
import { MeasureUnit } from './measureUnit';


@JsonObject
export class CookingCycleRule implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    Name: string;
    @JsonProperty
    StartTemperature: Number;
    @JsonProperty
    MarkTemperature: Number;
    @JsonProperty
    Timespan: Number;
    @JsonProperty
    Ordinal: number;
    @JsonProperty
    TemplateID: number;
    @JsonProperty
    ProductName: string;
    @JsonProperty
    CheckItemID: number;
    @JsonProperty({ type: MeasureUnit })
    Unit: MeasureUnit;

    RowState: number = DataRowStates.UNCHANGED;
    NameInEdit: boolean;



    static clone(rule: Object): CookingCycleRule {
        const cloned: CookingCycleRule = new CookingCycleRule();
        cloned.Name = rule['Name'] + '_Copy';
        cloned.StartTemperature = rule['StartTemperature'];
        cloned.MarkTemperature = rule['MarkTemperature'];
        cloned.Timespan = rule['Timespan'];
        cloned.Ordinal = rule['Ordinal'];
        cloned.TemplateID = rule['TemplateID'];
        cloned.ProductName = rule['ProductName'];
        cloned.CheckItemID = rule['CheckItemID'];
        cloned.Unit = rule['Unit'];
        cloned.RowState = DataRowStates.ADDED;

        return cloned;
    }

    clone(): CookingCycleRule {
        const rule: CookingCycleRule = new CookingCycleRule();
        rule.Name = this.Name + '_Copy';
        rule.StartTemperature = this.StartTemperature;
        rule.MarkTemperature = this.MarkTemperature;
        rule.Timespan = this.Timespan;
        rule.Ordinal = this.Ordinal;
        rule.TemplateID = this.TemplateID;
        rule.ProductName = this.ProductName;
        rule.CheckItemID = this.CheckItemID;
        rule.Unit = this.Unit;
        rule.RowState = DataRowStates.ADDED;

        return rule;
    }


}
