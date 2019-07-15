import { CheckForm } from './../../../shared/types/checkForm';
import { Component, Input } from '@angular/core';
import { BaseConfigItem } from '../../base-config-widget/base-config-item';
import { Device } from '../../../shared/types/device';
import { LogService } from '../../../shared/services/log.service';
import { User } from '../../../shared/types/user';
import { CommonService } from '../../../shared/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';








@Component({
    selector: 'config-intellichecks',
    templateUrl: './config-intellichecks.component.html',
    styleUrls: ['./config-intellichecks.component.scss']
})
export class ConfigIntelliChecksComponent extends BaseConfigItem {

    private _device: Device;
    private _checkForms: Array<CheckForm>;
    private _users: Array<User>;
    loading: boolean;

    formCols = [
        { field: 'Icon', header: '', sortable: false },
        { field: 'Name', header: 'Form Name', sortable: true },
        { field: 'Scheduled', header: 'Scheduled', sortable: true },
        { field: 'Description', header: 'Description', sortable: true }
    ];

    userCols = [
        { field: 'Icon', header: '', sortable: false },
        { field: 'UserName', header: 'User Name', sortable: true },
        { field: 'FirstName', header: 'First Name', sortable: true },
        { field: 'LastName', header: 'Last Name', sortable: true },
        { field: 'UserTypeName', header: 'Type', sortable: true }
    ];








    constructor(logger: LogService,
        translate: TranslateService,
        common: CommonService,
        msgService: MessageService) {
        super(logger, common, translate, msgService);
    }









    // Properties
    // -------------------------------------------
    @Input()
    set device(device: Device) {
        this._device = device;
        if (this._device) {
            this.setSelForms();
            this.setSelUsers();
        }
    }

    get device(): Device {
        return this._device;
    }


    @Input()
    set checkForms(forms: Array<CheckForm>) {
        this._checkForms = forms;
        if (this._checkForms) {
            this.setSelForms();
        }
    }

    get checkForms(): Array<CheckForm> {
        return this._checkForms;
    }


    @Input()
    set allowedUsers(users: Array<User>) {
        this._users = users;
        if (this._users) {
            this.setSelUsers();
        }
    }

    get allowedUsers(): Array<User> {
        return this._users;
    }









    // Event Handlers
    // ------------------------------
    formSyncChanged(selected: boolean, form: CheckForm) {
        if (selected) {
            this._device.CheckForms.push(form);
        } else {
            const indx: number = this._device.CheckForms.findIndex((frm: CheckForm) => frm.ID === form.ID);
            if (indx >= 0) {
                this._device.CheckForms.splice(indx, 1);
            }
        }

        this.onDirtify();
    }

    userSyncChanged(selected: boolean, user: User) {
        if (selected) {
            this._device.Users.push(user);
        } else {
            const indx: number = this._device.Users.findIndex((usr: User) => usr.ID === user.ID);
            if (indx >= 0) {
                this._device.Users.splice(indx, 1);
            }
        }

        this.onDirtify();
    }






    // Private "helper" Methods
    // ------------------------------
    private setSelForms() {
        if (!(this._device &&
            this._checkForms && this._checkForms.length > 0 &&
            this._device.CheckForms && this._device.CheckForms.length > 0)) {
            return;
        }

        let currForm: CheckForm = null;
        this._checkForms.forEach((chkFrm: CheckForm) => {
            currForm = this._device.CheckForms.find((form: CheckForm) => form.ID === chkFrm.ID);
            if (currForm) {
                chkFrm.Sync = true;
            } else {
                chkFrm.Sync = false;
            }
        });
    }


    private setSelUsers() {
        if (!(this._users && this._users.length > 0 &&
            this._device && this._device.Users && this._device.Users.length > 0)) {
            return;
        }

        let currUser: User = null;
        this._users.forEach((user: User) => {
            user.UserTypeName = this.Common.getUserType(user.UserTypeID).Name;
            currUser = this._device.Users.find((usr: User) => usr.ID === user.ID);
            if (currUser) {
                user.Sync = true;
            } else {
                user.Sync = false;
            }
        });
    }

}
