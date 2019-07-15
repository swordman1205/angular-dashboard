import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { BaseConfigItem } from '../../base-config-widget/base-config-item';
import { CheckForm } from '../../../shared/types/checkForm';
import { DataRowStates } from '../../../shared/data/enums/data-row-state.enum';
import { LogService } from '../../../shared/services/log.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../../shared/services/data.service';
import { CommonService } from '../../../shared/services/common.service';
import { SelectItem, MessageService } from 'primeng/api';
import { CheckItem } from '../../../shared/types/checkItem';
import { CheckFormItem } from '../../../shared/types/checkFormItem';
import { ServiceHelper } from '../../../shared/services/serviceHelper';
import { DxSchedulerComponent, DxContextMenuComponent, DxFormComponent, DxListComponent } from 'devextreme-angular';
import Query from 'devextreme/data/query';
import { on, off } from 'devextreme/events';
import { defaults } from '../../../shared/data/defaults';






@Component({
    selector: 'config-forms-items',
    templateUrl: './config-forms-items.component.html',
    styleUrls: ['./config-forms-items.component.scss']
})
export class ConfigFormsItemsComponent extends BaseConfigItem {
    private _form: CheckForm;
    formNonSchedItems: Array<CheckFormItem>;
    formSchedItems: Array<CheckFormItem>;
    private _allCheckItems: Array<CheckItem>;
    currCheckItem: CheckItem;
    currChcFrmItem: CheckFormItem;
    selSchedItem: any;

    rowStates = DataRowStates;

    private _allCheckItemElmnt: Array<SelectItem>;
    private _formNonSchedElmnts: Array<SelectItem>;
    resDraggedItem: CheckItem;
    chkDraggedItem: CheckFormItem;
    currAppoint: any;

    // @ViewChild(DxSchedulerComponent) scheduler: DxSchedulerComponent;
    // @ViewChild('appointmentMenu') appointmentMenu: DxContextMenuComponent;
    // @ViewChild('cellMenu') cellMenu: DxContextMenuComponent;

    resources: DatCheckItem[];
    lstHourScheds: DatFormCheckItem[];
    schedules: DatSchedule[];
    resourcesMenuItems: DatMenuItem[];
    groups: any;
    crossScrollingEnabled = true;

    contextMenuCellData: any;
    contextMenuAppointmentData: any;
    contextMenuTargetedAppointmentData: any;

    appointmentContextMenuItems: any;
    cellContextMenuItems: any;
    allContextMenuItems: any;

    colors: string[] = [
        '#bbd806',
        '#f34c8a',
        '#ae7fcc',
        '#ff8817',
        '#03bb92',
    ];


    currentDate: Date = new Date(2016, 3, 6);
    isPopupVisible = false;









    constructor(logger: LogService,
        translate: TranslateService,
        common: CommonService,
        msgService: MessageService,
        data: DataService) {
        super(logger, common, translate, msgService, data);


        // CONTEXT MENU
        // ----------------------------------------------------------

        // this.cellContextMenuItems = [
        //     { text: 'New Schedule', onItemClick: () => this.createAppointment() },
        //     { text: 'New Recurring Schedule', onItemClick: () => this.createRecurringAppointment() },
        //     { text: 'Group by Check Item/Ungroup', beginGroup: true, onItemClick: () => this.groupCell() },
        //     { text: 'Go to Today', onItemClick: () => this.showCurrentDate() }
        // ];

        // this.appointmentContextMenuItems = [
        //     { text: 'Open', onItemClick: () => this.showAppointment() },
        //     { text: 'Delete', onItemClick: () => this.deleteAppointment() },
        //     { text: 'Repeat Weekly', beginGroup: true, onItemClick: () => this.repeatAppointmentWeekly() },
        //     { text: 'Set Check Item', beginGroup: true, disabled: true }
        // ];

        // ----------------------------------------------------------
    }












