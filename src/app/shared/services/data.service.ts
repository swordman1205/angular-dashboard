import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogService } from './log.service';
import { Actions } from '../data/constants/actions';
import { EcsEvent } from '../events/ecsEvent';
import { Events } from '../data/constants/events';
import { Subject } from 'rxjs/Subject';
import { HandleError, HttpErrorHandler } from './error-handler.service';
import { catchError, map, shareReplay } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { LoginResponse } from '../types/loginResponse';
import { User } from '../types/user';
import { AssetMeasureLastStatus } from '../types/assetMeasureLastStatus';
import { JsonResponse } from '../types/JsonResponse';
import { Location } from '../types/location';
import { IJsonConfig } from './io/io-interfaces';
import { ECSJson } from './io/json-serializer';
import { CommonData } from '../types/common-data';
import { UserAction } from '../types/userAction';
import { AssetMeasureLog } from '../types/assetMeasureLog';
import { UserSetting } from '../types/userSetting';
import { AssetMeasureLastValue } from '../types/assetMeasureLastValue';
import { AssetMeasureStatus } from '../types/assetMeasureStatus';
import { MeshRouterStatus } from '../types/meshRouterStatus';
import { Ticket } from '../types/ticket';
import { CookingCycleTemplate } from '../types/cookingCycleTemplate';
import { Device } from '../types/device';
import { MeshRouter } from '../types/meshRouter';
import { AssociatedDevice } from '../types/associatedDevice';
import { RouteRecord } from '../types/routeRecord';
import { CheckStep } from '../types/checkStep';
import { CheckThreshold } from '../types/checkThreshold';
import { CheckChoice } from '../types/checkChoice';
import { CookingCycleRule } from '../types/cookingCycleRule';
import { UserAlert } from '../types/userAlert';
import { LocationContactAlert } from '../types/locationContactAlert';
import { IECSObject } from '../interfaces/ecsObject';
import { BatteryLog } from '../types/batteryLog';
import { GeneratedReport } from '../types/generatedReport';
import { TicketCause } from '../types/ticketCause';
import { TicketAction } from '../types/ticketAction';
import { throwError } from 'rxjs';
import {
    GET_AUTHENTICATED_USER,
    GET_COMMON_DATA,
    GET_LOCATION_ALARM_SUMMARY,
    GET_LOCATION_ALARMS,
    GET_LOCATION_ROUTERS_ALARMS,
    GET_LOCATION_STATUSES,
    GET_LOCATION_TICKET_SUMMARY,
    GET_USER_ACTIONS,
    GET_USER_LOCATIONS,
    LOGIN,
    GET_LOCATION_TICKETS,
    GET_LOCATION_INFO,
    GET_LOCATION_REPORTS,
    GET_USER_SETTINGS
} from '../data/constants/mocks';

declare var flashvars: any;
declare var moment: any;




@Injectable()
export class DataService {

    private _host: string;
    public message$: Subject<EcsEvent>;
    private onError: HandleError;
    private isMock = false;

    constructor(private _log: LogService,
                private _http: HttpClient,
                httpErrorHandler: HttpErrorHandler) {

        this.message$ = new Subject();
        this._host = flashvars.operationalURL;
        this.onError = httpErrorHandler.createHandleError('HeroesService');
    }






    // Public Network ECS API
    // ----------------------------------------
    get host(): string {
        return this._host;
    }



    // Public Network ECS API
    // ----------------------------------------

    login(user: string, password: string): Observable<LoginResponse> {
        if (this.isMock) {
            return Observable.of(LOGIN);
        }

        const data = this.createPostRequestObject(Actions.LOGIN,
            { 'username': user, 'password': password, 'rememberMe': false });

        return this.postJson(data)
            .pipe(
                map((res: Object) => {
                    return <LoginResponse>(res);
                })
            );
    }


