import { Measurement } from '../types/measurement';
import { Asset } from '../types/asset';
import { AssetMeasure } from '../types/assetMeasure';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { DeviceTypes } from '../data/constants/deviceTypes';
import { Device } from '../types/device';
import { PacketVersions } from '../data/constants/packetVersions';
import { BatteryLog } from '../types/batteryLog';
import { StatusCodesMap } from '../data/constants/statusCodesMap';
import { StatusViewsMap } from '../data/constants/statusViewsMap';
import { EcsDatetimePipe } from '../pipes/ecs-datetime.pipe';
import { CheckForm } from '../types/checkForm';
import { formatDate, formatNumber } from '@angular/common';
import { Report } from '../types/report';
import { UserTypes } from '../data/constants/userTypes';
import { Reports } from '../data/constants/reports';
import { User } from '../types/user';





export namespace ServiceHelper {

    const MINUTES_PER_DAY = (24 * 60);
    const mapVirtulReports = null;

    export function getMeasurements(devices: Array<Device>): Array<Measurement> {
        const measurements: Array<Measurement> = [];
        devices.forEach((device: Device) => {
            if (device.RowState !== DataRowStates.DELETED) {
                device.Measurements.forEach((measurement: Measurement) => {
                    if (measurement.RowState !== DataRowStates.DELETED) {
                        measurements.push(measurement);
                    }
                });

                measurements.push.apply(measurements, getMeasurements(device.Children));
            }
        });

        return measurements;
    }

    export function getDeviceMeasurement(measurements: Measurement[], deviceTypePortID: number): Measurement {
        let measrmnt: Measurement = null;
        measurements.forEach((measurmnt: Measurement) => {
            if (measurmnt.DeviceTypePortID === deviceTypePortID && measurmnt.RowState !== DataRowStates.DELETED) {
                measrmnt = measurmnt;
            }
        });

        return measrmnt;
    }


    export function getAssetByAssetMeasure(assets: Asset[], assetMeasureID: number): Asset {
        let ast: Asset = null;
        assets.forEach((asset: Asset) => {
            asset.Measures.forEach((asm: AssetMeasure) => {
                if (asm.ID === assetMeasureID) {
                    ast = asset;
                }
            });
        });

        return ast;
    }


    export function getAssetMeasure(assetMeasures: AssetMeasure[], assetMeasureID: number): AssetMeasure {
        let asstMeasure: AssetMeasure = null;
        assetMeasures.forEach((asm: AssetMeasure) => {
            if (asm.ID === assetMeasureID) {
                asstMeasure = asm;
            }
        });

        return asstMeasure;
    }


    export function canUpdateFirmware(device: Device): boolean {
        if (device.PacketVer === PacketVersions.WIFI_SENSOR_V3 ||
            parseFloat(device.FirmwareVer) >= 200) {
            return true;
        }

        return false;
    }


    export function canReboot(packetVer: number): boolean {
        switch (packetVer) {
            case PacketVersions.WIFI_SENSOR_V3:
                return true;

            default:
                return false;
        }

    }


    export function isDeviceIntelliGate(deviceTypeID: number): boolean {
        switch (deviceTypeID) {
            case DeviceTypes.INTELLIGATE:
                return true;

            default:
                return false;
        }
    }


    export function isIntelliSensorDevice(deviceTypeID: number): boolean {
        if (isIntelliSensorDeviceWiFi(deviceTypeID) || isIntelliSensorDeviceZB(deviceTypeID)) {
            return true;
        } else {
            return false;
        }
    }


    export function isIntelliSensorDeviceWiFi(deviceTypeID: number): boolean {
        switch (deviceTypeID) {
            case DeviceTypes.TEMPNTC40_WIFI:
            case DeviceTypes.TEMPNTC22_WIFI:
            case DeviceTypes.DISH11_WIFI:
            case DeviceTypes.HUMIDITY22_WIFI:
            case DeviceTypes.TEMPNTCLT40_WIFI:
            case DeviceTypes.ANALOG5V40_WIFI:
            case DeviceTypes.TEMPNTC10_WIFI:
            case DeviceTypes.HUMIDITY11_WIFI:
            case DeviceTypes.TEMPRTD22_WIFI:
            case DeviceTypes.TEMPRTD40_WIFI:
                return true;

            default:
                return false;
        }
    }


