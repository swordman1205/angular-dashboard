import { slideInDownAnimation } from '../animation/route-animation';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { GeneratedReport } from '../shared/types/generatedReport';
import { Observable } from 'rxjs';
import { SelectItem, MessageService } from 'primeng/api';
import { Report } from '../shared/types/report';
import { IStatusProvider } from '../shared/interfaces/statusProvider';
import { ReportProcessingStatus, ReportStatusList } from '../shared/data/constants/reportProcessingStatus';
import { Reports, ReportNameList } from '../shared/data/constants/reports';
import { RouteService } from '../shared/services/route.service';
import { TopologyService } from '../shared/services/topology.service';
import { CommonService } from '../shared/services/common.service';
import { DataService } from '../shared/services/data.service';
import { LogService } from '../shared/services/log.service';
import { TranslateService } from '@ngx-translate/core';
import { IEcsPath } from '../shared/interfaces/ecsPath';
import { ServiceHelper } from '../shared/services/serviceHelper';
import { DateTimeFormats } from '../shared/data/constants/datetimeFormats';












@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    animations: [slideInDownAnimation]
})
export class ReportsComponent implements OnInit, OnDestroy {
    private _routeSubscription$: Subscription;
    private _getDataSubscrp: Subscription;
    private _getRptSubscrp: Subscription;
    private _genrtRptSubscrp: Subscription;
    private _chkStatSubscrp: Subscription;
    private _getData$: Observable<GeneratedReport[]>;
    private _statusInterval: any;
    private _chkStatusIntrvl = 15000;

    itemType: string;
    itemId: number;
    locationID: number;

    private _rptItems: SelectItem[];
    private _currReport: Report;
    loading: boolean;

    private _dataProvider: IStatusProvider;
    private _locationIDs: Array<number>;
    private _assetIDs: Array<number>;
    private _virtualName: string;
    private _isTagReport = false;
    private flgVirtual: boolean;

    genReports: Array<GeneratedReport>;
    filtrReports: Array<GeneratedReport>;
    currGenReport: GeneratedReport;
    newGenReport: GeneratedReport;
    flgDisplayGenRptDlg = false;

    selRptID = Reports.DAILY_SUMMARY;
    selStartDate: Date;
    selEndDate: Date;
    incldWarnings = true;
    onlyAlarms = false;
    selFormat = 'pdf';

    flgShowDates = true;
    flgShowIncldWarn = true;
    flgShowOnlyAlarms = false;

    rptStatuses = ReportProcessingStatus;
    reportOptions: SelectItem[];

    formatOptions: SelectItem[] = [
        { label: 'PDF', value: 'pdf' },
        { label: 'XLS', value: 'xls' },
        { label: 'JPG', value: 'jpg' }
    ];

    reportCols = [
        { field: 'ReportID', header: 'Report', sortable: true },
        { field: 'CreateDate', header: 'Create Date', sortable: true },
        { field: 'StartDate', header: 'Start Date', sortable: true },
        { field: 'EndDate', header: 'End Date', sortable: true },
        { field: 'Status', header: 'Status', sortable: true },
    ];

    private arrGridBGColor = ['#FF0000', // Created
        '#FFFF00', // Processing
        '#FF3300', // Error
        '#00CC00', // Ready
        '#FF0000']; // deleted










    // CTor
    // -------------------------------
    constructor(private router: RouteService,
        private topology: TopologyService,
        private common: CommonService,
        private data: DataService,
        private logger: LogService,
        private translate: TranslateService,
        private msgService: MessageService) {

    }







    // LifeCycle Hooks
    // -------------------------------
    ngOnInit(): void {
        this._rptItems = [];
        this.reportOptions = [];

        this._routeSubscription$ = this.router.getRoutingSubscription()
            .subscribe((path: IEcsPath) => {
                this.itemType = path.itemType;
                this.itemId = path.itemID;

                if (this.itemType && this.itemId) {
                    const item = this.topology.getItemLocation(this.itemType, this.itemId);
                    if (this.locationID !== item.ID) {
                        this.locationID = item.ID;

                        this._virtualName = null;
                        this._assetIDs = null;
                        this._locationIDs = null;

                        this.getData();
                    }
                }
            });


        const reports: Array<Report> = ServiceHelper.getAuthorizedReports(this.common.loggedUser, this.common.commonData.Reports, this.isTagReport);
        if (reports && reports.length > 0) {
            reports.forEach((report: Report) => {
                this._rptItems.push({ label: report.Name, value: report });
                this.reportOptions.push({ label: report.Name, value: report.ID });
            });
        }

        this.setSelectedRpt();
        this.selStartDate = ServiceHelper.getTodayStart();
        this.selEndDate = ServiceHelper.getTodayEnd();
        this.incldWarnings = this.common.loggedUser.ShowWarnings;

        const val: String = this.common.getApplicationSetting('Client', 'ReportEnquiringInterval').Value;
        if (val != null && typeof val === 'number') {
            this._chkStatusIntrvl = parseInt(val, 10) * 1000;
            if (this._chkStatusIntrvl < 5000) {
                this._chkStatusIntrvl = 5000;
            }
        }
    }