    // Properties
    // -------------------------------------------
    @Input()
    set form(frm: CheckForm) {
        this._form = frm;

        this.formNonSchedItems = null;
        this.formSchedItems = null;
        this.currChcFrmItem = null;
        this._formNonSchedElmnts = null;
        this.schedules = null;

        this.formNonSchedItems = [];
        this.formSchedItems = [];

        if (this._form) {
            if (this._form.Items && this._form.Items.length > 0) {
                this.filterFormChkItems();
                this.loadShchduledItems();
                this.loadFormItemsElements();
            }
        }
    }

    get form(): CheckForm {
        return this._form;
    }



    @Input()
    set checkItems(items: Array<CheckItem>) {
        this._allCheckItems = items;
        this._allCheckItemElmnt = null;

        if (this._allCheckItems) {
            this.loadItemsElements();

            if (!(this._formNonSchedElmnts && this._formNonSchedElmnts.length > 0) &&
                (this.formNonSchedItems && this.formNonSchedItems.length > 0)) {
                this.loadFormItemsElements();
            }

        }
    }

    get checkItems(): Array<CheckItem> {
        return this._allCheckItems;
    }




    get checkItemElmnts(): SelectItem[] | any {
        if (this._allCheckItemElmnt && this._allCheckItemElmnt.length > 0) {
            return this._allCheckItemElmnt;
        } else {
            return null;
        }
    }



    get formNonSchedElmnts(): SelectItem[] | any {
        if (this._formNonSchedElmnts && this._formNonSchedElmnts.length > 0) {
            return this._formNonSchedElmnts;
        } else {
            return null;
        }
    }




    @ViewChild('lstScheds')
    set divScheds(list: ElementRef) {
        if (list) {
            on(list.nativeElement, 'drop', this.lstSchedsDropHandler.bind(this)); // 'dxdrop'
            // trigger(lstScheds, 'drop');
            // off(lstScheds, 'drop', this.lstSchedsDropHandler);
        }
    }


    @ViewChild('lstResources')
    set divResources(list: ElementRef) {
        if (list) {
            on(list.nativeElement, 'drop', this.lstResourcesDropHandler.bind(this));  // 'dxdrop'
            // trigger(lstScheds, 'drop');
            // off(lstScheds, 'drop', this.lstSchedsDropHandler);
        }
    }











    // Event Handlers for Scheduled CheckItem
    // -------------------------------
    lstResourcesDropHandler(event) {
        event.preventDefault();
        event.stopPropagation();

        const lst: DxListComponent = event.target;
        if (event.type === 'drop') {
            if (this.chkDraggedItem) {
                const indx = this._form.Items.findIndex((chkFormItm: CheckFormItem) =>
                    chkFormItm.Schedule &&
                    this.chkDraggedItem.Schedule.getTime() === chkFormItm.Schedule.getTime() &&
                    this.chkDraggedItem.DisplayIndex === chkFormItm.DisplayIndex);

                if (this._form.Items[indx].RowState === DataRowStates.ADDED) {
                    this._form.Items.splice(indx, 1);
                } else {
                    this._form.Items[indx].RowState = DataRowStates.DELETED;
                }


                let currItem: DatFormCheckItem = null;
                let chkFrmItm: CheckFormItem = null;
                const indx2 = this.lstHourScheds.findIndex((itm: DatFormCheckItem) => itm.ordinal === this.chkDraggedItem.DisplayIndex);

                if (indx2 < this.lstHourScheds.length - 1) {
                    for (let i = indx2 + 1; i < this.lstHourScheds.length; i++) {
                        currItem = this.lstHourScheds[i];
                        chkFrmItm = this._form.Items.find((frmItm: CheckFormItem) =>
                            frmItm.Schedule === this.chkDraggedItem.Schedule && frmItm.DisplayIndex === this.chkDraggedItem.DisplayIndex);

                        chkFrmItm.DisplayIndex--;
                        if (chkFrmItm.RowState !== DataRowStates.ADDED) {
                            chkFrmItm.RowState = DataRowStates.MODIFIED;
                        }
                    }
                }

                this.lstHourScheds.splice(indx2, 1);

                const indx3 = this.schedules.findIndex((datSched: DatSchedule) =>
                    this.chkDraggedItem.Schedule.getTime() === datSched.startDate.getTime() &&
                    this.chkDraggedItem.DisplayIndex === datSched.ordinal);

                this.schedules.splice(indx3, 1);

                this.chkDraggedItem = null;
                this.onDirtify();
            }
        }
    }

