import { DataRowStates } from './../../shared/data/enums/data-row-state.enum';
import { LogService } from './../../shared/services/log.service';
import { DataService } from './../../shared/services/data.service';
import { BaseConfigWidgetExtComponent } from '../base-config-widget/base-config-widgetExt.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, SelectItem } from 'primeng/api';
import { AlarmType } from '../../shared/types/alarmType';
import { TopologyService } from '../../shared/services/topology.service';
import { RouteService } from '../../shared/services/route.service';
import { ConfigurationComponent } from '../configuration.component';
import { Actions } from '../../shared/data/constants/actions';

import { AlarmTypeSchedule } from '../../shared/types/alarmTypeSchedule';
import { ServiceHelper } from '../../shared/services/serviceHelper';
import { DateTimeFormats } from '../../shared/data/constants/datetimeFormats';
import { AuthService } from '../../shared/services/auth.service';









@Component({
    selector: 'app-config-alarm-types',
    templateUrl: './config-alarm-types.component.html',
    styleUrls: ['./config-alarm-types.component.scss']
})
export class ConfigAlarmTypesComponent extends BaseConfigWidgetExtComponent<AlarmType> implements OnInit {

    private _alrmScheds: Array<AlarmTypeSchedule>;
    schedData: Array<DataItem>;

    isDefDelay = false;
    defDelayVal: number;

    isCustDelay = false;
    isCustBypass = false;
    custDelayVal: number;


    optWeekdays: Array<SelectItem>;
    currSchedItem: DataItem;
    isPopupVisible = false;

    arrDays = [
        this.Translate.instant('WEEK_DAYS.MON'),
        this.Translate.instant('WEEK_DAYS.TUE'),
        this.Translate.instant('WEEK_DAYS.WED'),
        this.Translate.instant('WEEK_DAYS.THU'),
        this.Translate.instant('WEEK_DAYS.FRI'),
        this.Translate.instant('WEEK_DAYS.SAT'),
        this.Translate.instant('WEEK_DAYS.SUN')
    ];







    constructor(router: RouteService,
        topology: TopologyService,
        data: DataService,
        logger: LogService,
        translate: TranslateService,
        msgService: MessageService,
        config: ConfigurationComponent,
        auth: AuthService) {
        super(router, topology, data, logger, translate, msgService, config, auth);

        this.LabelBy = 'Name';
        this.SortBy = 'Name';
        this.DataNames = ['alarmTypes'];
        this.ExtraDataNames = null;
        this.SaveAct = Actions.SAVE_ALARM_TYPES;
    }










    // ---------------------------
    // LifeCycle Hooks
    // ---------------------------
    ngOnInit() {
        super.ngOnInit();

        this.optWeekdays = [
            { label: this.Translate.instant('WEEK_DAYS.MON'), value: 0 },
            { label: this.Translate.instant('WEEK_DAYS.TUE'), value: 1 },
            { label: this.Translate.instant('WEEK_DAYS.WED'), value: 2 },
            { label: this.Translate.instant('WEEK_DAYS.THU'), value: 3 },
            { label: this.Translate.instant('WEEK_DAYS.FRI'), value: 4 },
            { label: this.Translate.instant('WEEK_DAYS.SAT'), value: 5 },
            { label: this.Translate.instant('WEEK_DAYS.SUN'), value: 6 }
        ];

        this.ecsObjectChanged.subscribe(
            event => {
                if (this.CurrECSObject) {
                    this._alrmScheds = this.CurrECSObject.Schedules;

                    if (this.CurrECSObject.AlarmBypass) {
                        this.isDefDelay = false;
                        this.defDelayVal = 0;
                    } else {
                        this.isDefDelay = true;
                        this.defDelayVal = this.CurrECSObject.AlarmDelay;
                    }

                    this.setChartData();
                }
            });
    }








    // ----------------------------------
    // Overriding Base Class Operations
    // ----------------------------------
    protected beforeSetItems() {
        if (this.EcsObjects && this.EcsObjects.length > 0) {
            this.EcsObjects.forEach((alrmType: AlarmType) => {
                alrmType.Schedules = this.setAlarmSchedulesIntoLocalTime(alrmType.Schedules);
            });
        }
    }