    getAuthenticatedUser(): Observable<User> | Observable<any> {
        if (this.isMock) {
            return Observable.of(GET_AUTHENTICATED_USER);
        }

        return this.postJson<User>(this.createPostRequestObject(Actions.GET_AUTHENTICATED_USER, {}));
        // .pipe(
        //     map((res: Object) => {
        //         return <User>(res);
        //     })
        // );
    }

    getUserLocations(): Observable<Location[]> | Observable<any[]> {
        if (this.isMock) {
            return Observable.of(GET_USER_LOCATIONS);
        }

        return this.postJson<Location[]>(this.createPostRequestObject(Actions.GET_USER_LOCATIONS, {}));
    }


    getCommonData(): Observable<CommonData> | Observable<any> {
        if (this.isMock) {
            return Observable.of(GET_COMMON_DATA);
        }

        return this.postJson(this.createPostRequestObject(Actions.GET_COMMON_DATA, {}));
    }


    getLocationStatuses(id: number): Observable<AssetMeasureLastStatus[]> | Observable<any[]> {
        if (this.isMock) {
            return Observable.of(GET_LOCATION_STATUSES);
        }

        return this.postJson<AssetMeasureLastStatus[]>(
            this.createPostRequestObject(Actions.GET_LOCATION_STATUSES, { locationID: id }));
        // .pipe(
        //     map((res: Object) => {
        //         return <AssetMeasureLastStatus[]>((<any>res).$values);
        //     })
        // );
    }

    getUsersActions(id: number, startDate: Date, endDate: Date): Observable<UserAction[]> | Observable<any[]> {
        if (this.isMock) {
            return Observable.of(GET_USER_ACTIONS);
        }

        return this.postJson<UserAction[]>(this.createPostRequestObject(Actions.GET_USER_ACTIONS,
            { locationID: id, startDate: moment(startDate).utc()._d, endDate: moment(endDate).utc()._d }));
        // .pipe(
        //     map((res: Object) => {
        //         return (<any>res).$values;
        //     })
        // );
    }

    getLocationDocuments(id): Observable<Object> {
        /*if (this.isMock) {
            return Observable.of(GET_LOCATION_DOCUMENTS);
        }*/
        return this.post(this.createPostRequestObject(Actions.GET_LOCATION_DATA,
            { locationID: id, dataTypes: ['documents'] }));
    }

    getAssetDocuments(id): Observable<Object> {
        /*if (this.isMock) {
            return Observable.of(GET_ASSET_DOCUMENTS);
        }*/
        return this.post(this.createPostRequestObject(Actions.GET_ASSET_DOCUMENTS,
            { assetID: id }));
    }

    getLocationAlarmSummary(id): Observable<Object> {
        if (this.isMock) {
            return Observable.of(GET_LOCATION_ALARM_SUMMARY);
        }
        return this.post(this.createPostRequestObject(Actions.GET_LOCATION_ALARM_SUMMARY, { locationID: id }));
    }

    getAssetAlarmSummary(id): Observable<Object> {
        return this.post(this.createPostRequestObject(Actions.GET_ASSET_ALARM_SUMMARY, { assetID: id }));
    }


    getLocationTicketSummary(id): Observable<any> {
        if (this.isMock) {
            return Observable.of(GET_LOCATION_TICKET_SUMMARY);
        }
        return this.post(this.createPostRequestObject(Actions.GET_LOCATION_TICKET_SUMMARY, { locationID: id }));
    }

    getLocationInformation(id): Observable<Location> | Observable<any> {
        if (this.isMock) {
            return Observable.of(GET_LOCATION_INFO);
        }
        return this.postJson<Location>(this.createPostRequestObject(Actions.GET_LOCATION_INFORMATION,
            { locationID: id }));
    }

    getAssetTicketSummary(id): Observable<Object> {
        return this.post(this.createPostRequestObject(Actions.GET_ASSET_TICKET_SUMMARY, { assetID: id }));
    }

