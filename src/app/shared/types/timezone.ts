import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { ZoneRule } from './zoneRule';


@JsonObject({ knownTypes: [ZoneRule] })
export class Timezone {
    @JsonProperty
    Name: string;
    @JsonProperty
    Now: Date;
    @JsonProperty({ type: Array, elements: { type: ZoneRule, name: 'ZoneRule' } })
    ZoneRules: Array<ZoneRule>;
}
