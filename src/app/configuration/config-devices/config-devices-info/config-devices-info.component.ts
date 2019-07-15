import { Device } from '../../../shared/types/device';
import { CommonService } from '../../../shared/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { LogService } from '../../../shared/services/log.service';
import { Component, Input } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { EcsDatetimePipe } from '../../../shared/pipes/ecs-datetime.pipe';
import { ServiceHelper } from '../../../shared/services/serviceHelper';
import { DataRowStates } from '../../../shared/data/enums/data-row-state.enum';
import { DeviceType } from '../../../shared/types/deviceType';
import { DeviceTypes } from '../../../shared/data/constants/deviceTypes';
import { RxSignalLog } from '../../../shared/types/rxSignalLog';
import { TxSignalLog } from '../../../shared/types/txSignalLog';
import { UserTypes } from '../../../shared/data/constants/userTypes';
import { PacketVersions } from '../../../shared/data/constants/packetVersions';
import { BaseConfigItem } from '../../base-config-widget/base-config-item';
import { DataService } from '../../../shared/services/data.service';
import { BatteryLog } from '../../../shared/types/batteryLog';
import { DateTimeFormats } from '../../../shared/data/constants/datetimeFormats';





@Component({
    selector: 'config-devices-info',
    templateUrl: './config-devices-info.component.html',
    styleUrls: ['./config-devices-info.component.scss']
})
export class ConfigDevicesInfoComponent extends BaseConfigItem {

    private _device: Device;
    rowStates = DataRowStates;
    deviceTypes = DeviceTypes;

    flgShowIGGroup: boolean;
    flgShowBrowseBtn: boolean;
    flgShowBattery: boolean;
    flgShowFrmwUpdt: boolean;
    flgCanReboot: boolean;
    flgDisplayFrmwDlg: boolean;
    flgDisplayBtryDlg: boolean;
    flgDisplayMdlSwitDlg: boolean;
    flgDisplaySignLDlg: boolean;

    lstOpts: SelectItem[];
    selDialgItm: SelectItem;

    deviceTypeOpts: Array<SelectItem>;
    allDeviceTypes: Array<DeviceType>;
    selDevcGroup: any;

    selStartDate: Date;
    selEndDate: Date;
    batteryLogs: Array<BatteryLog>;
    private _rxSignalLogs: Array<RxSignalLog>;
    private _txSignalLogs: Array<TxSignalLog>;
    signalLogInfos: Array<SignalLogInfo>;



    secPairStatus = [
        'CONFIG_DEVICES.PAIR_STATUS.UNDEFINED',
        'CONFIG_DEVICES.PAIR_STATUS.PAIRREQUESTED',
        'CONFIG_DEVICES.PAIR_STATUS.PAIRING',
        'CONFIG_DEVICES.PAIR_STATUS.PAIRED',
        'CONFIG_DEVICES.PAIR_STATUS.TIMEDOUT'];

    secPairOpts: SelectItem[] = [
        { label: 'Disable', value: 0 },
        { label: '5 Minutes', value: 1 },
        { label: '1 Hour', value: 2 },
        { label: 'Until Pairing', value: 3 }
    ];

    deviceGroupOpts: SelectItem[] = [
        // {
        //     label: 'Select Group',
        //     value: null
        // },
        {
            label: 'IntelliGate',
            value: { Name: 'IntelliGate', ID: 1, Devices: [2] }
        },
        {
            label: 'IntelliSensor (XB/ZB Models)',
            value: { Name: 'IntelliSensor (XB/ZB Models)', ID: 5, Devices: [3, 4, 8, 9, 10, 11, 12, 13, 22, 24] }
        },
        {
            label: 'IntelliSensor (WiFi Models)',
            value: { Name: 'IntelliSensor (WiFi Models)', ID: 6, Devices: [14, 15, 16, 17, 18, 19, 20, 21, 23, 25] }
        },
        {
            label: 'OEM',
            value: { Name: 'OEM', ID: 3, Devices: [6] }
        },
        {
            label: 'Taylor Gateway',
            value: { Name: 'Taylor Gateway', ID: 2, Devices: [5] }
        }
    ];