    getAssetMeasureLogs(assetMeasureID, startDate, endDate, isOptimized = false): Observable<AssetMeasureLog[]> {
        const api = isOptimized ? Actions.GET_OPTIMIZED_ASSET_MEASURE_LOGS : Actions.GET_ASSET_MEASURE_LOGS;
        return this.postJson<AssetMeasureLog[]>(this.createPostRequestObject(api, {
            assetMeasureID: assetMeasureID,
            startDate: moment(startDate).utc()._d,
            endDate: moment(endDate).utc()._d
        }));
        // .pipe(
        //     map((res: Object) => {
        //         return (<any>res).$values;
        //     })
        // );
    }


    getAssetMeasureStatuses(assetMeasureID, startDate, endDate): Observable<AssetMeasureLastStatus[]> {
        return this.postJson<AssetMeasureLastStatus[]>(this.createPostRequestObject(Actions.GET_ASSET_MEASURE_STATUSES,
            { assetMeasureID, startDate, endDate }));
        // .pipe(
        //     map((res: Object) => {
        //         return (<any>res).$values;
        //     })
        // );
    }


    logout() {
        return this.post(this.createPostRequestObject(Actions.LOGOUT, {}));
    }


    saveTags(locTags: string[], astTags: string[]) {
        return this.post(this.createPostRequestObject(Actions.SAVE_TAGS, { locTags, astTags }));
    }


    getUserSettings(): Observable<UserSetting> | Observable<any> {
        if (this.isMock) {
            return Observable.of(GET_USER_SETTINGS);
        }
        return this.postJson<UserSetting>(this.createPostRequestObject(Actions.GET_USER_SETTINGS, {}));
    }


    getTaggedAssetLastValues(assetIds: Array<number>): Observable<AssetMeasureLastValue[]> {
        return this.postJson<AssetMeasureLastValue[]>(
            this.createPostRequestObject(Actions.GET_TAGGED_ASSET_LAST_VALUES, { assetIDs: assetIds }));
        // .pipe(
        //     map((res: Object) => {
        //         return (<any>res).$values;
        //     })
        // );
    }

    getTaggedLocationSummary(locationIds, showWarnings = false): Observable<Object> {
        return this.postJson<Array<any>>(this.createPostRequestObject(Actions.GET_TAGGED_LOCATION_SUMMARY,
            { locationIDs: locationIds, showWarnings }));
    }

    getTaggedAssetSummary(assetIds, showWarnings = false): Observable<Object> {
        return this.postJson<Array<any>>(this.createPostRequestObject(Actions.GET_TAGGED_ASSET_SUMMARY,
            { assetIDs: assetIds, showWarnings }));
    }

    getLocationAlarms(itemId, showWarnings): Observable<AssetMeasureStatus[]> | Observable<any[]> {
        if (this.isMock) {
            return Observable.of(GET_LOCATION_ALARMS);
        }
        return this.postJson<AssetMeasureStatus[]>(this.createPostRequestObject(Actions.GET_LOCATION_ALARMS,
            { locationID: itemId, showWarnings }));
        // .pipe(
        //     map((res: Object) => {
        //         return (<any>res).$values;
        //     })
        // );
    }


    getLocationRoutersAlarms(itemId, showWarnings): Observable<MeshRouterStatus[]> | Observable<any[]> {
        if (this.isMock) {
            return Observable.of(GET_LOCATION_ROUTERS_ALARMS);
        }
        return this.postJson<MeshRouterStatus[]>(
            this.createPostRequestObject(Actions.GET_LOCATION_ROUTERS_ALARMS, { locationID: itemId, showWarnings }));
        // .pipe(
        //     map((res: Object) => {
        //         return (<any>res).$values;
        //     })
        // );
    }


    getLocationTickets(itemId, openTickets, from, to): Observable<Ticket[]> | Observable<any[]> {
        if (this.isMock) {
            return Observable.of(GET_LOCATION_TICKETS);
        }
        return this.postJson<Ticket[]>(this.createPostRequestObject(Actions.GET_LOCATION_TICKETS,
            { locationID: itemId, openTickets: openTickets, startDate: from, endDate: to }));
        // .pipe(
        //     map((res: Object) => {
        //         return (<any>res).$values;
        //     })
        // );
    }


