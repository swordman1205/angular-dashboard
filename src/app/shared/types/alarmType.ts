import { AlarmTypeSchedule } from './alarmTypeSchedule';
import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject({ knownTypes: [AlarmTypeSchedule] })
export class AlarmType implements IECSObject {
	@JsonProperty
	Seq?: number;
	@JsonProperty
	ID: number;
	@JsonProperty
	RootLocationID: number;
	@JsonProperty
	Name: string;
	@JsonProperty
	AlarmDelay: number;
	@JsonProperty
	AlarmBypass: boolean;
	@JsonProperty({ type: Array, elements: { type: AlarmTypeSchedule, name: 'AlarmTypeSchedule' } })
	Schedules: Array<AlarmTypeSchedule>;

	RowState: number = DataRowStates.UNCHANGED;
}