    tempUnitOpts: SelectItem[] = [
        { label: 'F', value: 'F' },
        { label: 'C', value: 'C' }
    ];







    constructor(logger: LogService,
        translate: TranslateService,
        common: CommonService,
        msgService: MessageService,
        data: DataService) {
        super(logger, common, translate, msgService);
    }









    // Properties
    // -------------------------------------------

    @Input()
    set device(device: Device) {
        this._device = device;
        if (this._device) {
            this.flgShowIGGroup = ServiceHelper.isIntelliSensorDevice(this._device.DeviceTypeID) ||
                ServiceHelper.isDeviceIntelliGate(this._device.DeviceTypeID);

            this.flgShowBattery = this._device.RowState !== DataRowStates.ADDED &&
                ServiceHelper.isBatteryDevice(this._device.DeviceTypeID);

            this.flgShowFrmwUpdt = (ServiceHelper.isDeviceIntelliGate(this._device.DeviceTypeID) ||
                ServiceHelper.canUpdateFirmware(this._device)) &&
                this.Common.loggedUser.UserTypeID === UserTypes.SYSTEM_ADMIN;

            this.flgCanReboot = (ServiceHelper.isDeviceIntelliGate(this._device.DeviceTypeID) ||
                ServiceHelper.canReboot(this._device.PacketVer)) &&
                this.Common.loggedUser.UserTypeID === UserTypes.SYSTEM_ADMIN;

            this.flgShowBrowseBtn = this._device.DeviceTypeID === this.deviceTypes.INTELLIGATE &&
                this._device.IPAddress && this._device.IPAddress.length > 0;


            let dvcTypeIDs: Array<number> = null;
            this.deviceGroupOpts.forEach((item: SelectItem) => {
                dvcTypeIDs = item.value.Devices;
                if (dvcTypeIDs.includes(this.device.DeviceTypeID)) {
                    this.selDevcGroup = item.value;
                }
            });

            this.deviceGroupChnaged(null);
        }
    }


    get device(): Device {
        return this._device;
    }












    // Internal "Helper" Methods
    // ----------------------------------
    geNewDeviceMask(): string {
        if (this._device) {
            if (ServiceHelper.isIntelliSensorDeviceZB(this._device.DeviceTypeID) ||
                this._device.DeviceTypeID === this.deviceTypes.OEM) {
                return '**:**:**:**:**:**:**:**';
            } else {
                return '**:**:**:**:**:**';
            }
        } else {
            return '';
        }
    }

    getBatStatus(): string {
        if (this._device) {
            return ServiceHelper.getBatteryStatus(this._device);
        } else {
            return this.Translate.instant('DEFAULTS.N/A');
        }
    }

    getPairStatus(): string {
        if (this._device && this._device.SecPairStatus) {
            return this.Translate.instant(this.secPairStatus[this._device.SecPairStatus]);
        } else {
            return this.Translate.instant('CONFIG_DEVICES.PAIR_STATUS.UNDEFINED');
        }
    }

    getTxInterval(): string {
        if (this._device) {
            return this._device.TxPeriod === 0 || isNaN(this._device.TxPeriod) ?
                this.Translate.instant('DEFAULTS.DISABLED') :
                this._device.TxPeriod.toFixed(0);
        } else {
            return this.Translate.instant('DEFAULTS.DISABLED');
        }
    }

    getRfChannel(): string {
        if (this._device) {
            return this.formatHex(this._device.RFChannel) + '  /  ' + this.formatHex(this._device.PanID);
        } else {
            return this.Translate.instant('DEFAULTS.DISABLED') + '  /  ' + this.Translate.instant('DEFAULTS.DISABLED');
        }
    }