    getTaggedAssetAlarms(assetIDs, showWarnings): Observable<AssetMeasureStatus[]> {
        return this.postJson<AssetMeasureStatus[]>(
            this.createPostRequestObject(Actions.GET_TAGGED_ASSET_ALARMS, { assetIDs, showWarnings }));
        // .pipe(
        //     map((res: Object) => {
        //         return (<any>res).$values;
        //     })
        // );
    }

    getTaggedAssetTickets(assetIDs, openTickets, startDate, endDate): Observable<Ticket[]> {
        return this.postJson<Ticket[]>(this.createPostRequestObject(Actions.GET_TAGGED_ASSET_TICKETS,
            { assetIDs, openTickets, startDate, endDate }));
    }


    getTaggedLocationAlarms(locationIDs, showWarnings): Observable<AssetMeasureStatus[]> {
        return this.postJson<AssetMeasureStatus[]>(
            this.createPostRequestObject(Actions.GET_TAGGED_LOCATION_ALARMS, { locationIDs, showWarnings }));
        // .pipe(
        //     map((res: Object) => {
        //         return (<any>res).$values;
        //     })
        // );
    }

    getTaggedLocationRoutersAlarms(locationIDs, showWarnings): Observable<MeshRouterStatus[]> {
        return this.postJson<MeshRouterStatus[]>(
            this.createPostRequestObject(Actions.GET_TAGGED_LOCATION_ROUTERS_ALARMS, { locationIDs, showWarnings }));
        // .pipe(
        //     map((res: Object) => {
        //         return (<any>res).$values;
        //     })
        // );
    }


    getTaggedLocationTickets(locationIDs, openTickets, startDate, endDate): Observable<Ticket[]> {
        return this.postJson<Ticket[]>(this.createPostRequestObject(Actions.GET_TAGGED_LOCATION_TICKETS,
            { locationIDs, openTickets, startDate, endDate }));
        // .pipe(
        //     map((res: Object) => {
        //         return (<any>res).$values;
        //     })
        // );
    }


    changePassword(currentPassword: string, newPassword: string): Observable<Object> {
        const data = this.createPostRequestObject(Actions.CHANGE_PASSWORD, { currentPassword, newPassword });
        return this.postJson(data);
    }


    getAllowedUsers(): Observable<User[]> {
        return this.postJson<User[]>(this.createPostRequestObject(Actions.GET_ALLOWED_USERS, {}));
    }


    getLocationReports(locationID: number): Observable<GeneratedReport[]> | Observable<any[]> {
        if (this.isMock) {
            return Observable.of(GET_LOCATION_REPORTS);
        }
        return this.postJson<GeneratedReport[]>(this.createPostRequestObject(Actions.GET_LOCATION_REPORTS, { locationID: locationID }));
    }

    getVirtualReports(virtualName: string, locationIDs: Array<number>, assetIDs: Array<number>): Observable<GeneratedReport[]> {
        return this.postJson<GeneratedReport[]>(this.createPostRequestObject(Actions.GET_VIRTUAL_REPORTS,
            { virtualName: virtualName, locationIDs: locationIDs, assetIDs: assetIDs }));
    }

    getGeneratedReport(reportID: number): Observable<GeneratedReport> {
        return this.postJson<GeneratedReport>(this.createPostRequestObject(Actions.GET_GENERATED_REPORT, { reportID: reportID }));
    }

