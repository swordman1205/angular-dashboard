import { UserType } from './../types/userType';
import { Injectable } from '@angular/core';
import { CommonData } from '../types/common-data';
import { statusCodes } from '../data/constants/statusCodes';
import { defaults } from '../data/defaults';
import { LogService } from './log.service';
import { TranslateService } from '@ngx-translate/core';
import { statusView } from '../data/constants/statusView';
import { MeasureUnit } from '../types/measureUnit';
import { ApplicationSetting } from '../types/applicationSetting';
import { DeviceType } from '../types/deviceType';
import { Port } from '../types/port';
import { DeviceTypePort } from '../types/deviceTypePort';
import { Measure } from '../types/measure';
import { Report } from '../types/report';
import { SMSCarrier } from '../types/smsCarrier';
import { CheckItemImage } from '../types/checkItemImage';
import { TicketReason } from '../types/ticketReason';
import { Timezone } from '../types/timezone';
import { StatusViews } from '../data/constants/StatusViews';
import { RouterStatusViews } from '../data/constants/routerStatusViews';
import { DeviceTypes } from '../data/constants/deviceTypes';
import { User } from '../types/user';
import { EscalationStatusViews } from '../data/constants/escalationStatusView';




@Injectable()
export class CommonService {

    private _applicationSettingMap: { [groupNameAndName: string]: ApplicationSetting; } = {};
    private _deviceTypeMap: { [id: number]: DeviceType; } = {};
    private _portMap: { [id: number]: Port; } = {};
    private _deviceTypePortMap: { [id: number]: DeviceTypePort; } = {};
    private _measureMap: { [id: number]: Measure; } = {};
    private _measureUnitMap: { [id: number]: MeasureUnit; } = {};
    private _reportsMap: { [id: number]: Report; } = {};
    private _smsCarriersMap: { [id: number]: SMSCarrier; } = {};
    private _checkItemImageMap: { [id: number]: CheckItemImage; } = {};
    private _ticketReasonsMap: { [id: number]: TicketReason; } = {};
    private _timeZonesMap: { [name: string]: Timezone; } = {};
    private _userTypesMap: { [id: number]: UserType; } = {};
    private _locationMap: { [id: number]: {} } = {};
    commonData: CommonData;
    private _loggedUser: User;







    constructor(private _logger: LogService, private _translate: TranslateService) {
    }



    get loggedUser(): User {
        return this._loggedUser;
    }

    get maxSearchFilterDays(): number {
        return parseInt(this.getApplicationSetting('General', 'MaxSearchFilterDays').Value, 10);
    }




    init(data, user: User) {
        this.commonData = <CommonData>data;
        this._loggedUser = user;
        this.createMaps();
    }




    createMaps() {
        this.commonData.Measures.forEach(obj => this._measureMap[obj.ID] = obj);
        this.commonData.MeasuresUnits.forEach(obj => this._measureUnitMap[obj.ID] = obj);
        this.commonData.Ports.forEach(obj => this._portMap[obj.ID] = obj);
        this.commonData.DeviceTypes.forEach(obj => this._deviceTypeMap[obj.ID] = obj);
        this.commonData.DeviceTypesPorts.forEach(obj => this._deviceTypePortMap[obj.ID] = obj);
        this.commonData.ApplicationSettings.forEach(obj => this._applicationSettingMap[obj.GroupName + '_' + obj.Name] = obj);
        this.commonData.Reports.forEach(obj => this._reportsMap[obj.ID] = obj);
        this.commonData.SMSCarriers.forEach(obj => this._smsCarriersMap[obj.ID] = obj);
        this.commonData.CheckItemImages.forEach(obj => this._checkItemImageMap[obj.ID] = obj);
        this.commonData.TicketReasons.forEach(obj => this._ticketReasonsMap[obj.ID] = obj);
        this.commonData.Timezones.forEach(obj => this._timeZonesMap[obj.Name] = obj);
        this.commonData.UserTypes.forEach(obj => this._userTypesMap[obj.ID] = obj);
    }

    reset() {
        this.commonData = undefined;
    }

    getCommonData(): CommonData {
        return this.commonData;
    }

    getApplicationSetting(groupName: string, name: string) {
        return this._applicationSettingMap[`${groupName}_${name}`];
    }

    getStatusName(statusCode, alarmClear = defaults.NAFEM_FALSE, statusType: number = 0) {
        let statusName = '';

        switch (statusType) {
            case 0: {
                const statusNameMeta = statusCodes[statusCode.toString()];

                if (statusNameMeta) {
                    statusName = this._translate.instant(statusNameMeta.caption);

                    if (alarmClear === defaults.NAFEM_TRUE) {
                        statusName += ' (Ack.)';
                    }
                }
                break;
            }

            case 1: {
                switch (statusCode) {
                    case 0:
                        statusName = 'OK';
                        break;
                    case 1:
                        statusName = 'Power Alert';
                        break;
                    case 2:
                        statusName = 'Charging Fault';
                        break;
                    case 3:
                        statusName = 'Disconnected';
                        break;
                }
                break;
            }

            case 2: {
                switch (statusCode) {
                    case 1: {
                        statusName = 'Escalation OK';
                        break;
                    }

                    case 2: {
                        statusName = 'Escalation Warning';
                        break;
                    }

                    case 4: {
                        statusName = 'Escalation Alarm';
                        break;
                    }
                }
                break;
            }
        }

        return statusName;
    }