    getRxTxStrng(): string {
        if (this._device) {
            return this.getRxSignalStrength() + ' / ' + this.getTxSignalStrength() + ' dBm';
        } else {
            return '0 / 0  dBm';
        }
    }

    getLogPeriod(): string {
        if (this._device) {
            return this._device.LogPeriod === 0 || isNaN(this._device.LogPeriod) ?
                this.Translate.instant('DEFAULTS.DISABLED') :
                this._device.LogPeriod.toFixed(0);
        } else {
            return this.Translate.instant('DEFAULTS.DISABLED');
        }
    }

    getViolPeriod(): string {
        if (this._device) {
            return this._device.ViolationCheckPeriod === 0 || isNaN(this._device.ViolationCheckPeriod) ?
                this.Translate.instant('DEFAULTS.DISABLED') :
                this._device.ViolationCheckPeriod.toFixed(0);
        } else {
            return this.Translate.instant('DEFAULTS.DISABLED');
        }
    }

    getECSLibVer(): string {
        if (this._device) {
            return this._device.ECSLibVer ?
                (parseInt(this._device.ECSLibVer, 16) / 100).toString() :
                this.Translate.instant('DEFAULTS.N/A');
        } else {
            return this.Translate.instant('DEFAULTS.N/A');
        }
    }

    getFirmWareInfo(): string {
        if (this._device) {
            return ServiceHelper.formatFirmware(this._device.FirmwareVer, this._device.FirmwareBank);
        } else {
            return this.Translate.instant('DEFAULTS.N/A');
        }
    }

    getHWVer(): string {
        switch (this._device.PacketVer) {
            case PacketVersions.WIFI_SENSOR_V3:
                return '3';

            default:
                return '2';
        }
    }

    getLastFWUpdate(): string {
        if (this._device && this._device.LastFirmwareUpdated) {
            return EcsDatetimePipe.call(this, this._device.LastFirmwareUpdated);
        } else {
            return this.Translate.instant('DEFAULTS.N/A');
        }
    }

    getLastReboot(): string {
        if (this._device && this._device.LastRebooted) {
            return EcsDatetimePipe.call(this, this._device.LastRebooted);
        } else {
            return this.Translate.instant('DEFAULTS.N/A');
        }
    }







    // Event Handlers
    // -------------------------------
    deviceGroupChnaged(event: Event) {
        if (!this.selDevcGroup) {
            return;
        }

        const deviceIDs = this.selDevcGroup['Devices'];
        if (!(this.allDeviceTypes && this.allDeviceTypes.length > 0)) {
            this.allDeviceTypes = this.Common.getEditableDeviceTypes();
        }

        let flg = false;
        this.deviceTypeOpts = []; // [{ label: 'Select Device', value: null }]
        deviceIDs.forEach((id: number) => {
            const deviceType: DeviceType = this.allDeviceTypes.find((dvType: DeviceType) => dvType.ID === id);
            if (deviceType) {
                this.deviceTypeOpts.push({ label: deviceType.Name, value: deviceType.ID });
                if (this.device.DeviceTypeID > 0 && deviceType.ID === this.device.DeviceTypeID) {
                    flg = true;
                }
            }
        });

        if (!flg) {
            this.device.DeviceTypeID = this.deviceTypeOpts[0].value;
        }

        // this.deviceTypeChnaged(null);
    }


    deviceTypeChanged(event: Event) {
        if (this._device.DeviceTypeID === DeviceTypes.OEM) {
            this._device.CommAddress = 1;
            this._device.QueryInterval = 30000;
            this._device.TimeoutValue = 10000;
            this._device.NumberRetries = 3;
        }

        this.onDirtify();
    }


    devicePhysicalIDChanged(physcalAdrs: string) {
        if (!this._device || this._device.RowState !== DataRowStates.ADDED) {
            return;
        }

        this._device.PhysicalID = physcalAdrs.replace(/[\:\_]/g, '');
        this.onDirtify();
    }