    lstSchedsDropHandler(event) {
        event.preventDefault();
        event.stopPropagation();

        const lst: DxListComponent = event.target;
        if (event.type === 'drop') {
            if (this.resDraggedItem) {
                if (!this._form.Items) {
                    this._form.Items = [];
                }

                const newIndx = this.lstHourScheds.length;
                this._form.Items.push({
                    ID: 0,
                    CheckFormID: this._form.ID,
                    CheckItemID: this.resDraggedItem.ID,
                    Schedule: this.currAppoint.startDate,
                    DisplayIndex: newIndx,
                    RowState: DataRowStates.ADDED
                });

                this.lstHourScheds.push({
                    chkItemID: this.resDraggedItem.ID,
                    text: this.resDraggedItem.Name,
                    ordinal: newIndx,
                    icon: 'fa fa-home',
                    color: null
                });

                this.schedules.push({
                    id: 0,
                    text: this.resDraggedItem.Name,
                    chkItemID: this.resDraggedItem.ID,
                    ordinal: newIndx,
                    startDate: this.currAppoint.startDate,
                    endDate: this.currAppoint.endDate,
                    data: null
                });

                this.schedules = ServiceHelper.sortArray(this.schedules, 'startDate', 'ordinal');
                this.resDraggedItem = null;
                this.onDirtify();
            }
        }
    }

    allowDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    onResourceDragStart(event: DragEvent, data: DatCheckItem) {
        this.resDraggedItem = this._allCheckItems.find((chkItm: CheckItem) => chkItm.ID === data.id);
        // event.dataTransfer.setData('text/plain', JSON.stringify(data));
    }

    onChkItemDragStart(event: DragEvent, data: DatFormCheckItem) {
        this.chkDraggedItem = this.formSchedItems.find((frmChkItm: CheckFormItem) => frmChkItm.CheckItemID === data.chkItemID && frmChkItm.DisplayIndex === data.ordinal);
        // event.dataTransfer.setData('text/plain', JSON.stringify(data));
    }

    // transferDataSuccess(event: any) {
    //     // this.receivedData.push($event);
    //     const str = event;
    // }

    overrideDefaultPopup(event: { cancel: boolean; appointmentData: { startDate: any; endDate: any; }; }) {
        event.cancel = true;

        if (event.appointmentData) {
            this.currAppoint = event.appointmentData;
            const apptStart = event.appointmentData.startDate;
            const apptEnd = event.appointmentData.endDate;
            let chkItem: CheckItem;
            let endDate: Date = null;
            this.lstHourScheds = [];

            this._form.Items.forEach((chkFrmItm: CheckFormItem) => {
                if (chkFrmItm.Schedule) {
                    chkItem = this._allCheckItems.find((chkItm: CheckItem) => chkItm.ID === chkFrmItm.CheckItemID);
                    endDate = new Date(chkFrmItm.Schedule.getFullYear(), chkFrmItm.Schedule.getMonth(), chkFrmItm.Schedule.getDate(), chkFrmItm.Schedule.getHours());
                    endDate.setHours(endDate.getHours() + 1);

                    if (chkFrmItm.Schedule.getTime() === apptStart.getTime() && endDate.getTime() === apptEnd.getTime()) {
                        this.lstHourScheds.push({
                            chkItemID: chkFrmItm.CheckItemID,
                            text: chkItem.Name,
                            ordinal: chkFrmItm.DisplayIndex,
                            icon: 'fa fa-home',
                            color: null
                        });
                    }
                }
            });

            if (this.lstHourScheds.length > 0) {
                ServiceHelper.sortArray(this.lstHourScheds, 'ordinal');
            }

            this.isPopupVisible = true;
        }
    }