    generateReport(params: any): Observable<string> {
        const url = flashvars.reportURL + '/GenerateReport.ashx';
        const respLogin = <LoginResponse>(JSON.parse(sessionStorage.getItem('ecsLoginUser')));
        params['Cookie'] = respLogin.Ticket;
        params['Locale'] = 'en-US'; // respLogin.;

        // const headers = new HttpHeaders({ 'Content-Type': 'text/xml' });
        // headers.append('Accept', 'text/xml');
        // headers.append('Content-Type', 'text/xml');

        return this._http.post(url, params,
            {
                responseType: 'text',
                withCredentials: true,
                reportProgress: true,
                observe: 'body'
            })
            .pipe(
                catchError((err: HttpResponse<Object>) => {
                    return this.handleError(err);
                }),
                map(
                    (res: string) => res)
            );
    }

    getReportFile(params: any): Observable<ArrayBuffer> {
        const url = flashvars.reportURL + '/GetReport.ashx';
        const respLogin = <LoginResponse>(JSON.parse(sessionStorage.getItem('ecsLoginUser')));
        params['Cookie'] = respLogin.Ticket;

        return this._http.post(url, params,
            {
                responseType: 'arraybuffer', // 'blob' as 'json', // 'arraybuffer'
                withCredentials: true,
                reportProgress: true
            })
            .pipe(
                catchError((err: HttpResponse<Object>) => {
                    return this.handleError(err);
                }),
                map((res: ArrayBuffer) => {
                    return res;
                })
            );
    }






    // Location Config Operations
    // --------------------------------

    // ---------------------------------------
    // GET Operations
    // ---------------------------------------
    getLocationData(locationID: number, dataTypes: string[]): Observable<Object> {
        return this.postJson<Object>(
            this.createPostRequestObject(Actions.GET_LOCATION_DATA,
                { locationID: locationID, dataTypes: dataTypes }));
    }

    getInstalledFirmwares(devicType: number, pcktVer: number): Observable<Array<string>> {
        return this.postJson<Array<string>>(
            this.createPostRequestObject(Actions.GET_FIRMWARES, { devicType: devicType, pcktVer: pcktVer }));
    }

    updateIntelliGateFirmware(deviceID: number, firmwarePath: string): Observable<any> {
        return this.postJson<any>(
            this.createPostRequestObject(Actions.UPDATE_IG_FIRMWARE, { deviceID: deviceID, firmwarePath: firmwarePath }));
    }

    rebootIntelliGate(deviceID: number): Observable<any> {
        return this.postJson<any>(
            this.createPostRequestObject(Actions.REBOOT_IG, { deviceID: deviceID }));
    }

    resetSecPairing(deviceID: number, secPairing: number): Observable<any> {
        return this.postJson<any>(
            this.createPostRequestObject(Actions.RESET_SEC_PAIRING, { deviceID: deviceID, secPairing: secPairing }));
    }

    generateIdentificationCode(locationID: number): Observable<string> {
        return this.post(
            this.createPostRequestObject(Actions.GENERATE_ID_CODE, { locationID: locationID }))
            .pipe(
                map(res => <string>res)
            );
    }

    getRouterAssociatedDevices(routerID: number): Observable<Array<AssociatedDevice>> {
        return this.postJson<Array<AssociatedDevice>>(
            this.createPostRequestObject(Actions.GET_ASSOC_DEVICES,
                { routerID: routerID }));
    }

    getDeviceRouteRecords(deviceID: number): Observable<Array<RouteRecord>> {
        return this.postJson<Array<RouteRecord>>(
            this.createPostRequestObject(Actions.GET_DEVICE_RT_RECORDS,
                { deviceID: deviceID }));
    }

    getMeshRouteRecords(routerID: number): Observable<Array<RouteRecord>> {
        return this.postJson<Array<RouteRecord>>(
            this.createPostRequestObject(Actions.GET_ROUTER_RT_RECORDS,
                { routerID: routerID }));
    }

    getLocCookingCycleTemplates(locationID: number): Observable<Array<CookingCycleTemplate>> {
        return this.postJson<Array<CookingCycleTemplate>>(
            this.createPostRequestObject(Actions.GET_COOKING_CYCLE_TEMPLATES,
                { locationID: locationID }));
    }