    ngOnDestroy(): void {
        if (this._routeSubscription$) {
            this._routeSubscription$.unsubscribe();
        }
    }








    // Properties
    // -------------------------------
    set CurrReport(report: Report) {
        this._currReport = report;
        this.filterReports();
    }

    get CurrReport(): Report {
        return this._currReport;
    }

    get reportItems(): SelectItem[] | any {
        if (this._rptItems && this._rptItems.length > 0) {
            return this._rptItems;
        } else {
            return null;
        }
    }

    get isTagReport(): boolean {
        return this._isTagReport;
    }

    set isTagReport(value: boolean) {
        if (this._isTagReport !== value) {
            this._isTagReport = value;
        }
    }

    get virtualName(): string {
        return this._virtualName;
    }

    set virtualName(value: string) {
        if (this._virtualName !== value) {
            this._virtualName = value;
        }
    }

    get assetIDs(): Array<number> {
        return this._assetIDs;
    }

    set assetIDs(value: Array<number>) {
        if (this._assetIDs !== value) {
            this._assetIDs = value;
        }
    }

    get locationIDs(): Array<number> {
        return this._locationIDs;
    }

    set locationIDs(value: Array<number>) {
        if (this._locationIDs !== value) {
            this._locationIDs = value;
        }
    }

    // get dataProvider(): IStatusProvider {
    //     return this._dataProvider;
    // }









    // Data Manipulation
    // -------------------------------
    getData() {
        this.loading = true;
        this.logger.info(`Getting data for widget locations config devices - LocationId: ${this.locationID}`);
        // super.getData();

        if (this.flgVirtual) {
            // this._getData$ = this.data.getVirtualReports(virtualName, _locationIDs, _assetIDs);
        } else {
            this._getData$ = this.data.getLocationReports(this.locationID);
        }

        this._getDataSubscrp = this._getData$
            .subscribe(
                res => {
                    this.genReports = res;
                    this.genReports.forEach((genRpt: GeneratedReport) => {
                        genRpt.Style = { background: this.arrGridBGColor[genRpt.Status], padding: '0px 0px 0px 10px' };
                        genRpt.CreateTime = new Date(genRpt.CreateDate).getTime();
                    });

                    this.setSelectedRpt();
                    this.loading = false;
                },
                err => {
                    this.logger.error(`error in config location devices ${err}`);
                    this.loading = false;
                    this._getDataSubscrp.unsubscribe();
                },
                () => {
                    this._getDataSubscrp.unsubscribe();
                });

    }









    // Event Handlers
    // -----------------------------
    getColData(genRpt: GeneratedReport, propName: string): string {
        let data: string = null;
        switch (propName) {
            case ('ReportID'): {
                data = ReportNameList[genRpt.ReportID];
                break;
            }

            case ('CreateDate'):
            case ('StartDate'):
            case ('EndDate'): {
                data = ServiceHelper.dateFormat(genRpt[propName], DateTimeFormats.FORMAT_DATE_TIME_USA_STANDARD, 'en');
                break;
            }

            case ('Status'): {
                data = ReportStatusList[genRpt.Status];
                break;
            }

            default: {
                data = genRpt[propName];
            }
        }

        return data;
    }