    export function isIntelliSensorDeviceZB(deviceTypeID: number): boolean {
        switch (deviceTypeID) {
            case DeviceTypes.TEMPNTC40:
            case DeviceTypes.TEMPNTC22:
            case DeviceTypes.DISH11:
            case DeviceTypes.HUMIDITY22:
            case DeviceTypes.TEMPNTCLT40:
            case DeviceTypes.ANALOG5V40:
            case DeviceTypes.TEMPNTC10:
            case DeviceTypes.HUMIDITY11:
            case DeviceTypes.TEMPRTD22:
            case DeviceTypes.TEMPRTD40:
                return true;

            default:
                return false;
        }
    }


    export function isBatteryDevice(deviceTypeiD: number): boolean {
        switch (deviceTypeiD) {
            case DeviceTypes.TEMPNTC40:
            case DeviceTypes.TEMPNTC22:
            case DeviceTypes.DISH11:
            case DeviceTypes.HUMIDITY22:
            case DeviceTypes.TEMPNTCLT40:
            case DeviceTypes.ANALOG5V40:
            case DeviceTypes.TEMPNTC10:
            case DeviceTypes.HUMIDITY11:
            case DeviceTypes.TEMPRTD22:
            case DeviceTypes.TEMPRTD40:
            case DeviceTypes.TEMPNTC40_WIFI:
            case DeviceTypes.TEMPNTC22_WIFI:
            case DeviceTypes.DISH11_WIFI:
            case DeviceTypes.HUMIDITY22_WIFI:
            case DeviceTypes.TEMPNTCLT40_WIFI:
            case DeviceTypes.ANALOG5V40_WIFI:
            case DeviceTypes.TEMPNTC10_WIFI:
            case DeviceTypes.HUMIDITY11_WIFI:
            case DeviceTypes.TEMPRTD22_WIFI:
            case DeviceTypes.TEMPRTD40_WIFI:
                return true;

            default:
                return false;
        }
    }


    export function getTempMeasureUnitIndex(tempMeasureUnits: Array<string>, tempUnit: string): number {
        let indx = -1;
        indx = tempMeasureUnits.findIndex((temp: string) => temp === tempUnit);
        return indx;
    }


    export function sortArray<T>(arr: Array<T>, byField: string = 'Name', byScndField: string = null, isDesc = false): Array<T> {
        if (!(arr && arr.length > 0)) {
            return null;
        }

        if (!arr[0].hasOwnProperty(byField)) {
            return;
        }

        return arr.sort((item1: T, item2: T) => {
            if (typeof item1[byField] === 'string') {
                let res = naturalCompare(item1[byField], item2[byField], isDesc);
                if (res === 0 && byScndField && byScndField.length > 0) {
                    if (typeof item1[byScndField] === 'string') {
                        res = naturalCompare(item1[byScndField], item2[byScndField], isDesc);
                    } else {
                        res = 0;
                        if (item1[byField] > item2[byField]) {
                            res = isDesc ? -1 : 1;
                        }
                        if (item1[byField] < item2[byField]) {
                            res = isDesc ? 1 : -1;
                        }
                    }
                }
                return res;
            } else {
                if (item1[byField] > item2[byField]) {
                    return isDesc ? -1 : 1;
                }
                if (item1[byField] < item2[byField]) {
                    return isDesc ? 1 : -1;
                }

                if (byScndField && byScndField.length > 0) {
                    if (typeof item1[byScndField] === 'string') {
                        return naturalCompare(item1[byScndField], item2[byScndField], isDesc);
                    } else {
                        if (item1[byScndField] > item2[byScndField]) {
                            return 1;
                        }
                        if (item1[byScndField] < item2[byScndField]) {
                            return -1;
                        }
                    }
                }

                return 0;
            }

        });
    }