    protected beforeDataSave(dirtyAlrmTypes: Array<AlarmType>) {
        if (dirtyAlrmTypes && dirtyAlrmTypes.length > 0) {
            dirtyAlrmTypes.forEach((alrmType: AlarmType) => {
                alrmType.Schedules = this.setAlarmSchedulesIntoUTCTime(alrmType.Schedules);
            });
        }
    }











    // Event Handlers
    // ------------------------------

    // DEFAULT Shcedules
    // -------------------------
    defDelayClicked(event) {
        if (event) {
            this.CurrECSObject.AlarmBypass = false;
            this.CurrECSObject.AlarmDelay = this.defDelayVal;
        }
        this.dirtifyItem();
    }

    defBypassClicked(event) {
        if (event) {
            this.isDefDelay = false;
            this.CurrECSObject.AlarmBypass = true;
            this.CurrECSObject.AlarmDelay = this.defDelayVal = 0;
        }
        this.dirtifyItem();
    }

    defDelayValChanged(event) {
        if (this.defDelayVal === 0) {
            this.isDefDelay = false;
            this.CurrECSObject.AlarmBypass = true;
            this.CurrECSObject.AlarmDelay = 0;
        } else {
            this.CurrECSObject.AlarmBypass = false;
            this.isDefDelay = true;
            this.CurrECSObject.AlarmDelay = this.defDelayVal;
        }
        this.dirtifyItem();
    }









    // CUSTOM Shcedules
    // ----------------------------
    custSchedClick(event) {
        this.currSchedItem = event.target.data;
        const sched: AlarmTypeSchedule = this.currSchedItem.info;
        if (sched.AlarmBypass) {
            this.isCustBypass = true;
            this.isCustDelay = false;
            this.custDelayVal = 0;
        } else {
            this.isCustBypass = false;
            this.isCustDelay = true;
            this.custDelayVal = sched.AlarmDelay;
        }

        this.isPopupVisible = true;
    }