    browse() {
        window.open('http://' + this.device.IPAddress, '_blank'); // in new tab
    }


    showBatteryHistory(event: Event) {
        // this.selEndDate = new Date();
        // this.selStartDate = new Date();
        // this.selStartDate.setMonth(this.selStartDate.getMonth() - 1);

        this.selEndDate = new Date(2018, 9, 24);
        this.selStartDate = new Date(2018, 8, 25);

        this.getBatteryLogs();
        this.flgDisplayBtryDlg = true;
    }


    getBatteryLogs() {
        // this.loading = true;
        this.Logger.info('Getting battery logs'); // - LocationId: ${this.}`);

        this.getDataSubscrp = this.Data.getBatteryLogs(this._device.ID, this.selStartDate, this.selEndDate)
            .subscribe(
                res => {
                    this.batteryLogs = res;
                    // this.loading = false;
                },
                err => {
                    this.Logger.error(`error in config location devices ${err}`);
                    // this.loading = false;
                    this.getDataSubscrp.unsubscribe();

                    this.MsgService.add({
                        severity: 'error',
                        summary: 'Get Devices Data',
                        detail: 'Getting Devices Data operations has failed. ' + err
                    });
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }

    batteryLogTooltip(pointInfo: any): any {
        const displayName = pointInfo.seriesName;
        const batteryLog: BatteryLog = <BatteryLog>(pointInfo.point.data);
        const value = batteryLog.BatteryVoltage.toFixed(2) + ' V';

        // return '<B>' + displayName + '</B><BR>' + (yField !== 'BatteryVoltage' ? ('Value: ' + value) :
        //     ('Log Date: ' + DateUtil.formatDate(batteryLog.Timestamp, DateUtil.FORMAT_DATE_TIME_USA) + '<BR>' +
        //         'Status: ' + ServiceHelper.getStatusName(batteryLog.BatteryStatus) + '<BR>Value: ' + value));

        pointInfo.html = '<B>' + displayName + '</B><BR>' +
            ('Log Date: ' + ServiceHelper.dateFormat(batteryLog.Timestamp, DateTimeFormats.FORMAT_DATE_TIME_USA, 'en') + '<BR>' +
                'Status: ' + ServiceHelper.getStatusName(batteryLog.BatteryStatus) + '<BR>Value: ' + value);

        return pointInfo;
    }

    getLogTimeStamp(pointInfo: any): string {
        let str: string;
        str = ServiceHelper.dateFormat(pointInfo.value, DateTimeFormats.FORMAT_DATE_USA, 'en');

        // 		switch (period.selectedSpan.minutes)
        // 		{
        // 			case 240:
        // 			{
        // 				str = DateUtil.formatDate(labelValue, DateUtil.FORMAT_TIME_SHORT_USA);
        // 				break;
        // 			}

        // 			case 1440:
        // 			{
        // 				str = DateUtil.formatDate(labelValue, DateUtil.FORMAT_TIME_SHORT_USA);
        // 				break;
        // 			}

        // 			case 10080:
        // 			{
        // 				str = DateUtil.formatDate(labelValue, DateUtil.FORMAT_DATE_TIME_USA_STANDARD);
        // 				break;
        // 			}

        // 			case 44640:
        // 			{
        // 				str = DateUtil.formatDate(labelValue, DateUtil.FORMAT_DATE_USA);
        // 				break;
        // 			}
        // 		}

        // return str;
        return pointInfo.valueText;
    }

    getVoltage(pointInfo: any): string {
        return pointInfo.valueText;
    }


    showSignalHistory() {
        // this.selEndDate = new Date();
        // this.selStartDate = new Date();
        // this.selStartDate.setMonth(this.selStartDate.getMonth() - 1);

        this.selEndDate = new Date(2018, 9, 24);
        this.selStartDate = new Date(2018, 8, 25);

        this.getSignalLogs();
        this.flgDisplaySignLDlg = true;
    }

    getSignalLogs() {
        // this.loading = true;
        this.Logger.info('Getting signal logs'); // - LocationId: ${this.}`);

        this.getDataSubscrp = this.Data.getSignalLogs(this._device.ID, this.selStartDate, this.selEndDate)
            .subscribe(
                res => {
                    this._rxSignalLogs = res[0];
                    this._txSignalLogs = res[1];
                    // this.loading = false;

                    const logs: Array<SignalLogInfo> = [];
                    this.signalLogInfos = [];

                    if (this._rxSignalLogs && this._rxSignalLogs.length > 0) {
                        this._rxSignalLogs.forEach((rxLog: RxSignalLog) => {
                            logs.push({ timestap: rxLog.Timestamp, rxSignal: rxLog.RxSignalStrength });
                        });

                    }

                    let currLog: SignalLogInfo = null;
                    if (this._txSignalLogs && this._txSignalLogs.length > 0) {
                        this._txSignalLogs.forEach((txLog: TxSignalLog) => {
                            currLog = logs.find((log: SignalLogInfo) => txLog.Timestamp === log.timestap);
                            if (currLog) {
                                currLog.txSignal = txLog.TxSignalStrength;
                            } else {
                                logs.push({ timestap: txLog.Timestamp, txSignal: txLog.TxSignalStrength });
                            }

                        });
                    }

                    this.signalLogInfos = logs;
                },
                err => {
                    this.Logger.error(`error in config location devices ${err}`);
                    // this.loading = false;
                    this.getDataSubscrp.unsubscribe();

                    this.MsgService.add({
                        severity: 'error',
                        summary: 'Get Devices Data',
                        detail: 'Getting Devices Data operations has failed. ' + err
                    });
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }

    signalLogTooltip(pointInfo: any): any {
        let timestamp: Date;
        let value: number;

        const displayName = pointInfo.seriesName;
        const logInfo: SignalLogInfo = <SignalLogInfo>(pointInfo.point.data);

        switch (displayName) {
            case 'TxSignal Log':
                timestamp = logInfo.timestap;
                value = logInfo.txSignal;
                break;

            case 'RxSignal Log':
                timestamp = logInfo.timestap;
                value = logInfo.rxSignal;
                break;
        }

        pointInfo.html = '<B>' + displayName + '</B><BR>' +
            'Log Date: ' + ServiceHelper.dateFormat(timestamp, DateTimeFormats.FORMAT_DATE_TIME_USA, 'en') +
            '<BR>Value: ' + value.toFixed(2) + ' dBm';

        return pointInfo;
    }

    getSignalLogTimeStamp(pointInfo: any): string {
        return pointInfo.valueText;
    }

    getSignalLogVal(pointInfo: any): string {
        return pointInfo.valueText;
    }

    resetSecPairing(event: Event) {
        this.Logger.info(`Calling for reset the Sec Pairing for Device - Device ID: ${this._device.PhysicalID}`);
        this.getDataSubscrp = this.Data.resetSecPairing(this._device.DeviceTypeID, event['value'])
            .subscribe(
                res => {
                    this.MsgService.clear();
                    this.MsgService.add({
                        severity: 'success',
                        summary: this.Translate.instant('CONFIG_DEVICES.TITLES.RESET_SECPAIR'),
                        detail: 'Reset device security token was successful'
                    });
                },
                err => {
                    this.Logger.error(`error in sending request for Device Sec Pairing reset.
                        Device: ${this._device.PhysicalID}. Error:  ${err}`);

                    this.MsgService.clear();
                    this.MsgService.add({
                        severity: 'error',
                        summary: this.Translate.instant('CONFIG_DEVICES.TITLES.RESET_SECPAIR'),
                        detail: 'Attempt to reset device security token has failed - ' + err
                    });
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }


    showModelNumberFlags() {
        if (this.device.ConfigModelNumberFlags === -1) {
            this.device.ConfigModelNumberFlags = this.device.ModelNumberFlags;
            this.onDirtify();
        }

        this.flgDisplayMdlSwitDlg = true;
    }

    toggleModelFlagsByte(byte: number) {
        // tslint:disable-next-line:no-bitwise
        if (this.device.ConfigModelNumberFlags & byte) {
            this.device.ConfigModelNumberFlags -= byte;
        } else {
            this.device.ConfigModelNumberFlags += byte;
        }
        this.onDirtify();
    }

    getInstalledFirmwares() {
        this.Logger.info(`Getting installed Firmwares for Device - Device ID: ${this._device.PhysicalID}`);
        this.getDataSubscrp = this.Data.getInstalledFirmwares(this._device.DeviceTypeID, this._device.PacketVer)
            .subscribe(
                res => {
                    if (res && res.length > 0) {
                        this.lstOpts = [];
                        res.forEach((item: string) => {
                            this.lstOpts.push({ label: item, value: item });
                        });
                    } else {
                        this.lstOpts = [{ label: 'NO Firmware Found', value: null }];
                    }

                    // Show the Firmware popup
                    this.flgDisplayFrmwDlg = true;
                },
                err => {
                    this.Logger.error(`error in loading installed Formwares ${err}`);
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }


    rebootIntelliGate() {
        this.Logger.info(`Getting installed Firmwares for Device - Device ID: ${this._device.PhysicalID}`);
        this.getDataSubscrp = this.Data.rebootIntelliGate(this._device.DeviceTypeID)
            .subscribe(
                res => {
                    this._device.RebootRequested = true;
                },
                err => {
                    this.Logger.error(`error in sending request for IntelliGate Reboot.
                        IntelliGate: ${this._device.PhysicalID}. Error:  ${err}`);
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }

    onDialogOK(event) {
        const path: string = this.selDialgItm.value;
        this.flgDisplayFrmwDlg = false;

        if (!(path && path.length > 0)) {
            return;
        }

        this.device.UpdateFirmwarePath = path;
        this.device.UpdateFirmwareRequested = true;
        this.getDataSubscrp = this.Data.updateIntelliGateFirmware(this._device.ID, path)
            .subscribe(
                res => {
                    if (res && res.length > 0) {
                        this.lstOpts = [];
                        res.forEach((item: string) => {
                            this.lstOpts.push({ label: item, value: item });
                        });
                    } else {
                        this.lstOpts = [{ label: 'NO Firmware Found', value: null }];
                    }

                    // Show the Firmware popup
                    this.flgDisplayFrmwDlg = true;
                },
                err => {
                    this.Logger.error(`error in loading installed Firmwares ${err}`);
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }









    // Private "Helper" Methods
    // ----------------------------------
    private formatHex(val: string): string {
        return val && val.length > 0 ? Number(val).toString(16) : this.Translate.instant('DEFAULTS.N/A');
    }


    private getRxSignalStrength(): String {
        if (!this._device || this._device.RxSignalLogs || this._device.RxSignalLogs.length === 0) {
            return '0';
        }

        const rxSignalLog: RxSignalLog = this._device.RxSignalLogs[this._device.RxSignalLogs.length - 1];
        return rxSignalLog.RxSignalStrength.toString();
    }


    private getTxSignalStrength(): String {
        if (!this._device || !this._device.TxSignalLogs || this._device.TxSignalLogs.length === 0) {
            return '0';
        }

        const txSignalLog: TxSignalLog = this._device.TxSignalLogs[this._device.TxSignalLogs.length - 1];
        return txSignalLog.TxSignalStrength.toString();
    }
}




export class SignalLogInfo {
    timestap: Date;
    txSignal?: number;
    rxSignal?: number;
}