    getCookingCycleRules(checkItemID: number): Observable<Array<CookingCycleRule>> {
        return this.postJson<Array<CookingCycleRule>>(
            this.createPostRequestObject(Actions.GET_COOKING_CYCLE_RULES,
                { checkItemID: checkItemID }));
    }

    getBatteryLogs(deviceID: number, startDate: Date, endDate: Date): Observable<Array<BatteryLog>> {
        return this.postJson<Array<BatteryLog>>(
            this.createPostRequestObject(Actions.GET_BATTERY_LOGS,
                { deviceID: deviceID, startDate: startDate, endDate: endDate }));
    }

    getSignalLogs(deviceID: number, startDate: Date, endDate: Date): Observable<Object> {
        return this.postJson<Object>(
            this.createPostRequestObject(Actions.GET_SIGNAL_LOGS,
                { deviceID: deviceID, startDate: startDate, endDate: endDate }));
    }







    // ---------------------------------------
    // SAVE Operations
    // ---------------------------------------

    saveLocationDevices(locationID: number, devices: Array<Device>): Observable<Array<Device>> {
        return this.postJson<Array<Device>>(
            this.createPostRequestObject(Actions.SAVE_LOCATION_DEVICES, { locationID: locationID, devices: devices }));
    }

    saveLocationMeshRouters(locationID: number, routers: Array<MeshRouter>): Observable<Array<MeshRouter>> {
        return this.postJson<Array<MeshRouter>>(
            this.createPostRequestObject(Actions.SAVE_LOCATION_ROUTERS, { locationID: locationID, routers: routers }));
    }

    saveCheckSteps(locationID: number, checkSteps: Array<CheckStep>): Observable<Array<CheckStep>> {
        return this.postJson<Array<CheckStep>>(
            this.createPostRequestObject(Actions.SAVE_CHECK_STEPS,
                { locationID: locationID, checkSteps: checkSteps }));
    }

    saveCheckThresholds(locationID: number, checkThresholds: Array<CheckThreshold>): Observable<Array<CheckThreshold>> {
        return this.postJson<Array<CheckThreshold>>(
            this.createPostRequestObject(Actions.SAVE_CHECK_THRESHOLDS,
                { locationID: locationID, checkThresholds: checkThresholds }));
    }

    saveCheckChoices(locationID: number, checkChoices: Array<CheckChoice>): Observable<Array<CheckChoice>> {
        return this.postJson<Array<CheckChoice>>(
            this.createPostRequestObject(Actions.SAVE_CHECK_CHOICES,
                { locationID: locationID, checkChoices: checkChoices }));
    }

    saveCookingCycleRules(rules: Array<CookingCycleRule>): Observable<Array<CookingCycleRule>> {
        return this.postJson<Array<CookingCycleRule>>(
            this.createPostRequestObject(Actions.SAVE_COOKING_CYCLE_RULES,
                { rules: rules }));
    }

    saveLocationAlerts(locationID: number, userAlerts: Array<UserAlert>, contactAlerts: Array<LocationContactAlert>): Observable<Object> {
        return this.postJson<Object>(
            this.createPostRequestObject(Actions.SAVE_LOCATION_ALERTS,
                { locationID: locationID, userAlerts: userAlerts, contactAlerts: contactAlerts }));
    }

    saveLocationTicketItems(locationID: number, ticketCauses: Array<TicketCause>, ticketActions: Array<TicketAction>): Observable<Object> {
        return this.postJson<Object>(
            this.createPostRequestObject(Actions.SAVE_LOCATION_TICKET_ITEMS,
                { locationID: locationID, ticketCauses: ticketCauses, ticketActions: ticketActions }));
    }

    saveLocationData<TEcs extends IECSObject>(locationID: number, actName: string, arr: Array<TEcs>): Observable<Array<TEcs>> {
        return this.postJson<Array<TEcs>>(this.createPostRequestObject(actName, { locationID: locationID, arr: arr }));
    }