    export function formatFirmware(version: string, bank: string): string {
        if (!version && !bank) {
            // this._translate.instant('DEFAULTS.N/A');
            return 'N/A';
        }

        if (version) {
            if (version.indexOf('.') === -1) {
                version = (parseInt(version, 16) / 100).toString();
            }

            return version + (bank ? (' (' + bank + ')') : '');
        }

        return 'N/A';  // this._translate.instant('DEFAULTS.N/A');
    }


    export function getBatteryStatus(device: Device): string {
        if (!device || !isBatteryDevice(device.DeviceTypeID) ||
            !device.BatteryLogs || device.BatteryLogs.length === 0) {
            return 'N/A';
        }

        const batteryLog: BatteryLog = device.BatteryLogs[0];
        let status: string = getStatusName(batteryLog.BatteryStatus);

        if (status !== '' && batteryLog.StatusTimestamp) {
            status += ' (' + EcsDatetimePipe.call(this, batteryLog.StatusTimestamp) + ')';
        }

        return status;
    }


    export function getStatusName(statusCode: number, alarmClear: number = 0, statusType: number = 0): string {
        let statusName: string;

        if (statusType === 0) {
            switch (statusCode) {
                case StatusCodesMap.OK:
                    statusName = 'OK';
                    break;

                case StatusCodesMap.WARNING: {
                    // if (Client.instance.loggedUser.ShowWarnings) {
                    statusName = 'Warning';
                    // }
                    // else {
                    //     statusName = 'OK';
                    // }
                    break;
                }


                case StatusCodesMap.CRITICAL:
                    statusName = 'Critical';
                    break;

                case StatusCodesMap.FAULT:
                    statusName = 'Fault - General';
                    break;

                case StatusCodesMap.FAULT_OPEN:
                    statusName = 'Fault - Open Sensor';
                    break;

                case StatusCodesMap.FAULT_SHORTED:
                    statusName = 'Fault - Shorted Sensor';
                    break;

                case StatusCodesMap.FAULT_COMM:
                    statusName = 'Fault - Communication Error';
                    break;

                case StatusCodesMap.DISCONNECTED:
                    statusName = 'Disconnected';
                    break;

                case StatusCodesMap.ROUTER_DISCONNECTED:
                    statusName = 'Router Disconnected';
                    break;

                case StatusCodesMap.ROUTER_CHARGING_FAULT:
                    statusName = 'Router Charging Fault';
                    break;

                case StatusCodesMap.ROUTER_POWER_ALERT:
                    statusName = 'Router Power Alert';
                    break;

                default:
                    statusName = '';
                    break;
            }
        }

        if (statusType === 1) {
            switch (statusCode) {
                case 0: {
                    statusName = 'OK';
                    break;
                }

                case 1: {
                    statusName = 'Power Alert';
                    break;
                }

                case 2: {
                    statusName = 'Charging Fault';
                    break;
                }

                case 3: {
                    statusName = 'Disconnected';
                    break;
                }
            }
        }

        return statusName;
    }