    schedDivClick(event) {
        const newSched: AlarmTypeSchedule = new AlarmTypeSchedule();
        newSched.RowState = DataRowStates.DETACHED;
        newSched.AlarmTypeID = this.CurrECSObject.ID;
        newSched.WeekDay = 0;
        newSched.StartMinute = 0;
        newSched.EndMinute = 120;
        newSched.AlarmDelay = 60;
        newSched.AlarmBypass = false;

        this.custDelayVal = 60;
        this.isCustBypass = false;
        this.isCustDelay = true;

        const now: Date = new Date();
        this.currSchedItem = {
            day: this.arrDays[0],
            weekDay: newSched.WeekDay,
            startMinute: newSched.StartMinute,
            fromTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), newSched.StartMinute / 60),
            endMinute: newSched.EndMinute,
            toTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), newSched.EndMinute / 60),
            title: this.getTitle(newSched),
            info: newSched,
            // day['color'] = null;
        };

        this.isPopupVisible = true;
    }

    refreshSchedPopup() {
        const sched: AlarmTypeSchedule = this.currSchedItem.info;
        const now: Date = new Date();

        this.currSchedItem.weekDay = sched.WeekDay;
        this.currSchedItem.startMinute = sched.StartMinute;
        this.currSchedItem.fromTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sched.StartMinute / 60);
        this.currSchedItem.endMinute = sched.EndMinute;
        this.currSchedItem.toTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sched.EndMinute / 60),
            this.currSchedItem.day = this.arrDays[sched.WeekDay];

        if (sched.AlarmBypass) {
            this.isCustBypass = true;
            this.isCustDelay = false;
            this.custDelayVal = 0;
        } else {
            this.isCustBypass = false;
            this.isCustDelay = true;
            this.custDelayVal = sched.AlarmDelay;
        }
    }

    updateCustSched(event) {
        let flgSchedDirty = false;
        const currSched: AlarmTypeSchedule = this.currSchedItem.info;

        if (currSched.RowState === DataRowStates.DETACHED) {
            currSched.RowState = DataRowStates.ADDED;
            currSched.WeekDay = this.currSchedItem.weekDay;
            currSched.StartMinute = this.currSchedItem.fromTime.getHours() * 60 + this.currSchedItem.fromTime.getMinutes();
            currSched.EndMinute = this.currSchedItem.toTime.getHours() * 60 + this.currSchedItem.toTime.getMinutes();
            currSched.AlarmDelay = this.isCustDelay ? this.custDelayVal : 0;
            currSched.AlarmBypass = this.isCustBypass;

            if (!this.CurrECSObject.Schedules) {
                this.CurrECSObject.Schedules = new Array<AlarmTypeSchedule>();
            }

            if (!this.validateScheds(currSched)) {
                return;
            }

            this.CurrECSObject.Schedules.push(currSched);
            flgSchedDirty = true;
            this.dirtifyItem();
        } else {
            if (currSched.WeekDay !== this.currSchedItem.weekDay) {
                currSched.WeekDay = this.currSchedItem.weekDay;
                flgSchedDirty = true;
            }

            if (currSched.StartMinute !== this.currSchedItem.fromTime.getHours() * 60 + this.currSchedItem.fromTime.getMinutes()) {
                currSched.StartMinute = this.currSchedItem.fromTime.getHours() * 60 + this.currSchedItem.fromTime.getMinutes();
                flgSchedDirty = true;
            }

            if (currSched.EndMinute !== this.currSchedItem.toTime.getHours() * 60 + this.currSchedItem.toTime.getMinutes()) {
                currSched.EndMinute = this.currSchedItem.toTime.getHours() * 60 + this.currSchedItem.toTime.getMinutes();
                flgSchedDirty = true;
            }

            if (this.isCustDelay && currSched.AlarmDelay !== this.custDelayVal) {
                currSched.AlarmDelay = this.custDelayVal;
                flgSchedDirty = true;
            }

            if (this.isCustBypass !== currSched.AlarmBypass) {
                currSched.AlarmBypass = this.isCustBypass;
                flgSchedDirty = true;
            }

            if (!this.validateScheds(currSched)) {
                return;
            }
        }

        if (flgSchedDirty) {
            if (currSched.RowState !== DataRowStates.ADDED) {
                currSched.RowState = DataRowStates.MODIFIED;
            }

            this.dirtifyItem();
            this.setChartData();
        }

        this.isPopupVisible = false;
    }

    deleteCustSched(event) {
        const currSched: AlarmTypeSchedule = this.currSchedItem.info;
        if (currSched.RowState !== DataRowStates.ADDED) {
            currSched.RowState = DataRowStates.DELETED;
        } else {
            const pos = this._alrmScheds.findIndex((sched: AlarmTypeSchedule) =>
                currSched.WeekDay === sched.WeekDay && currSched.StartMinute === sched.StartMinute && currSched.EndMinute === sched.EndMinute);

            if (pos > -1) {
                this.schedData.splice(pos, 1);
            }
        }

        const indx = this.schedData.findIndex((schdItem: DataItem) =>
            currSched.WeekDay === schdItem.weekDay && currSched.StartMinute === schdItem.startMinute && currSched.EndMinute === schdItem.endMinute);

        if (indx > -1) {
            this.schedData.splice(indx, 1);
        }

        this.dirtifyItem();
        // this.setChartData();
        this.isPopupVisible = false;
    }

    custDelayValChanged(event) {
        this.custDelayVal = event.value ? event.value : 0;
        if (this.custDelayVal === 0 || isNaN(this.custDelayVal)) {
            this.isCustBypass = true;
            this.isCustDelay = false;
        } else {
            this.isCustBypass = false;
            this.isCustDelay = true;
        }
    }

    custBypassChanged(event) {
        this.isCustBypass = event.value;
        this.isCustDelay = !this.isCustBypass;
        if (this.isCustBypass && this.custDelayVal !== 0) {
            this.custDelayVal = 0;
        }
    }

    addAlarmType(event) {
        if (!this.validate()) {
            return;
        }

        const newAlrmType: AlarmType = new AlarmType();
        newAlrmType.Name = '';
        newAlrmType.RowState = DataRowStates.ADDED;
        newAlrmType.Schedules = [];
        this.addEcsObject(newAlrmType);
    }

    getAlarmTime(pointInfo: any): string {
        const hours = (pointInfo.value / 60);
        const h = (hours % 12) || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        const timeString = h + ampm;
        return timeString;
    }

    getAlarmTooltip(event: any): any {
        event.valueText = event.point.data.title;
        return event; // event.point.data.title;
    }

    getAlarmLabel(event: any): string {
        if (event.index === 0) {
            const currSched: AlarmTypeSchedule = event.point.data.info;
            const len = event.point.data.title.length;
            const width = event.point.vx - event.point.x;
            const charCount = Math.floor(width / 6);

            if (charCount > 30) {
                return event.point.data.title;
            } else if (charCount > 10) {
                return event.point.data.title.substr(0, charCount - 5) + ' ...';
            } else {
                return null;
            }
        } else {
            return null;
        }
    }








    // Private "Helper" Functions
    // ------------------------------
    private setAlarmSchedulesIntoLocalTime(schedules: Array<AlarmTypeSchedule>): Array<AlarmTypeSchedule> {
        let lclSchedules: Array<AlarmTypeSchedule> = [];
        const dicSched: object = {};

        if (schedules && schedules.length > 0) {
            let start: object = null;
            let end: object = null;

            schedules.forEach((sched: AlarmTypeSchedule) => {
                start = ServiceHelper.toLocalWeekDayMinute(sched.WeekDay, sched.StartMinute);
                end = ServiceHelper.toLocalWeekDayMinute(sched.WeekDay, sched.EndMinute, false);

                sched.WeekDay = start['weekDay'];
                sched.StartMinute = start['dayMinutes'];

                if (start['weekDay'] === end['weekDay']) {
                    sched.EndMinute = end['dayMinutes'];

                    if (!dicSched.hasOwnProperty(sched.WeekDay)) {
                        dicSched[sched.WeekDay] = [];
                    }
                    dicSched[sched.WeekDay].push(sched);
                } else {
                    sched.EndMinute = (24 * 60);

                    if (!dicSched.hasOwnProperty(sched.WeekDay)) {
                        dicSched[sched.WeekDay] = [];
                    }
                    dicSched[sched.WeekDay].push(sched);

                    const secndSched: AlarmTypeSchedule = new AlarmTypeSchedule();
                    secndSched.AlarmBypass = sched.AlarmBypass;
                    secndSched.AlarmDelay = sched.AlarmDelay;
                    secndSched.AlarmTypeID = sched.AlarmTypeID;
                    secndSched.StartMinute = 0;
                    secndSched.WeekDay = end['weekDay'];
                    secndSched.EndMinute = end['dayMinutes'];

                    if (!dicSched.hasOwnProperty(secndSched.WeekDay)) {
                        dicSched[secndSched.WeekDay] = [];
                    }
                    dicSched[secndSched.WeekDay].push(secndSched);
                }
            });

            lclSchedules = this.mergeSchedules(dicSched);
        }

        return lclSchedules;
    }


    private setAlarmSchedulesIntoUTCTime(schedules: Array<AlarmTypeSchedule>): Array<AlarmTypeSchedule> {
        let utcSchedules: Array<AlarmTypeSchedule> = [];
        const dicSched: object = {};

        if (schedules && schedules.length > 0) {
            let start: object = null;
            let end: object = null;

            schedules.forEach((sched: AlarmTypeSchedule) => {
                start = ServiceHelper.toUTCWeekDayMinute(sched.WeekDay, sched.StartMinute);
                end = ServiceHelper.toUTCWeekDayMinute(sched.WeekDay, sched.EndMinute);

                sched.WeekDay = start['weekDay'];
                sched.StartMinute = start['dayMinutes'];

                if (start['weekDay'] === end['weekDay']) {
                    sched.EndMinute = end['dayMinutes'];

                    if (!dicSched.hasOwnProperty(sched.WeekDay)) {
                        dicSched[sched.WeekDay] = [];
                    }
                    dicSched[sched.WeekDay].push(sched);
                } else {
                    sched.EndMinute = (24 * 60);

                    if (!dicSched.hasOwnProperty(sched.WeekDay)) {
                        dicSched[sched.WeekDay] = [];
                    }
                    dicSched[sched.WeekDay].push(sched);

                    const secndSched: AlarmTypeSchedule = new AlarmTypeSchedule();
                    secndSched.AlarmBypass = sched.AlarmBypass;
                    secndSched.AlarmDelay = sched.AlarmDelay;
                    secndSched.AlarmTypeID = sched.AlarmTypeID;
                    secndSched.StartMinute = 0;
                    secndSched.WeekDay = end['weekDay'];
                    secndSched.EndMinute = end['dayMinutes'];

                    if (!dicSched.hasOwnProperty(secndSched.WeekDay)) {
                        dicSched[secndSched.WeekDay] = [];
                    }

                    dicSched[secndSched.WeekDay].push(secndSched);
                }
            });

            utcSchedules = this.mergeSchedules(dicSched);
        }

        return utcSchedules;
    }


    private mergeSchedules(dicSchedules: object): Array<AlarmTypeSchedule> {
        const schedules: Array<AlarmTypeSchedule> = [];
        let list: Array<AlarmTypeSchedule> = null;
        // tslint:disable-next-line:forin
        for (const prop in dicSchedules) {
            list = dicSchedules[prop];
            if (list.length > 1) {
                list = ServiceHelper.sortArray(list, 'StartMinute', null, true);
                for (let i = list.length - 1; i > 0; i--) {
                    if (list[i]['StartMinute'] === list[i - 1]['EndMinute'] &&
                        list[i]['AlarmBypass'] === list[i - 1]['AlarmBypass'] &&
                        list[i]['AlarmDelay'] === list[i - 1]['AlarmDelay']) {
                        list[i - 1]['EndMinute'] = list[i]['EndMinute'];
                        list.splice(i, 1);
                    }
                }
            }

            schedules.push.apply(schedules, list);
        }

        return schedules;
    }


    private setChartData() {
        const chartData: Array<DataItem> = [];
        this.schedData = null;
        const now: Date = new Date();

        if (this._alrmScheds && this._alrmScheds.length > 0) {
            this._alrmScheds.forEach((sched: AlarmTypeSchedule) => {
                chartData.push({
                    day: this.arrDays[sched.WeekDay],
                    weekDay: sched.WeekDay,
                    startMinute: sched.StartMinute,
                    fromTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), sched.StartMinute / 60),
                    endMinute: sched.EndMinute,
                    toTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), sched.EndMinute / 60),
                    title: this.getTitle(sched),
                    info: sched,
                    // day['color'] = null;
                });
            });
        }

        this.schedData = chartData;
    }


    private getTitle(sched: AlarmTypeSchedule): string {
        let title: string = this.formatHour(sched.StartMinute) + '-' + this.formatHour(sched.EndMinute);
        if (sched.AlarmBypass) {
            title = title + ' (Bypass)';
        } else {
            title = title + ': Delay: ' + ServiceHelper.formatMinutesSpan(sched.AlarmDelay);
        }

        return title;
    }


    private formatHour(hour: number): string {
        const date: Date = new Date(null, 0);
        date.setMinutes(hour);
        return ServiceHelper.dateFormat(date, DateTimeFormats.FORMAT_TIME_SHORT_USA, 'en');
    }


    private validateScheds(sched: AlarmTypeSchedule): boolean {
        let flg = true;
        this._alrmScheds.forEach((tmpSched: AlarmTypeSchedule) => {
            if (!(tmpSched.WeekDay === sched.WeekDay && tmpSched.StartMinute === sched.StartMinute && tmpSched.EndMinute === sched.EndMinute)) {
                if (tmpSched.WeekDay === sched.WeekDay) {
                    if ((sched.StartMinute >= tmpSched.StartMinute && sched.StartMinute <= tmpSched.EndMinute) ||
                        (sched.EndMinute >= tmpSched.StartMinute && sched.EndMinute <= tmpSched.EndMinute) ||
                        (sched.StartMinute >= tmpSched.StartMinute && sched.EndMinute <= tmpSched.EndMinute)) {

                        this.MsgService.add({
                            severity: 'error',
                            summary: 'AlarmType Schedule Error',
                            detail: 'New AlarmType Schedule Start and/or End time overlappes with another AlarmType Schedule!'
                        });

                        flg = false;
                    }
                }
            }
        });

        return flg;
    }
}



class DataItem {
    day: string;
    weekDay: number;
    startMinute?: number;
    fromTime?: Date;
    endMinute?: number;
    toTime?: Date;
    title?: string;
    color?: string;
    info: AlarmTypeSchedule;
}