    cellClicked(event: any) {
        event.cancel = true;

        this.currAppoint = new DatSchedule();
        this.currAppoint.startDate = event.cellData.startDate;
        this.currAppoint.endDate = event.cellData.endDate;
        this.lstHourScheds = [];
        this.isPopupVisible = true;
    }

    appontStartChanged(event) {
        const oldStartDate: Date = event.previousValue;
        const oldEndDate: Date = new Date(oldStartDate.getFullYear(), oldStartDate.getMonth(), oldStartDate.getDate(), oldStartDate.getHours());
        oldEndDate.setHours(oldEndDate.getHours() + 1);

        const newStartDate: Date = event.value;
        const newEndDate: Date = new Date(oldStartDate.getFullYear(), oldStartDate.getMonth(), oldStartDate.getDate(), oldStartDate.getHours());
        newEndDate.setHours(oldEndDate.getHours() + 1);

        let chkItem: CheckItem;
        let endDate: Date = null;

        this._form.Items.forEach((chkFrmItm: CheckFormItem) => {
            if (chkFrmItm.Schedule) {
                chkItem = this._allCheckItems.find((chkItm: CheckItem) => chkItm.ID === chkFrmItm.CheckItemID);
                endDate = new Date(chkFrmItm.Schedule.getFullYear(), chkFrmItm.Schedule.getMonth(), chkFrmItm.Schedule.getDate(), chkFrmItm.Schedule.getHours());
                endDate.setHours(endDate.getHours() + 1);

                if (chkFrmItm.Schedule.getTime() === oldStartDate.getTime() && endDate.getTime() === oldEndDate.getTime()) {
                    chkFrmItm.Schedule = newStartDate;
                    chkFrmItm.RowState = DataRowStates.MODIFIED;
                }
            }
        });

        this.loadShchduledItems();
        this.onDirtify();
    }

    ordinalChanged(event) {
        const self = this;
        const newIndex: number = event.toIndex;
        const oldIndex: number = event.fromIndex;
        let chkFormItm: CheckFormItem = null;
        let datSched: DatSchedule = null;

        // First . .  Isolate the mobed object within 3 relevant Lists
        // ----------------------------------------------------------
        const currChkFrmItem = self._form.Items.find((frmItm: CheckFormItem) =>
            frmItm.Schedule &&
            self.currAppoint.startDate.getTime() === frmItm.Schedule.getTime() &&
            oldIndex === frmItm.DisplayIndex);


        const currDatSched = self.schedules.find((sched: DatSchedule) =>
            self.currAppoint.startDate.getTime() === sched.startDate.getTime() &&
            oldIndex === sched.ordinal);

        const currDatChkItem = self.lstHourScheds[oldIndex];

        const str = self.lstHourScheds;

        // // Second . .  Update Indexies in all Other items within 3 relevant Lists
        // // -------------------------------------------------------------------------
        if (newIndex < oldIndex) {
            for (let i: number = oldIndex - 1; i >= newIndex; i--) {
                self.lstHourScheds[i].ordinal = i + 1;

                chkFormItm = self._form.Items.find((frmItm: CheckFormItem) =>
                    frmItm.Schedule &&
                    self.currAppoint.startDate.getTime() === frmItm.Schedule.getTime() &&
                    i === frmItm.DisplayIndex);

                chkFormItm.DisplayIndex = i + 1;
                if (chkFormItm.RowState !== DataRowStates.ADDED) {
                    chkFormItm.RowState = DataRowStates.MODIFIED;
                }

                datSched = self.schedules.find((sched: DatSchedule) =>
                    self.currAppoint.startDate.getTime() === sched.startDate.getTime() &&
                    i === sched.ordinal);

                datSched.ordinal = i + 1;
            }
        } else {
            for (let i: number = oldIndex + 1; i <= newIndex; i++) {
                self.lstHourScheds[i].ordinal = i - 1;

                chkFormItm = self._form.Items.find((frmItm: CheckFormItem) =>
                    frmItm.Schedule &&
                    self.currAppoint.startDate.getTime() === frmItm.Schedule.getTime() &&
                    i === frmItm.DisplayIndex);

                chkFormItm.DisplayIndex = i - 1;
                if (chkFormItm.RowState !== DataRowStates.ADDED) {
                    chkFormItm.RowState = DataRowStates.MODIFIED;
                }

                datSched = self.schedules.find((sched: DatSchedule) =>
                    self.currAppoint.startDate.getTime() === sched.startDate.getTime() &&
                    i === sched.ordinal);

                datSched.ordinal = i - 1;
            }
        }

        currDatSched.ordinal = newIndex;
        currDatChkItem.ordinal = newIndex;
        currChkFrmItem.DisplayIndex = newIndex;
        if (currChkFrmItem.RowState !== DataRowStates.ADDED) {
            currChkFrmItem.RowState = DataRowStates.MODIFIED;
        }

        self.schedules = ServiceHelper.sortArray(self.schedules, 'startDate', 'ordinal');
        self.onDirtify();
    }