    rptTypeChanaged(event) {
        this.flgShowDates = false;
        this.flgShowIncldWarn = false;
        this.flgShowOnlyAlarms = false;

        switch (this.selRptID) {
            case Reports.ASSET_DETAILS:
            case Reports.AUDIT_LOG:
            case Reports.INTELLIRINSE:
            case Reports.EXECUTIVE_SUMMARY:
            case Reports.ASSET_MAINTENANCE:
            case Reports.ASSET_MEASURES_LOG:
            case Reports.TICKETS_BY_TIME:
            case Reports.TICKETS_BY_LOCATION:
            case Reports.DIGITAL_ALARMS_SUMMARY:
            case Reports.CALIBRATIONS:
            case Reports.INTELLITASK_SENSORS:
            case Reports.INTELLITASK_HANDHELDS:
            case Reports.INTELLITASK_DAILY_SUMMARY:
            case Reports.DATA_INTEGRITY:
                this.flgShowDates = true;
                break;

            case Reports.DAILY_SUMMARY:
            case Reports.ALARMS:
                this.flgShowDates = true;
                this.flgShowIncldWarn = true;
                break;

            case Reports.INTELLICHECK_BY_TIME:
            case Reports.INTELLICHECK_BY_LOCATION:
                this.flgShowDates = true;
                this.flgShowOnlyAlarms = true;
                break;
        }

        if (!this.flgShowDates) {
            this.selStartDate = null;
            this.selEndDate = null;
        }
    }


