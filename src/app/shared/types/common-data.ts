import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { ApplicationSetting } from './applicationSetting';
import { CheckItemImage } from './checkItemImage';
import { DeviceType } from './deviceType';
import { DeviceTypePort } from './deviceTypePort';
import { Measure } from './measure';
import { MeasureUnit } from './measureUnit';
import { Port } from './port';
import { Report } from './report';
import { SMSCarrier } from './smsCarrier';
import { TicketReason } from './ticketReason';
import { Timezone } from './timezone';
import { UserType } from './userType';


@JsonObject({
    knownTypes: [ApplicationSetting, CheckItemImage,
        DeviceType, DeviceTypePort, Measure, MeasureUnit, Port,
        Report, SMSCarrier, TicketReason, Timezone, UserType, MeasureUnit]
})
export class CommonData {
    $id: string;
    $type: string;
    @JsonProperty({ type: Array, elements: { type: ApplicationSetting, name: 'ApplicationSetting' } })
    ApplicationSettings: Array<ApplicationSetting>;
    @JsonProperty({ type: Array, elements: { type: CheckItemImage, name: 'CheckItemImage' } })
    CheckItemImages: Array<CheckItemImage>;
    @JsonProperty({ type: Array, elements: { type: DeviceType, name: 'DeviceType' } })
    DeviceTypes: Array<DeviceType>;
    @JsonProperty({ type: Array, elements: { type: DeviceTypePort, name: 'DeviceTypePort' } })
    DeviceTypesPorts: Array<DeviceTypePort>;
    @JsonProperty({ type: Array, elements: { type: Measure, name: 'Measure' } })
    Measures: Array<Measure>;
    @JsonProperty({ type: Array, elements: { type: MeasureUnit, name: 'MeasureUnit' } })
    MeasureUnits: Array<MeasureUnit>;
    @JsonProperty({ type: Array, elements: { type: Port, name: 'Port' } })
    Ports: Array<Port>;
    @JsonProperty({ type: Array, elements: { type: Report, name: 'Report' } })
    Reports: Array<Report>;
    @JsonProperty({ type: Array, elements: { type: SMSCarrier, name: 'SMSCarrier' } })
    SMSCarriers: Array<SMSCarrier>;
    @JsonProperty({ type: Array, elements: { type: TicketReason, name: 'TicketReason' } })
    TicketReasons: Array<TicketReason>;
    @JsonProperty({ type: Array, elements: { type: Timezone, name: 'Timezone' } })
    Timezones: Array<Timezone>;
    @JsonProperty({ type: Array, elements: { type: UserType, name: 'UserType' } })
    UserTypes: Array<UserType>;
    @JsonProperty({ type: Array, elements: { type: MeasureUnit, name: 'MeasureUnit' } })
    MeasuresUnits: Array<MeasureUnit>;
}