    refreshAppotPopup(event) {
        // this.loadShchduledItems();
    }

    lstResDisposing(event) {
        off(event.target, 'drop', this.lstResourcesDropHandler);
    }

    lstSchdDisposing(event) {
        off(event.target, 'drop', this.lstSchedsDropHandler);
    }

    // getDataObj(objData) {
    //     for (let i = 0; i < this.schedules.length; i++) {
    //         if (this.schedules[i].startDate.getTime() === objData.startDate.getTime() && this.schedules[i].chkItemID === objData.chkItemID) {
    //             return this.schedules[i];
    //         }
    //     }
    //     return null;
    // }

    // getCheckItmByID(id): DatCheckItem {
    //     return Query(this.resources).filter(['id', '=', id]).toArray()[0];
    // }

    // editDetails(showtime) {
    //     this.scheduler.instance.showAppointmentPopup(this.getDataObj(showtime), false);
    // }



    // CONTEXT MENU
    // ----------------------------------------------------------

    // setResource(itemData) {
    //     const data = Object.assign({}, this.contextMenuAppointmentData, {
    //         chkItemID: [itemData.id]
    //     });

    //     this.scheduler.instance.updateAppointment(this.contextMenuAppointmentData, data);
    // }

    // createAppointment() {
    //     this.scheduler.instance.showAppointmentPopup({
    //         startDate: this.contextMenuCellData.startDate
    //     }, true);
    // }

    // createRecurringAppointment() {
    //     this.scheduler.instance.showAppointmentPopup({
    //         startDate: this.contextMenuCellData.startDate,
    //         recurrenceRule: 'FREQ=DAILY'
    //     }, true);
    // }

    // groupCell() {
    //     if (this.groups && this.groups.length) {
    //         this.crossScrollingEnabled = false;
    //         this.groups = [];
    //     } else {
    //         this.groups = ['chkItemID'];
    //         this.crossScrollingEnabled = true;
    //     }
    // }

    // showCurrentDate() {
    //     this.currentDate = new Date();
    // }

    // showAppointment() {
    //     this.scheduler.instance.showAppointmentPopup(this.contextMenuAppointmentData);
    // }

    //  deleteAppointment() {
    //     this.scheduler.instance.deleteAppointment(this.contextMenuAppointmentData);
    // }

    // repeatAppointmentWeekly() {
    //     const updatedData = Object.assign({}, this.contextMenuAppointmentData, {
    //         startDate: this.contextMenuTargetedAppointmentData.startDate,
    //         recurrenceRule: 'FREQ=WEEKLY'
    //     });

    //     this.scheduler.instance.updateAppointment(this.contextMenuAppointmentData, updatedData);
    // }

    // onContextMenuItemClick(event) {
    //     event.itemData.onItemClick(event.itemData);
    // }