    downloadReport(event, genRpt: GeneratedReport) {
        this.loading = true;

        const parameters = {
            'id': genRpt.ID,
            'reportID': genRpt.ReportID,
            'locationID': this.locationID,
            'startDate': genRpt.StartDate, // .getTime(),
            'endDate': genRpt.EndDate, // .getTime(),
            'includeWarnings': genRpt.IncludeWarnings,
            'onlyAlarms': genRpt.OnlyAlarms,
            'format': genRpt.Format,
            'locations': genRpt.LocationIDs,
            'assets': genRpt.AssetIDs,
            'virtualName': genRpt.VirtualName
        };

        const fileName: string = ReportNameList[genRpt.ReportID];

        this._getRptSubscrp = this.data.getReportFile(parameters)
            .subscribe(
                res => {
                    this.loading = false;

                    // It is necessary to create a new blob object with mime-type explicitly set
                    // otherwise only Chrome works like it should
                    let ext = 'application/pdf';
                    switch (genRpt.Format) {
                        case 'XLS': {
                            ext = 'application/ms-excel';
                            break;
                        }

                        case 'JPG': {
                            ext = 'application/jpg';
                            break;
                        }
                    }

                    const newBlob = new Blob([res], { type: ext });

                    // IE/Edge Implementation
                    // ( E/Edge forbids using a blob object directly as link href we MUST use msSaveOrOpenBlob)
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(newBlob, fileName + '.' + ext);
                        return;
                    }

                    // Other browsers - Create a link pointing to the ObjectURL containing the blob.
                    const data = window.URL.createObjectURL(newBlob);
                    const link = document.createElement('a');
                    link.setAttribute('style', 'display: none');
                    link.href = data;
                    link.download = fileName + '.' + genRpt.Format;

                    // link.click() does not work on the latest firefox
                    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

                    setTimeout(function () {
                        // For Firefox it is necessary to delay revoking the ObjectURL
                        window.URL.revokeObjectURL(data);
                        link.remove();
                    }, 100);
                },
                err => {
                    this.logger.error(`error in config location devices ${err}`);
                    this.loading = false;
                    this._getRptSubscrp.unsubscribe();

                    this.msgService.add({
                        severity: 'error',
                        summary: 'Get Generated Report',
                        detail: 'Request for downloading Generated Report has failed. ' + err
                    });
                },
                () => {
                    this._getRptSubscrp.unsubscribe();
                });
    }


    generateRpt() {
        this.loading = true;
        this.newGenReport = null;

        if (!this.validateDates()) {
            this.logger.error(this.translate.instant('REPORTS.MESSAGES.TIME_SPAN_ERROR_1') +
                this.common.maxSearchFilterDays +
                this.translate.instant('REPORTS.MESSAGES.TIME_SPAN_ERROR_2'));

            return;
        }

        if (this.assetIDs && this.assetIDs.length === 0) {
            if (!(this.locationIDs && this.locationIDs.length > 0)) {
                this.msgService.add({
                    severity: 'error',
                    summary: this.translate.instant('REPORTS.MESSAGES.EMPTY_ASSET_TAGS_LIST_TITLE'),
                    detail: this.translate.instant('REPORTS.MESSAGES.EMPTY_ASSET_TAGS_LIST')
                });

                this.loading = false;
                return;
            }
        }

        const parameters = {
            'reportID': this.selRptID,
            'locationID': this.locationID,
            'startDate': this.selStartDate.getTime(),
            'endDate': this.selEndDate.getTime(),
            'includeWarnings': this.incldWarnings,
            'onlyAlarms': this.onlyAlarms,
            'format': this.selFormat,
            'locations': this.locationIDs,
            'assets': this.assetIDs,
            'virtualName': this.virtualName
        };

        this._genrtRptSubscrp = this.data.generateReport(parameters)
            .subscribe(
                res => {
                    this.newGenReport = new GeneratedReport(res);
                    this.loading = false;

                    if (!this.genReports) {
                        this.genReports = new Array<GeneratedReport>();
                    }

                    this.newGenReport.Style = { background: this.arrGridBGColor[this.newGenReport.Status], padding: '0px 0px 0px 10px' };
                    this.newGenReport.CreateTime = new Date(this.newGenReport.CreateDate).getTime();
                    this.genReports.push(this.newGenReport);

                    this.currGenReport = this.newGenReport;
                    this.filterReports();

                    this.startStatusEnquiring(this.newGenReport.ID);
                    this.flgDisplayGenRptDlg = true;
                },
                err => {
                    this.logger.error(`error in generating requested repoer ${err}`);
                    this.loading = false;
                    this._getDataSubscrp.unsubscribe();

                    this.msgService.add({
                        severity: 'error',
                        summary: 'Generating Reports',
                        detail: 'Attempt to generate the requeste report has failed. ' + err
                    });
                },
                () => {
                    this._genrtRptSubscrp.unsubscribe();
                });
    }

    genRptDilgClosed() {
        clearInterval(this._statusInterval);
    }






    // Private "Helper" Methods
    // -----------------------------
    private filterReports() {
        this.filtrReports = null;
        let reports: Array<GeneratedReport> = new Array<GeneratedReport>();

        if (this.genReports && this.genReports.length > 0) {
            if (this._currReport) {
                reports = this.genReports.filter((genRpt: GeneratedReport) => genRpt.ReportID === this.CurrReport.ID);
            } else {
                reports = this.genReports.copyWithin(0, 0, this.genReports.length - 1);
            }
        }

        this.filtrReports = ServiceHelper.sortArray(reports, 'CreateTime', null, true);
    }

    private setSelectedRpt() {
        if (!(this._rptItems && this._rptItems.length > 0)) {
            return;
        }

        if (this.CurrReport) {
            const indx = this._rptItems.findIndex((itm: SelectItem) => itm.value.ID === this.CurrReport.ID);
            if (indx > -1) {
                this.CurrReport = this._rptItems[indx].value;
            }
        } else {
            this.filterReports();
        }
    }

    private validateDates(): boolean {
        if (this.selStartDate &&
            this.selEndDate &&
            this.selEndDate <= ServiceHelper.addDays(this.selStartDate, this.common.maxSearchFilterDays)) {
            return true;
        }

        this.msgService.add({
            severity: 'error',
            summary: this.translate.instant('REPORTS.MESSAGES.TIME_SPAN_ERROR_TITLE'),
            detail: this.translate.instant('REPORTS.MESSAGES.TIME_SPAN_ERROR_1') + this.common.maxSearchFilterDays + this.translate.instant('REPORTS.MESSAGES.TIME_SPAN_ERROR_2')
        });

        return false;
    }

    private startStatusEnquiring(rptID: number) {
        clearInterval(this._statusInterval);
        this._statusInterval = setInterval(() => this.checkReportStatus(rptID), this._chkStatusIntrvl);
    }

    private checkReportStatus(rptID: number) {
        this.logger.info(`Checking Generated Report processing Status - ReportID: ${rptID}`);

        this._chkStatSubscrp = this.data.getGeneratedReport(rptID)
            .subscribe(
                res => {
                    if (res.Status === ReportProcessingStatus.READY ||
                        res.Status === ReportProcessingStatus.ERROR) {

                        const indx = this.filtrReports.findIndex((flRpt: GeneratedReport) => this.newGenReport.ID === flRpt.ID);
                        if (indx > -1) {
                            this.filtrReports.slice(indx, 1);
                        }

                        const rpt = this.genReports.find((gnRpt: GeneratedReport) => res.ID === gnRpt.ID);
                        if (rpt) {
                            rpt.Status = res.Status;
                            rpt.Style = { background: this.arrGridBGColor[res.Status], padding: '0px 0px 0px 10px' };
                            rpt.CreateTime = new Date(res.CreateDate).getTime();
                        } else {
                            this.genReports.push(res);
                        }

                        this.filterReports();
                        this.loading = false;
                        this.flgDisplayGenRptDlg = false;
                    }
                },
                err => {
                    this.logger.error(`error in Checking Generated Report (ID: ${rptID}) processing Status ${err}`);
                    this._chkStatSubscrp.unsubscribe();
                },
                () => {
                    this._chkStatSubscrp.unsubscribe();
                });
    }
}