    export function getStatusViewName(statusView: number, statusType: number = 0): string {
        let statusName: string = null;

        if (statusType === 0) {
            switch (statusView) {
                case StatusViewsMap.OK: {
                    statusName = 'OK';
                    break;
                }

                case StatusViewsMap.SNOOZE: {
                    statusName = 'Alarm Snooze';
                    break;
                }

                case StatusViewsMap.BYPASS_ALARM_TYPE: {
                    statusName = 'Alarm Bypass';
                    break;
                }

                case StatusViewsMap.BYPASS: {
                    statusName = 'Alarm Bypass';
                    break;
                }

                case StatusViewsMap.ACK_WARNING: {
                    statusName = 'Warning (Ack)';
                    break;
                }

                case StatusViewsMap.ACK_CRITICAL: {
                    statusName = 'Critical (Ack)';
                    break;
                }

                case StatusViewsMap.ACK_FAULT: {
                    statusName = 'Fault - General (Ack)';
                    break;
                }

                case StatusViewsMap.ACK_FAULT_OPEN: {
                    statusName = 'Fault - Open Sensor (Ack)';
                    break;
                }

                case StatusViewsMap.ACK_FAULT_SHORTED: {
                    statusName = 'Fault - Shorted Sensor (Ack)';
                    break;
                }

                case StatusViewsMap.ACK_FAULT_COMM: {
                    statusName = 'Fault - Communication Error (Ack)';
                    break;
                }

                case StatusViewsMap.ACK_DISCONNECTED: {
                    statusName = 'Disconnected (Ack)';
                    break;
                }

                case StatusViewsMap.WARNING: {
                    // if (Client.instance.loggedUser.ShowWarnings) {
                    statusName = 'Warning';
                    // }
                    // else {
                    //     statusName = 'OK';
                    // }

                    break;
                }

                case StatusViewsMap.CRITICAL: {
                    statusName = 'Critical';
                    break;
                }

                case StatusViewsMap.FAULT: {
                    statusName = 'Fault - General';
                    break;
                }

                case StatusViewsMap.FAULT_OPEN: {
                    statusName = 'Fault - Open Sensor';
                    break;
                }

                case StatusViewsMap.FAULT_SHORTED: {
                    statusName = 'Fault - Shorted Sensor';
                    break;
                }

                case StatusViewsMap.FAULT_COMM: {
                    statusName = 'Fault - Communication Error';
                    break;
                }

                case StatusViewsMap.DISCONNECTED: {
                    statusName = 'Disconnected';
                    break;
                }

                case StatusViewsMap.ROUTER_DISCONNECTED: {
                    statusName = 'Router Disconnected';
                    break;
                }

                case StatusViewsMap.ROUTER_CHARGING_FAULT: {
                    statusName = 'Router Charging Fault';
                    break;
                }

                case StatusViewsMap.ROUTER_POWER_ALERT: {
                    statusName = 'Router Power Alert';
                    break;
                }

                default:
                    statusName = 'N/A';
                    break;
            }
        }


        if (statusType === 1) {
            switch (statusView) {
                case 0: {
                    statusName = 'OK';
                    break;
                }

                case 1: {
                    statusName = 'Router Power Alert';
                    break;
                }

                case 2: {
                    statusName = 'Router Charging Fault';
                    break;
                }

                case 3: {
                    statusName = 'Router Disconnected';
                    break;
                }
            }
        }

        return statusName;
    }


    export function getCheckForm(checkForms: Array<CheckForm>, checkFormID: number): CheckForm {
        return checkForms.find((form: CheckForm) => form.ID === checkFormID);
    }


    export function toLocalWeekDayMinute(weekDay: number, dayMinutes: number, isStart: boolean = true): object {
        const timeInDay: object = { weekDay: weekDay, dayMinutes: dayMinutes };

        timeInDay['dayMinutes'] = dayMinutes - new Date().getTimezoneOffset();

        if (isStart) {
            if (timeInDay['dayMinutes'] >= MINUTES_PER_DAY) {
                timeInDay['dayMinutes'] = timeInDay['dayMinutes'] - MINUTES_PER_DAY;
                timeInDay['weekDay'] = timeInDay['weekDay'] + 1;

                if (timeInDay['weekDay'] > 6) {
                    timeInDay['weekDay'] = timeInDay['weekDay'] - 7;
                }
            } else if (timeInDay['dayMinutes'] < 0) {
                timeInDay['dayMinutes'] = timeInDay['dayMinutes'] + MINUTES_PER_DAY;
                timeInDay['weekDay'] = timeInDay['weekDay'] - 1;

                if (timeInDay['weekDay'] < 0) {
                    timeInDay['weekDay'] = timeInDay['weekDay'] + 7;
                }
            }
        } else {
            if (timeInDay['dayMinutes'] > MINUTES_PER_DAY) {
                timeInDay['dayMinutes'] = timeInDay['dayMinutes'] - MINUTES_PER_DAY;
                timeInDay['weekDay'] = timeInDay['weekDay'] + 1;

                if (timeInDay['weekDay'] > 6) {
                    timeInDay['weekDay'] = timeInDay['weekDay'] - 7;
                }
            } else if (timeInDay['dayMinutes'] <= 0) {
                timeInDay['dayMinutes'] = timeInDay['dayMinutes'] + MINUTES_PER_DAY;
                timeInDay['weekDay'] = timeInDay['weekDay'] - 1;

                if (timeInDay['weekDay'] < 0) {
                    timeInDay['weekDay'] = timeInDay['weekDay'] + 7;
                }
            }
        }

        return timeInDay;
    }