    // onAppointmentContextMenu(event) {
    //     this.contextMenuAppointmentData = event.appointmentData;
    //     this.contextMenuTargetedAppointmentData = event.targetedAppointmentData;
    // }

    // onCellContextMenu(event) {
    //     this.contextMenuCellData = event.cellData;
    // }









    // Event Handlers for Non-Scheduled CheckItems
    // --------------------------------
    deleteFormItm(event, chkFormItem: CheckFormItem) {
        if (chkFormItem.RowState === DataRowStates.ADDED) {
            const indx = this._form.Items.findIndex((frmItem: CheckFormItem) => frmItem.ID === chkFormItem.ID);
            this._form.Items.splice(indx, 1);

            this.formNonSchedItems = [];
            this._form.Items.forEach((chkFrmItm: CheckFormItem) => {
                if (!chkFrmItm.Schedule) {
                    this.formNonSchedItems.push(chkFrmItm);
                }
            });

            this.formNonSchedItems = ServiceHelper.sortArray(this.formNonSchedItems, 'DisplayIndex');
        } else {
            chkFormItem.RowState = DataRowStates.DELETED;
            chkFormItem.DisplayIndex = -1;

            const indx = this.formNonSchedItems.findIndex((frmItem: CheckFormItem) => frmItem.ID === chkFormItem.ID);
            if (indx > -1) {
                this.formNonSchedItems.splice(indx, 1);
                this.loadFormItemsElements();
            }

            const indx2 = this._form.Items.findIndex((frmItem: CheckFormItem) => chkFormItem.ID === frmItem.ID);
            if (indx2 > -1 && indx2 < this._form.Items.length - 1) {
                let currFrmItem: CheckFormItem = null;
                for (let i = indx2 + 1; i < this._form.Items.length; i++) {
                    currFrmItem = this._form.Items[i];
                    if (!currFrmItem.Schedule) {
                        currFrmItem.DisplayIndex--;
                        currFrmItem.RowState = DataRowStates.MODIFIED;
                    }
                }
            }
        }

        this.onDirtify();
    }

    nonSchedItemDragStart(event, chkItem: CheckItem) {
        this.resDraggedItem = chkItem;
    }

    nonSchedItemDragEnd(event) {
        this.resDraggedItem = null;
    }

    nonSchedDropItem(event) {
        if (this.resDraggedItem) {
            const dragItmIndx = this.findIndex(this.resDraggedItem);

            if (!this._form.Items) {
                this._form.Items = [];
            }

            this._form.Items.push({
                ID: 0,
                CheckFormID: this._form.ID,
                CheckItemID: this.resDraggedItem.ID,
                Schedule: null,
                DisplayIndex: this._form.Items.length,
                RowState: DataRowStates.ADDED
            });

            this.formNonSchedItems = [];
            this.filterFormChkItems();
            this.loadFormItemsElements();
            this.resDraggedItem = null;
            this.onDirtify();
        }
    }










    // Private 'Helper' Methods
    // ---------------------------------
    private filterFormChkItems() {
        this._form.Items.forEach((chkFrmItm: CheckFormItem) => {
            if (chkFrmItm.Schedule) {
                this.formSchedItems.push(chkFrmItm);
            } else {
                this.formNonSchedItems.push(chkFrmItm);
            }
        });

        this.formNonSchedItems = ServiceHelper.sortArray(this.formNonSchedItems, 'DisplayIndex');
    }