    // Private 'Helper' Methods
    // ----------------------------------------

    private post(data: any): Observable<Object> {
        const httpHeadr = this.addHeaders(data);

        return this._http.post<Object>(this._host, data,
            {
                // responseType: 'json',
                headers: httpHeadr,
                withCredentials: true,
                observe: 'body'
            })
            .pipe(
                // catchError(this.onError<Hero[]>('data.service', []))
                catchError((err: HttpResponse<Object>) => {
                    return this.handleError(err);
                }),
                map((res: Object) => {
                    return (<any>res).ReturnValue;
                }) // ,
                // shareReplay()
            );
    }


    private postJson<TResp>(data: any): Observable<TResp> {
        const httpHeadr = this.addHeaders(data);

        return this._http.post(this._host, data,
            {
                // responseType: 'text' as 'json',
                headers: httpHeadr,
                withCredentials: true,
                observe: 'body'
            })
            .pipe(
                // catchError(this.onError<Hero[]>('data.service', []))
                catchError((err: HttpResponse<Object>) => {
                    return this.handleError(err);
                }),
                map((res: string) => {
                    let resp: JsonResponse;
                    const settings: IJsonConfig = {
                        reviver: (key, value) => {
                            if (typeof value === 'object') {
                                return value;
                            }
                        },
                        maxObjects: 100000
                    };

                    try {
                        resp = ECSJson.parse(res, JsonResponse, settings);
                    } catch (err2) {
                        console.log((<Error>err2));
                    }

                    return <TResp>(resp.ReturnValue);
                }) // ,
                // shareReplay()
            );
    }


    private addHeaders(data: any): HttpHeaders {

        const headers = new HttpHeaders()
            .set('Action', data.Action)
            .set('Content-Type', 'ecs/json')
            .set('Accept', 'application/json, text/plain, */*');

        return headers;
    }


    private createGetParams(...params): HttpParams {
        const parms = new HttpParams();
        // const parms = new HttpParams({ fromString: '_page=1&_limit=1' });

        return parms;
    }


    private createPostRequestObject(action: string, params: any) {
        return { 'Action': action, 'Parameters': params };
    }


    private handleError(err: HttpResponse<Object> | any): Observable<Error> {

        let errMsg: string;

        if (err instanceof HttpErrorResponse) {
            const httpErr: HttpErrorResponse = <HttpErrorResponse>(err);

            if (httpErr.error instanceof ProgressEvent) {
                this._log.error(`Got ProgressEvent Error.'
                    Status: ${err.status}. Error: ${err.message}`);
            }

            if ([401, 452].includes(httpErr.status)) {
                this._log.error(`Got ${err.status}, Reroute to root`);
                const e = new EcsEvent(Events.UNAUTHORIZED);
                this.message$.next(e);
            }

            if (httpErr.status === 500 && httpErr.error && httpErr.error.ReturnValue && httpErr.error.ReturnValue.faultstring !== '') {
                errMsg = httpErr.error.ReturnValue.faultstring;
            } else {
                const str = typeof httpErr.error === 'string' ? httpErr.error : httpErr.error.ReturnValue;
                errMsg = `${httpErr.status} - ${httpErr.statusText || ''} ${str}`;
            }
        } else {
            errMsg = err.message$ ? err.message$ : 'error';
        }
        this._log.error(`${errMsg}`);
        return throwError(err);
    }


    // private handleError(error: HttpErrorResponse) {
    //     if (error.error instanceof ErrorEvent) {
    //       // A client-side or network error occurred. Handle it accordingly.
    //       console.error('An error occurred:', error.error.message$);
    //     } else {
    //       // The backend returned an unsuccessful response code.
    //       // The response body may contain clues as to what went wrong,
    //       console.error(
    //         `Backend returned code ${error.status}, ` +
    //         `body was: ${error.error}`);
    //     }
    //     // return an observable with a user-facing error message$
    //     return throwError(
    //       'Something bad happened; please try again later.');
    //   };
}