    export function toUTCWeekDayMinute(weekDay: number, dayMinutes: number, isStart: boolean = true): object {
        const timeInDay: object = { weekDay: weekDay, dayMinutes: dayMinutes };

        timeInDay['dayMinutes'] = dayMinutes + new Date().getTimezoneOffset();

        if (isStart) {
            if (timeInDay['dayMinutes'] >= MINUTES_PER_DAY) {
                timeInDay['dayMinutes'] = timeInDay['dayMinutes'] - MINUTES_PER_DAY;
                timeInDay['weekDay'] = timeInDay['weekDay'] + 1;

                if (timeInDay['weekDay'] > 6) {
                    timeInDay['weekDay'] = timeInDay['weekDay'] - 7;
                }
            } else if (timeInDay['dayMinutes'] < 0) {
                timeInDay['dayMinutes'] = timeInDay['dayMinutes'] + MINUTES_PER_DAY;
                timeInDay['weekDay'] = timeInDay['weekDay'] - 1;

                if (timeInDay['weekDay'] < 0) {
                    timeInDay['weekDay'] = timeInDay['weekDay'] + 7;
                }
            }
        } else {
            if (timeInDay['dayMinutes'] > MINUTES_PER_DAY) {
                timeInDay['dayMinutes'] = timeInDay['dayMinutes'] - MINUTES_PER_DAY;
                timeInDay['weekDay'] = timeInDay['weekDay'] + 1;

                if (timeInDay['weekDay'] > 6) {
                    timeInDay['weekDay'] = timeInDay['weekDay'] - 7;
                }
            } else if (timeInDay['dayMinutes'] <= 0) {
                timeInDay['dayMinutes'] = timeInDay['dayMinutes'] + MINUTES_PER_DAY;
                timeInDay['weekDay'] = timeInDay['weekDay'] - 1;

                if (timeInDay['weekDay'] < 0) {
                    timeInDay['weekDay'] = timeInDay['weekDay'] + 7;
                }
            }
        }

        return timeInDay;
    }


    export function dateFormat(date: Date, format: string, local: string): string {
        const str = formatDate(date, format, local);
        return str;
    }


    export function formatSecondsSpan(totalSeconds: number): string {
        if (totalSeconds === 0) {
            return '0s';
        }

        const numDays: number = totalSeconds / 86400;
        const numHours: number = (totalSeconds % 86400) / 3600;
        const numMinutes: number = ((totalSeconds % 86400) % 3600) / 60;
        const numSeconds: number = ((totalSeconds % 86400) % 3600) % 60;

        const days: string = formatNumber(numDays, 'en', '1.0-0');
        const hours: string = formatNumber(numHours, 'en', '1.0-0');
        const minutes: string = formatNumber(numMinutes, 'en', '1.0-0');
        const seconds: string = formatNumber(numSeconds, 'en', '1.0-0');

        let duration = '';
        if (days && days !== '0') {
            duration += days + 'd';
        }

        if (hours && hours !== '0') {
            duration += (duration === '' ? '' : ' ') + hours + 'h';
        }

        if (minutes && minutes !== '0') {
            duration += (duration === '' ? '' : ' ') + minutes + 'm';
        }

        if (seconds && seconds !== '0') {
            duration += seconds + 's';
        }

        return duration;
    }


