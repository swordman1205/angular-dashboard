import { JsonObject, JsonProperty } from '../services/io/json-metadata';

@JsonObject
export class ZoneRule {
    @JsonProperty
    Format: string;
    @JsonProperty
    GmtOffset: string;
    @JsonProperty
    RuleName: string;
    @JsonProperty
    Until: Date;
    @JsonProperty
    ZoneName: string;
}
