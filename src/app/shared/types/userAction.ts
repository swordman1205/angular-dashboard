import { JsonObject, JsonProperty } from '../services/io/json-metadata';

@JsonObject
export class UserAction {
	@JsonProperty
	ID: number;
	@JsonProperty
	ActionName: string;
	@JsonProperty
	LocationID: number;
	@JsonProperty
	UserID: number;
	@JsonProperty
	Timestamp?: Date;
	@JsonProperty
	ObjectTypeID: number;
	@JsonProperty
	ObjectID: number;
	@JsonProperty
	ObjectName: string;
	@JsonProperty
	ObjectRowState: number;
	@JsonProperty
	Description: Date;
	@JsonProperty
	LocationName: string;
	@JsonProperty
	UserName: string;

	TimeStampParsed: string;
}