    export function formatMinutesSpan(totalMinutes: number): string {
        if (totalMinutes === 0) {
            return '0m';
        }

        const numDays: number = totalMinutes / 1440;
        const numHours: number = (totalMinutes % 1440) / 60;
        const numMinutes: number = ((totalMinutes % 1440) % 60);

        const days: string = formatNumber(numDays, 'en', '1.0-0');
        const hours: string = formatNumber(numHours, 'en', '1.0-0');
        const minutes: string = formatNumber(numMinutes, 'en', '1.0-0');

        let duration = '';
        if (days !== '0') {
            duration += days + 'd';
        }

        if (hours !== '0') {
            duration += (duration === '' ? '' : ' ') + hours + 'h';
        }

        if (minutes !== '0') {
            duration += (duration === '' ? '' : ' ') + minutes + 'm';
        }

        return duration;
    }


    export function getAuthorizedReports(loggedUser: User, reports: Array<Report>, isTagReport: boolean): Array<Report> {
        if (!loggedUser) {
            return null;
        }

        const authorizedReports: Array<Report> = new Array<Report>();
        if (!isTagReport) {
            reports.forEach((report: Report) => {
                if (!(loggedUser.UserTypeID < UserTypes.MANAGER && report.ID === Reports.AUDIT_LOG)) {
                    authorizedReports.push(report);
                }
            });
        } else {
            reports.forEach((tagReport: Report) => {
                if (isVirtualizeReport(tagReport.ID)) {
                    authorizedReports.push(tagReport);
                }
            });
        }

        return authorizedReports;
    }

    export function getTodayStart(): Date {
        const date: Date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    export function getTodayEnd(): Date {
        const date: Date = addDays(new Date(), 1);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    export function addDays(date: Date, days: number): Date {
        const newDate: Date = new Date();
        newDate.setTime(date.getTime() + days * 1000 * 60 * 60 * 24);
        return newDate;
    }

    export function addHours(date: Date, hours: number): Date {
        const newDate: Date = new Date();
        newDate.setTime(date.getTime() + hours * 1000 * 60 * 60);
        return newDate;
    }

    export function addMinutes(date: Date, minutes: number): Date {
        const newDate: Date = new Date();
        newDate.setTime(date.getTime() + minutes * 1000 * 60);
        return newDate;
    }

    export function addSeconds(date: Date, seconds: number): Date {
        const newDate: Date = new Date();
        newDate.setTime(date.getTime() + seconds * 1000);
        return newDate;
    }

    export function isEmpty(obj: any) {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    }






    // Private 'Helper' Methods
    // ------------------------------
    function naturalCompare(a: any, b: any, isDesc: boolean): number {
        const ax = [];
        const bx = [];

        if (!a) {
            return 1000;
        }

        if (!b) {
            return -1000;
        }

        if (!(a && b)) {
            // console.log('NOT DEFINED');
            return 0;
        }

        a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || '']); });
        b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || '']); });

        while (ax.length && bx.length) {
            const an = ax.shift();
            const bn = bx.shift();
            const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
            if (nn) {
                return nn;
            }
        }

        return isDesc ? (bx.length - ax.length) : (ax.length - bx.length);
    }

    function isVirtualizeReport(reportID: number): boolean {
        if (!this.mapVirtulReports) {
            this.mapVirtulReports = {};
            this.mapVirtulReports[Reports.DAILY_SUMMARY] = true;
            this.mapVirtulReports[Reports.ALARMS] = true;
            this.mapVirtulReports[Reports.ASSETS_LIST] = true;
            this.mapVirtulReports[Reports.ASSET_MEASURES_LOG] = true;
            this.mapVirtulReports[Reports.DIGITAL_ALARMS_SUMMARY] = true;
        }

        return this.mapVirtulReports.hasOwnProperty(reportID);
    }
}
