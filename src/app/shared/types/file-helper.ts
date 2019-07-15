import { Location } from './location';
import { Asset } from './asset';
import { AssetMeasure } from './assetMeasure';
import { LocationTag } from './locationTag';
import { AssetTag } from './assetTag';
import { Device } from './device';
import { Measure } from './measure';
import { Measurement } from './measurement';
import { MeasureUnit } from './measureUnit';
import { User } from './user';
import { UserType } from './userType';
import { Port } from './port';
import { DeviceType } from './deviceType';
import { DeviceTypePort } from './deviceTypePort';
import { ApplicationSetting } from './applicationSetting';
import { Report } from './report';
import { SMSCarrier } from './smsCarrier';
import { CheckItemImage } from './checkItemImage';
import { TicketReason } from './ticketReason';
import { Timezone } from './timezone';
import { CommonData } from './common-data';
import { UserAction } from './userAction';
import { AssetMeasureLastStatus } from './assetMeasureLastStatus';
import { AssetMeasureLastValue } from './assetMeasureLastValue';
import { AssetMeasureLog } from './assetMeasureLog';
import { UserSetting } from './userSetting';
import { AssetMeasureStatus } from './assetMeasureStatus';
import { MeshRouterStatus } from './meshRouterStatus';
import { Ticket } from './ticket';
import { CheckForm } from './checkForm';
import { CheckItem } from './checkItem';
import { CheckStep } from './checkStep';
import { CheckThreshold } from './checkThreshold';
import { CheckChoice } from './checkChoice';
import { MeshRouter } from './meshRouter';
import { MeshRouterLog } from './meshRouterLog';
import { UserAlert } from './userAlert';
import { AlertType } from './alertType';
import { LocationContactAlert } from './locationContactAlert';
import { LocationContact } from './locationContact';
import { AssetType } from './assetType';
import { AssetMeasureType } from './assetMeasureType';
import { PreventiveMaintenance } from './preventiveMaintenance';
import { TicketCause } from './ticketCause';
import { TicketAction } from './ticketAction';
import { CookingCycleResult } from './cookingCycleResult';
import { CookingCycleResultDocument } from './cookingCycleResultDocument';
import { CookingCycleResultGroup } from './cookingCycleResultGroup';
import { CookingCycleRule } from './cookingCycleRule';
import { CookingCycleTemplate } from './cookingCycleTemplate';
import { CookingResultSignature } from './cookingResultSignature';
import { BatteryLog } from './batteryLog';
import { CheckItemStep } from './checkItemStep';
import { CheckAction } from './checkAction';
import { AlarmType } from './alarmType';
import { AlarmTypeSchedule } from './alarmTypeSchedule';
import { Hop } from './hop';
import { RouteRecord } from './routeRecord';
import { CheckFormItem } from './checkFormItem';

// import * as types from '../types/';




export namespace FileHelpers {

    const ctors: { [name: string]: { new(): any } } = {
        'Location': Location,
        'Asset': Asset,
        'AssetMeasure': AssetMeasure,
        'AssetMeasureStatus': AssetMeasureStatus,
        'MeshRouterStatus': MeshRouterStatus,
        'AssetMeasureLog': AssetMeasureLog,
        'CommonData': CommonData,
        'LocationTag': LocationTag,
        'AssetTag': AssetTag,
        'Device': Device,
        'MeshRouter': MeshRouter,
        'MeshRouterLog': MeshRouterLog,
        'Measure': Measure,
        'Measurement': Measurement,
        'MeasureUnit': MeasureUnit,
        'User': User,
        'UserType': UserType,
        'Port': Port,
        'DeviceType': DeviceType,
        'DeviceTypePort': DeviceTypePort,
        'ApplicationSettings': ApplicationSetting,
        'Report': Report,
        'SMSCarriers': SMSCarrier,
        'CheckItemImages': CheckItemImage,
        'TicketReasons': TicketReason,
        'Timezone': Timezone,
        'UserAction': UserAction,
        'AssetMeasureLastStatus': AssetMeasureLastStatus,
        'AssetMeasureLastValue': AssetMeasureLastValue,
        'UserSetting': UserSetting,
        'Ticket': Ticket,
        'CheckForm': CheckForm,
        'CheckFormItem': CheckFormItem,
        'CheckItem': CheckItem,
        'CheckStep': CheckStep,
        'CheckThreshold': CheckThreshold,
        'CheckChoice': CheckChoice,
        'UserAlert': UserAlert,
        'AlertType': AlertType,
        'AlarmType': AlarmType,
        'LocationContactAlert': LocationContactAlert,
        'LocationContact': LocationContact,
        'AssetType': AssetType,
        'AssetMeasureType': AssetMeasureType,
        'PreventiveMaintenance': PreventiveMaintenance,
        'TicketCause': TicketCause,
        'TicketAction': TicketAction,
        'CookingCycleResult': CookingCycleResult,
        'CookingCycleResultDocument': CookingCycleResultDocument,
        'CookingCycleResultGroup': CookingCycleResultGroup,
        'CookingCycleRule': CookingCycleRule,
        'CookingCycleTemplate': CookingCycleTemplate,
        'CookingResultSignature': CookingResultSignature,
        'BatteryLog': BatteryLog,
        'CheckItemStep': CheckItemStep,
        'CheckAction': CheckAction,
        'AlarmTypeSchedule': AlarmTypeSchedule,
        'RouteRecord': RouteRecord,
        'Hop': Hop
    };

    export function typeFactory(name: string): { new(): any } {
        const ctor = ctors[name];

        if (!ctor) {
            return null;
        }

        return ctor;
    }

}