    getStatusViewIcon(statusViewCode: number, statusType: number = 0) {
        if (statusType === 0) {
            return statusView[statusViewCode] ? statusView[statusViewCode].statusIcon : undefined;
        } else if (statusType === 1) {
            switch (statusViewCode) {
                case 0: {
                    return statusView[100].statusIcon;  // OK
                }
                case 1: {
                    return statusView[400].statusIcon;  // CRITICAL
                }

                case 2: {
                    return statusView[500].statusIcon;  // FAULT
                }

                case 3: {
                    return statusView[900].statusIcon;  // DISCONNECTED
                }
            }
        }

        return undefined;
    }

    getStatusViewName(statusViewCode: number, statusType: number = 0): string {
        switch (statusType) {
            case 0: {
                return StatusViews[statusViewCode] ? StatusViews[statusViewCode].caption : `Unsupported status: ${statusViewCode}`;
            }

            case 1: { // MeshRouters
                return RouterStatusViews[statusViewCode] ?
                    RouterStatusViews[statusViewCode].caption :
                    `Unsupported status: ${statusViewCode}`;
            }

            case 2: { // Escalations
                return EscalationStatusViews[statusViewCode] ?
                    EscalationStatusViews[statusViewCode].caption :
                    `Unsupported status: ${statusViewCode}`;
            }
        }
    }

    getUserType(userTypeID: number): UserType {
        const userTypes = this.commonData.UserTypes;

        for (let i = 0; i < userTypes.length; i++) {
            if (userTypes[i].ID === userTypeID) {
                return userTypes[i];
            }
        }

        return null;
    }

    getTicketReasonName(ticketReasonID) {
        const ticketReason = this.getTicketReason(ticketReasonID);
        return ticketReason ? ticketReason.Name : null;
    }

    getTicketReason(ticketReasonID) {
        if (this.commonData) {
            const ticketReasons = this.commonData.TicketReasons;

            for (let i = 0; i < ticketReasons.length; i++) {
                if (ticketReasons[i].ID === ticketReasonID) {
                    return ticketReasons[i];
                }
            }
        }
    }

    getMeasureUnit(id: number): MeasureUnit | undefined {
        return this._measureUnitMap[id] ? this._measureUnitMap[id] : undefined;
    }

    getMeasureUnitText(id: number): string {
        const mu = this.getMeasureUnit(id);
        if (mu) {
            return mu.MeasureID === 1 ? ` °${mu.Name}` : mu.Name;
        }
        this._logger.warn(`No measure unit found for id: ${id}`);
        return '';
    }

    getDeviceType(id: number): DeviceType | undefined {
        return this._deviceTypeMap[id] ? this._deviceTypeMap[id] : undefined;
    }


    getPhysicalIDSnippet(physicalID: String): String {
        const shortPhysicalID: String = '(' + physicalID.slice(Math.max(physicalID.length - 4, 0)).toString() + ')';
        return physicalID.length > 2 ? shortPhysicalID : '';
    }


    getDeviceTypePorts(deviceTypeID: number): Array<DeviceTypePort> {
        const ports: Array<DeviceTypePort> = new Array<DeviceTypePort>();
        // tslint:disable-next-line:forin
        for (const prop in this._deviceTypePortMap) {
            const dvcPort: DeviceTypePort = this._deviceTypePortMap[prop];
            if (dvcPort.DeviceTypeID === deviceTypeID) {
                ports.push(this._deviceTypePortMap[prop]);
            }
        }

        return ports;
    }


    getPort(portID: number): Port {
        // tslint:disable-next-line:forin
        for (const id in this._portMap) {
            if (this._portMap[id].ID === portID) {
                return this._portMap[id];
            }
        }

        return null;
    }


    getEditableDeviceTypes(): Array<DeviceType> {
        const deviceTypes: Array<DeviceType> = [];
        // tslint:disable-next-line:forin
        for (const prop in this._deviceTypeMap) {
            const dvcType: DeviceType = this._deviceTypeMap[prop];
            switch (dvcType.ID) {
                case DeviceTypes.NOT_SUPPORTED:
                case DeviceTypes.FUSION_SERVER:
                case DeviceTypes.INTELLICHECK:
                case DeviceTypes.MESH_ROUTER:
                    continue;

                default:
                    deviceTypes.push(dvcType);
                    continue;
            }
        }

        return deviceTypes;
    }


    getDefaultMeasureUnitID(measureID: number): number {
        const defaultMeasureUnit: MeasureUnit = this.getDefaultMeasureUnit(measureID);
        return defaultMeasureUnit ? defaultMeasureUnit.ID : 0;
    }


    getDefaultMeasureUnit(measureID: number): MeasureUnit {
        const defaultMeasureUnit: MeasureUnit = this.commonData.MeasuresUnits.find(
            (measureUnit: MeasureUnit) => measureUnit.MeasureID === measureID && measureUnit.Formula === 'x');

        return defaultMeasureUnit;
    }
}