    private loadItemsElements() {
        if (!(this._allCheckItems && this._allCheckItems.length > 0)) {
            return;
        }

        this._allCheckItemElmnt = new Array<SelectItem>();
        this.resources = new Array<DatCheckItem>();

        let count = 0;
        this._allCheckItems.forEach((itm: CheckItem) => {
            if (count > 4) {
                count = 0;
            }

            this._allCheckItemElmnt.push({ label: itm.Name, value: itm });
            this.resources.push({
                id: itm.ID,
                text: itm.Name,
                icon: 'fa fa-home',
                color: this.colors[count++]
            });
        });


        if (this._allCheckItemElmnt && this._allCheckItemElmnt.length > 0) {
            this._allCheckItemElmnt = ServiceHelper.sortArray(this._allCheckItemElmnt, 'label');
        }

        const self = this;
        this.resourcesMenuItems = [];

        // CONTEXT MENU
        // ----------------------------------------------------------
        // this.resources.forEach((resource: DatCheckItem) => {
        //     const menuItem: DatMenuItem = {
        //         text: resource.text,
        //         id: resource.id,
        //         color: resource.color,
        //         onItemClick: self.setResource.bind(self)
        //     };

        //     self.resourcesMenuItems.push(menuItem);
        // });

        // this.allContextMenuItems = [...this.appointmentContextMenuItems, ...this.resourcesMenuItems];

        // ----------------------------------------------------------
    }


    private loadFormItemsElements() {
        if (!(this.formNonSchedItems && this.formNonSchedItems.length > 0)) {
            return;
        }

        if (!(this._allCheckItems && this._allCheckItems.length > 0)) {
            return;
        }

        let name: string = null;
        this._formNonSchedElmnts = new Array<SelectItem>();
        this.formNonSchedItems.forEach((chkItm: CheckFormItem) => {
            name = this._allCheckItems.find((itm: CheckItem) => chkItm.CheckItemID === itm.ID).Name;
            this._formNonSchedElmnts.push({ label: name, value: chkItm });
        });
    }


    private findIndex(chkItem: CheckItem) {
        let index = -1;
        for (let i = 0; i < this._allCheckItems.length; i++) {
            if (chkItem.ID === this._allCheckItems[i].ID) {
                index = i;
                break;
            }
        }
        return index;
    }


    private loadShchduledItems() {
        if (!this._form.Scheduled) {
            return;
        }

        if (!(this.formSchedItems && this.formSchedItems.length > 0)) {
            return;
        }

        if (!(this._allCheckItems && this._allCheckItems.length > 0)) {
            return;
        }

        this.schedules = [];
        let schedData: Array<DatSchedule> = [];
        let chkItem: CheckItem = null;
        let endDate: Date = null;
        let maxDate: Date = new Date(1900, 1, 1);

        this.formSchedItems.forEach((chkFrmItm: CheckFormItem) => {
            if (chkFrmItm.Schedule) {
                chkItem = this._allCheckItems.find((chkItm: CheckItem) => chkItm.ID === chkFrmItm.CheckItemID);
                endDate = new Date(chkFrmItm.Schedule.getFullYear(), chkFrmItm.Schedule.getMonth(), chkFrmItm.Schedule.getDate(), chkFrmItm.Schedule.getHours());
                endDate.setHours(endDate.getHours() + 1);

                schedData.push({
                    id: chkFrmItm.ID,
                    text: chkItem.Name,
                    chkItemID: chkFrmItm.CheckItemID,
                    ordinal: chkFrmItm.DisplayIndex,
                    startDate: chkFrmItm.Schedule,
                    endDate: endDate,
                    data: chkFrmItm
                });

                if (chkFrmItm.Schedule > maxDate) {
                    maxDate = chkFrmItm.Schedule;
                }
            }
        });

        schedData = ServiceHelper.sortArray(schedData, 'startDate', 'ordinal');
        this.currentDate = maxDate;
        this.schedules = schedData;
    }
}





export class DatMenuItem {
    text: string;
    id: number;
    color: string;
    onItemClick: any;
}

// Resource
export class DatCheckItem {
    id: number;
    text: string;
    icon?: string;
    color?: string;
}

export class DatFormCheckItem {
    chkItemID: number;
    text: string;
    ordinal: number;
    icon?: string;
    color?: string;
}

export class DatSchedule {
    id: number;
    text: string;
    chkItemID: number;
    ordinal: number;
    startDate: Date;
    endDate: Date;
    data?: any;
}
