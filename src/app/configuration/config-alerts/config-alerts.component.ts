import { LogService } from './../../shared/services/log.service';
import { DataService } from './../../shared/services/data.service';
import { BaseConfigWidgetComponent } from './../base-config-widget/base-config-widget.component';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { SelectItem, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../shared/services/common.service';
import { AlertType } from '../../shared/types/alertType';
import { UserAlert } from '../../shared/types/userAlert';
import { LocationContactAlert } from '../../shared/types/locationContactAlert';
import { LocationContact } from '../../shared/types/locationContact';
import { User } from '../../shared/types/user';
import { TopologyService } from '../../shared/services/topology.service';
import { RouteService } from '../../shared/services/route.service';
import { ConfigurationComponent } from '../configuration.component';
import { DataRowStates } from '../../shared/data/enums/data-row-state.enum';
import { ServiceHelper } from '../../shared/services/serviceHelper';
import { Location } from '../../shared/types/location';
import { Asset } from '../../shared/types/asset';
import { ObjectTypes } from '../../shared/data/constants/objectTypes';
import { AssetMeasure } from '../../shared/types/assetMeasure';
import { AuthService } from '../../shared/services/auth.service';




@Component({
    selector: 'app-config-alerts',
    templateUrl: './config-alerts.component.html',
    styleUrls: ['./config-alerts.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfigAlertsComponent extends BaseConfigWidgetComponent {

    private _location: Location;
    currUserAlrt: UserAlert;
    dirtyUserAlerts: Array<UserAlert>;
    userAlerts: Array<UserAlert>;

    currContctAlrt: LocationContactAlert;
    dirtyContctAlerts: Array<LocationContactAlert>;
    contctAlerts: Array<LocationContactAlert>;

    alertTypes: Array<AlertType>;
    inheritedAlertTypes: Array<AlertType>;
    locAlertTypes: Array<AlertType>;

    contacts: Array<LocationContact>;
    inheritedContacts: Array<LocationContact>;
    locContacts: Array<LocationContact>;

    allowedUsers: Array<User>;
    inheritedAllowedUsers: Array<User>;
    locAllowedUsers: Array<User>;


    optUsers: Array<SelectItem>;
    optContcts: Array<SelectItem>;
    optAssets: Array<SelectItem>;
    optAsms: Array<SelectItem>;
    optAlrtTypes: Array<SelectItem>;

    selUser: User;
    selUAAsset: Asset;
    selUAAsm: AssetMeasure;
    selUAAlrtType: AlertType;
    selContact: LocationContact;
    selCAAsset: Asset;
    selCAAsm: AssetMeasure;
    selCAAlrtType: AlertType;




    userCols = [
        { field: 'icon', header: '' },
        { field: 'UserName', header: 'User' },
        { field: 'asset', header: 'Asset' },
        { field: 'asm', header: 'Asset Measure' },
        { field: 'alertType', header: 'Alert Type' }
    ];

    contactCols = [
        { field: 'icon', header: '' },
        { field: 'ContactName', header: 'Contact' },
        { field: 'asset', header: 'Asset' },
        { field: 'asm', header: 'Asset Measure' },
        { field: 'alertType', header: 'Alert Type' }
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
    }








    getData() {
        this.loading = true;
        this.Logger.info(`Getting data for widget locations config devices - LocationId: ${this.locationID}`);
        super.getData();

        this._location = this.Topology.getCachedLocation(this.locationID);

        this.getDataSubscrp = this.Data.getLocationData(this.locationID,
            ['alertTypes',
                'inheritedAlertTypes',
                'userAlerts',
                'contactAlerts',
                'contacts',
                'inheritedContacts',
                'inheritedAllowedUsers',
                'allowedUsers'])
            .subscribe(
                res => {
                    this.alertTypes = res['alertTypes'];
                    this.inheritedAlertTypes = res['inheritedAlertTypes'];
                    this.userAlerts = res['userAlerts'];
                    this.contctAlerts = res['contactAlerts'];
                    this.contacts = res['contacts'];
                    this.inheritedContacts = res['inheritedContacts'];
                    this.inheritedAllowedUsers = res['inheritedAllowedUsers'];
                    this.allowedUsers = res['allowedUsers'];

                    this.loadAssetOpts();
                    this.loadAlertTypes();
                    this.loadAlowdUsers();
                    this.loadAlowdContct();
                    this.setUserNames();
                    this.setContactNames();

                    this.Config.unDirtifyTab();
                    this.isDirty = false;
                    this.loading = false;
                },
                err => {
                    this.Logger.error(`error in config location forms ${err}`);
                    this.loading = false;
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }



    saveData() {
        this.loading = true;
        this.Logger.info(`Saving data for widget locations config devices - LocationId: ${this.locationID}`);
        super.saveData();


        // Find Dirty UserAlerts
        // ----------------------
        this.dirtyUserAlerts = [];
        this.userAlerts.forEach((usrAlert: UserAlert) => {
            if (usrAlert.RowState !== DataRowStates.UNCHANGED) {
                this.dirtyUserAlerts.push(usrAlert);
            }
        });


        // Find Dirty ContactAlerts
        // ----------------------
        this.dirtyContctAlerts = [];
        this.contctAlerts.forEach((contctAlert: LocationContactAlert) => {
            if (contctAlert.RowState !== DataRowStates.UNCHANGED) {
                this.dirtyContctAlerts.push(contctAlert);
            }
        });


        if (this.dirtyUserAlerts.length > 0 || this.dirtyContctAlerts.length > 0) {
            this.saveDataSubscrp = this.Data.saveLocationAlerts(this.locationID, this.dirtyUserAlerts, this.dirtyContctAlerts)
                .subscribe(
                    res => {
                        let uaIndx = -1;
                        let caIndx = -1;

                        this.Logger.info('Location Alerts were updated to the ECS Server. Location ID: ' + this.locationID);
                        const usrAlerts = res[0];
                        const contAlerts = res[1];

                        if (usrAlerts && usrAlerts.length > 0) {
                            usrAlerts.forEach((usrAlert: UserAlert) => {
                                uaIndx = this.userAlerts.findIndex((alrt: UserAlert) => usrAlert.ID === alrt.ID);
                                if (uaIndx >= 0) {
                                    this.userAlerts[uaIndx] = usrAlert;
                                }
                            });

                            if (this.dirtyUserAlerts.length !== usrAlerts.length) {
                                this.dirtyUserAlerts.forEach((usrAlert: UserAlert) => {
                                    if (usrAlert.RowState === DataRowStates.DELETED) {
                                        const indx = this.userAlerts.findIndex((alrt: UserAlert) => alrt.ID === usrAlert.ID);
                                        if (indx >= 0) {
                                            this.userAlerts.splice(indx, 1);
                                        }
                                    }
                                });
                            }
                        }

                        if (contAlerts && contAlerts.length > 0) {
                            contAlerts.forEach((contcAlrt: LocationContactAlert) => {
                                caIndx = this.contctAlerts.findIndex((alrt: LocationContactAlert) => contcAlrt.ID === alrt.ID);
                                if (uaIndx >= 0) {
                                    this.contctAlerts[caIndx] = contcAlrt;
                                }
                            });

                            if (this.dirtyContctAlerts.length !== contAlerts.length) {
                                this.dirtyContctAlerts.forEach((contctAlert: LocationContactAlert) => {
                                    if (contctAlert.RowState === DataRowStates.DELETED) {
                                        const indx = this.contctAlerts.findIndex((alrt: LocationContactAlert) => alrt.ID === contctAlert.ID);
                                        if (indx >= 0) {
                                            this.contctAlerts.splice(indx, 1);
                                        }
                                    }
                                });
                            }
                        }

                        this.dirtyUserAlerts = null;
                        this.dirtyContctAlerts = null;

                        this.loadAssetOpts();
                        this.loadAlertTypes();
                        this.loadAlowdUsers();
                        this.loadAlowdContct();
                        this.setUserNames();
                        this.setContactNames();

                        this.Config.unDirtifyTab();
                        this.isDirty = false;
                        this.loading = false;
                    },
                    err => {
                        this.Logger.error(`error in saving location check forms ${err}`);
                        this.loading = false;
                    },
                    () => {
                        this.saveDataSubscrp.unsubscribe();

                        this.loading = false;
                        this.Config.unDirtifyTab();
                        this.isDirty = false;
                        this.MsgService.add({
                            severity: 'success',
                            summary: 'Location Alerts Update',
                            detail: 'Updating Location Alerts was successful'
                        });
                    }
                );
        }
    }









    // Public "Helper" operations
    // ------------------------------------------
    getUserAlrtAsset(rowData: UserAlert): string {
        switch (rowData.ObjectTypeID) {
            case ObjectTypes.LOCATION: {
                return '(ALL)';
            }

            case ObjectTypes.ASSET: {
                let astName: string = null;
                if (this._location.Assets && this._location.Assets.length > 0) {
                    astName = this._location.Assets.find((ast: Asset) => ast.ID === rowData.ObjectID).Name;
                }
                return astName;
            }

            case ObjectTypes.ASSET_MEASURE: {
                let astName: string = null;
                if (this._location.Assets && this._location.Assets.length > 0) {
                    this._location.Assets.forEach((ast: Asset) => {
                        if (ast.Measures && ast.Measures.length > 0) {
                            ast.Measures.forEach((asm: AssetMeasure) => {
                                if (asm.ID === rowData.ObjectID) {
                                    astName = ast.Name;
                                }
                            });
                        }
                    });
                }
                return astName;
            }

            default:
                {
                    return null;
                }
        }
    }

    getUserAlrtAsm(rowData: UserAlert): string {
        switch (rowData.ObjectTypeID) {
            case ObjectTypes.LOCATION:
            case ObjectTypes.ASSET: {
                return '(ALL)';
            }

            case ObjectTypes.ASSET_MEASURE: {
                let asmName: string = null;
                if (this._location.Assets && this._location.Assets.length > 0) {
                    this._location.Assets.forEach((ast: Asset) => {
                        if (ast.Measures && ast.Measures.length > 0) {
                            asmName = ast.Measures.find((asm: AssetMeasure) => asm.ID === rowData.ObjectID).Name;
                        }
                    });
                }
                return asmName;
            }

            default:
                {
                    return null;
                }
        }
    }

    getUserAlrtType(rowData: UserAlert): string {
        if (this.locAlertTypes && this.locAlertTypes.length > 0) {
            return this.locAlertTypes.find((alrtType: AlertType) => alrtType.ID === rowData.AlertTypeID).Name;
        }
        return null;
    }



    getContctAlrtAsset(rowData: LocationContactAlert) {
        switch (rowData.ObjectTypeID) {
            case ObjectTypes.LOCATION: {
                return '(ALL)';
            }

            case ObjectTypes.ASSET: {
                let astName: string = null;
                if (this._location.Assets && this._location.Assets.length > 0) {
                    astName = this._location.Assets.find((ast: Asset) => ast.ID === rowData.ObjectID).Name;
                }
                return astName;
            }

            case ObjectTypes.ASSET_MEASURE: {
                let astName: string = null;
                if (this._location.Assets && this._location.Assets.length > 0) {
                    this._location.Assets.forEach((ast: Asset) => {
                        if (ast.Measures && ast.Measures.length > 0) {
                            ast.Measures.forEach((asm: AssetMeasure) => {
                                if (asm.ID === rowData.ObjectID) {
                                    astName = ast.Name;
                                }
                            });
                        }
                    });
                }
                return astName;
            }

            default:
                {
                    return null;
                }
        }
    }

    getContctAlrtAsm(rowData: LocationContactAlert) {
        switch (rowData.ObjectTypeID) {
            case ObjectTypes.LOCATION:
            case ObjectTypes.ASSET: {
                return '(ALL)';
            }

            case ObjectTypes.ASSET_MEASURE: {
                let asmName: string = null;
                if (this._location.Assets && this._location.Assets.length > 0) {
                    this._location.Assets.forEach((ast: Asset) => {
                        if (ast.Measures && ast.Measures.length > 0) {
                            const astmeasure = ast.Measures.find((asm: AssetMeasure) => asm.ID === rowData.ObjectID);
                            asmName = astmeasure ? astmeasure.Name : '';
                        }
                    });
                }
                return asmName;
            }

            default:
                {
                    return null;
                }
        }
    }

    getContctAlrtType(rowData: LocationContactAlert) {
        if (this.locAlertTypes && this.locAlertTypes.length > 0) {
            return this.locAlertTypes.find((alrtType: AlertType) => alrtType.ID === rowData.AlertTypeID).Name;
        }
        return null;
    }









    // Event Handlers
    // --------------------------------
    userAlertSelected(event) {
        this.ECSObject = this.currUserAlrt;

        const indx = this.optUsers.findIndex((elmnt: SelectItem) => elmnt.value.ID === this.currUserAlrt.UserID);
        this.selUser = this.optUsers[indx].value;
        const alrtIndx = this.optAlrtTypes.findIndex((elmnt: SelectItem) => elmnt.value && elmnt.value.ID === this.currUserAlrt.AlertTypeID);
        this.selUAAlrtType = this.optAlrtTypes[alrtIndx].value;

        this.afterUASelected();
    }

    userAlertUnSelected(event) {
        this.userAlerts.forEach((alert: UserAlert) => {
            alert.AlrtTypeEdit = false;
            alert.AsmEdit = false;
            alert.AstEdit = false;
            alert.UsrEdit = false;
        });

        this.ECSObject = this.currUserAlrt = null;
        this.selUser = null;
        this.selUAAsset = null;
        this.selUAAsm = null;
        this.selUAAlrtType = null;
    }

    setUsrEdit(event: MouseEvent, usrAlrt: UserAlert) {
        if (this.currUserAlrt && this.currUserAlrt.ID === usrAlrt.ID) {
            if (this.currUserAlrt.UsrEdit) {
                return;
            }
        } else {
            this.currUserAlrt = usrAlrt;
            this.userAlertSelected(null);
        }

        this.userAlerts.forEach((alert: UserAlert) => {
            alert.AlrtTypeEdit = false;
            alert.AsmEdit = false;
            alert.AstEdit = false;
            if (alert.ID === usrAlrt.ID) {
                if (alert.UsrEdit) {
                    return;
                }
                alert.UsrEdit = true;
            } else {
                alert.UsrEdit = false;
            }
        });

        event.cancelBubble = true;
        event.preventDefault();
    }

    setUAAstEdit(event: MouseEvent, usrAlrt: UserAlert) {
        if (this.currUserAlrt && this.currUserAlrt.ID === usrAlrt.ID) {
            if (this.currUserAlrt.AstEdit) {
                return;
            }
        } else {
            this.currUserAlrt = usrAlrt;
            this.userAlertSelected(null);
        }

        this.userAlerts.forEach((alert: UserAlert) => {
            alert.AlrtTypeEdit = false;
            alert.AsmEdit = false;
            alert.UsrEdit = false;
            if (alert.ID === usrAlrt.ID) {
                if (alert.AstEdit) {
                    return;
                }
                alert.AstEdit = true;
            } else {
                alert.AstEdit = false;
            }
        });

        event.cancelBubble = true;
        event.preventDefault();
    }

    setUAAsmEdit(event: MouseEvent, usrAlrt: UserAlert) {
        if (this.currUserAlrt && this.currUserAlrt.ID === usrAlrt.ID) {
            if (this.currUserAlrt.AsmEdit) {
                return;
            }
        } else {
            this.currUserAlrt = usrAlrt;
            this.userAlertSelected(null);
        }

        this.userAlerts.forEach((alert: UserAlert) => {
            alert.AlrtTypeEdit = false;
            alert.AstEdit = false;
            alert.UsrEdit = false;
            if (alert.ID === usrAlrt.ID) {
                if (alert.AsmEdit) {
                    return;
                }
                alert.AsmEdit = true;
            } else {
                alert.AsmEdit = false;
            }
        });

        event.cancelBubble = true;
        event.preventDefault();
    }

    setUAAlrtTypeEdit(event: MouseEvent, usrAlrt: UserAlert) {
        if (this.currUserAlrt && this.currUserAlrt.ID === usrAlrt.ID) {
            if (this.currUserAlrt.AlrtTypeEdit) {
                return;
            }
        } else {
            this.currUserAlrt = usrAlrt;
            this.userAlertSelected(null);
        }

        this.userAlerts.forEach((alert: UserAlert) => {
            alert.AstEdit = false;
            alert.AsmEdit = false;
            alert.UsrEdit = false;
            if (alert.ID === usrAlrt.ID) {
                if (alert.AlrtTypeEdit) {
                    return;
                }
                alert.AlrtTypeEdit = true;
            } else {
                alert.AlrtTypeEdit = false;
            }
        });

        event.cancelBubble = true;
        event.preventDefault();
    }




    contactAlertSelected(event) {
        this.ECSObject = this.currContctAlrt;

        const indx = this.optContcts.findIndex((elmnt: SelectItem) => elmnt.value.ID === this.currContctAlrt.LocationContactID);
        this.selContact = this.optContcts[indx].value;
        const alrtIndx = this.optAlrtTypes.findIndex((elmnt: SelectItem) => elmnt.value && elmnt.value.ID === this.currContctAlrt.AlertTypeID);
        this.selCAAlrtType = this.optAlrtTypes[alrtIndx].value;

        this.afterCASelected();
    }

    contactAlertUnSelected(event) {
        this.contctAlerts.forEach((alert: LocationContactAlert) => {
            alert.AlrtTypeEdit = false;
            alert.AsmEdit = false;
            alert.AstEdit = false;
            alert.ContctEdit = false;
        });

        this.ECSObject = this.currContctAlrt = null;
        this.selContact = null;
        this.selCAAsset = null;
        this.selCAAsm = null;
        this.selCAAlrtType = null;
    }

    setContctEdit(event: MouseEvent, contctAlrt: LocationContactAlert) {
        if (this.currContctAlrt && this.currContctAlrt.ID === contctAlrt.ID) {
            if (this.currContctAlrt.ContctEdit) {
                return;
            }
        } else {
            this.currContctAlrt = contctAlrt;
            this.contactAlertSelected(null);
        }

        this.contctAlerts.forEach((alert: LocationContactAlert) => {
            alert.AlrtTypeEdit = false;
            alert.AsmEdit = false;
            alert.AstEdit = false;
            if (alert.ID === contctAlrt.ID) {
                if (alert.ContctEdit) {
                    return;
                }
                alert.ContctEdit = true;
            } else {
                alert.ContctEdit = false;
            }
        });

        event.cancelBubble = true;
        event.preventDefault();
    }

    setCAAstEdit(event: MouseEvent, contctAlrt: LocationContactAlert) {
        if (this.currContctAlrt && this.currContctAlrt.ID === contctAlrt.ID) {
            if (this.currContctAlrt.AstEdit) {
                return;
            }
        } else {
            this.currContctAlrt = contctAlrt;
            this.contactAlertSelected(null);
        }

        this.contctAlerts.forEach((alert: LocationContactAlert) => {
            alert.AlrtTypeEdit = false;
            alert.AsmEdit = false;
            alert.ContctEdit = false;
            if (alert.ID === contctAlrt.ID) {
                if (alert.AstEdit) {
                    return;
                }
                alert.AstEdit = true;
            } else {
                alert.AstEdit = false;
            }
        });

        event.cancelBubble = true;
        event.preventDefault();
    }

    setCAAsmEdit(event: MouseEvent, contctAlrt: LocationContactAlert) {
        if (this.currContctAlrt && this.currContctAlrt.ID === contctAlrt.ID) {
            if (this.currContctAlrt.AsmEdit) {
                return;
            }
        } else {
            this.currContctAlrt = contctAlrt;
            this.contactAlertSelected(null);
        }

        this.contctAlerts.forEach((alert: LocationContactAlert) => {
            alert.AlrtTypeEdit = false;
            alert.AstEdit = false;
            alert.ContctEdit = false;
            if (alert.ID === contctAlrt.ID) {
                if (alert.AsmEdit) {
                    return;
                }
                alert.AsmEdit = true;
            } else {
                alert.AsmEdit = false;
            }
        });

        event.cancelBubble = true;
        event.preventDefault();
    }

    setCAAlrtTypeEdit(event: MouseEvent, contctAlrt: LocationContactAlert) {
        if (this.currContctAlrt && this.currContctAlrt.ID === contctAlrt.ID) {
            if (this.currContctAlrt.AlrtTypeEdit) {
                return;
            }
        } else {
            this.currContctAlrt = contctAlrt;
            this.contactAlertSelected(null);
        }

        this.contctAlerts.forEach((alert: LocationContactAlert) => {
            alert.AstEdit = false;
            alert.AsmEdit = false;
            alert.ContctEdit = false;
            if (alert.ID === contctAlrt.ID) {
                if (alert.AlrtTypeEdit) {
                    return;
                }
                alert.AlrtTypeEdit = true;
            } else {
                alert.AlrtTypeEdit = false;
            }
        });

        event.cancelBubble = true;
        event.preventDefault();
    }




    userComboChanged(event, usrAlrt: UserAlert) {
        usrAlrt.UserID = this.selUser.ID;
        usrAlrt.UserName = this.locAllowedUsers.find((user: User) => user.ID === usrAlrt.UserID).UserName;
        this.dirtifyItem();
    }

    uaAstComboChanged(event, usrAlrt: UserAlert) {
        if (!this.selUAAsset) {
            usrAlrt.ObjectTypeID = ObjectTypes.LOCATION;
            usrAlrt.ObjectID = this._location.ID;
        } else {
            usrAlrt.ObjectID = this.selUAAsset.ID;
            usrAlrt.ObjectTypeID = ObjectTypes.ASSET;

            this.loadAsmOpts(this.selUAAsset);
            this.selUAAsm = this.optAsms[0].value;
        }

        this.dirtifyItem();
    }

    uaAsmComboChanged(event, usrAlrt: UserAlert) {
        if (!this.selUAAsm) {
            usrAlrt.ObjectTypeID = ObjectTypes.ASSET;
            usrAlrt.ObjectID = this.selUAAsset.ID;
        } else {
            usrAlrt.ObjectID = this.selUAAsm.ID;
            usrAlrt.ObjectTypeID = ObjectTypes.ASSET_MEASURE;
        }

        this.dirtifyItem();
    }

    uaAlrtTypeComboChanged(event, usrAlrt: UserAlert) {
        usrAlrt.AlertTypeID = this.selUAAlrtType.ID;
        this.dirtifyItem();
    }




    contctComboChanged(event, contctAlert: LocationContactAlert) {
        contctAlert.LocationContactID = this.selContact.ID;
        contctAlert.ContactName = this.locContacts.find((contact: LocationContact) => contact.ID === contctAlert.LocationContactID).ContactName;
        this.dirtifyItem();
    }

    caAstComboChanged(event, contctAlert: LocationContactAlert) {
        if (!this.selCAAsset) {
            contctAlert.ObjectTypeID = ObjectTypes.LOCATION;
            contctAlert.ObjectID = this._location.ID;
        } else {
            contctAlert.ObjectID = this.selCAAsset.ID;
            contctAlert.ObjectTypeID = ObjectTypes.ASSET;

            this.loadAsmOpts(this.selCAAsset);
            this.selCAAsm = this.optAsms[0].value;
        }

        this.dirtifyItem();
    }

    caAsmComboChanged(event, contctAlert: LocationContactAlert) {
        if (!this.selCAAsm) {
            contctAlert.ObjectTypeID = ObjectTypes.ASSET;
            contctAlert.ObjectID = this.selCAAsset.ID;
        } else {
            contctAlert.ObjectID = this.selCAAsm.ID;
            contctAlert.ObjectTypeID = ObjectTypes.ASSET_MEASURE;
        }

        this.dirtifyItem();
    }

    caAlrtTypeComboChanged(event, contctAlert: LocationContactAlert) {
        contctAlert.AlertTypeID = this.selCAAlrtType.ID;
        this.dirtifyItem();
    }




    addUserAlert() {
        // if (!this.validateAdditionalItems(this.userAlerts)) {
        //     // checkItemName.setFocus();
        //     return;
        // }

        const newUserAlrt: UserAlert = new UserAlert();
        if (this.optUsers && this.optUsers.length > 0) {
            this.selUser = this.optUsers[0].value;
            newUserAlrt.UserID = this.selUser.ID;
        }

        if (this.optAlrtTypes && this.optAlrtTypes.length > 0) {
            this.selUAAlrtType = this.optAlrtTypes[0].value;
            newUserAlrt.AlertTypeID = this.selUAAlrtType.ID;
        }

        newUserAlrt.ObjectTypeID = ObjectTypes.LOCATION;
        newUserAlrt.ObjectID = this._location.ID;
        newUserAlrt.RowState = DataRowStates.ADDED;
        this.userAlerts.push(newUserAlrt);

        this.currUserAlrt = newUserAlrt;
        this.ECSObject = newUserAlrt;
        this.dirtifyItem();
    }

    addContct() {
        // if (!this.validateItems(this.contctAlerts)) {
        //     // checkItemName.setFocus();
        //     return;
        // }

        const newContctAlrt: LocationContactAlert = new LocationContactAlert();
        if (this.optContcts && this.optUsers.length > 0) {
            this.selContact = this.optContcts[0].value;
            newContctAlrt.LocationContactID = this.selContact.ID;
        }

        if (this.optAlrtTypes && this.optAlrtTypes.length > 0) {
            this.selCAAlrtType = this.optAlrtTypes[0].value;
            newContctAlrt.AlertTypeID = this.selCAAlrtType.ID;
        }

        newContctAlrt.ObjectTypeID = ObjectTypes.LOCATION;
        newContctAlrt.ObjectID = this._location.ID;
        newContctAlrt.RowState = DataRowStates.ADDED;
        this.contctAlerts.push(newContctAlrt);

        this.currContctAlrt = newContctAlrt;
        this.ECSObject = this.currContctAlrt;
        this.dirtifyItem();
    }

    removeUserAlert() {
        if (this.currUserAlrt.RowState === DataRowStates.ADDED) {
            const indx = this.userAlerts.findIndex((usrAlrt: UserAlert) => this.currUserAlrt.ID === usrAlrt.ID);
            if (indx >= 0) {
                this.userAlerts.splice(indx, 1);
            }

            this.isDirty = false;
            this.Config.unDirtifyTab();
            this.userAlerts.forEach((usrAlrt: UserAlert) => {
                if (usrAlrt.RowState !== DataRowStates.UNCHANGED) {
                    this.isDirty = true;
                    this.dirtifyItem();
                }
            });
        } else {
            this.currUserAlrt.RowState = DataRowStates.DELETED;
            this.isDirty = true;
            this.dirtifyItem();
        }
    }

    removeContctAlert() {
        if (this.currContctAlrt.RowState === DataRowStates.ADDED) {
            const indx = this.contctAlerts.findIndex((contAlrt: LocationContactAlert) => this.currContctAlrt.ID === contAlrt.ID);
            if (indx >= 0) {
                this.contctAlerts.splice(indx, 1);
            }

            this.isDirty = false;
            this.Config.unDirtifyTab();
            this.contctAlerts.forEach((contAlrt: LocationContactAlert) => {
                if (contAlrt.RowState !== DataRowStates.UNCHANGED) {
                    this.isDirty = true;
                    this.dirtifyItem();
                }
            });
        } else {
            this.currContctAlrt.RowState = DataRowStates.DELETED;
            this.isDirty = true;
            this.dirtifyItem();
        }
    }







    // Private "Helper" Methods
    // --------------------------
    private setUserNames() {
        this.userAlerts.forEach((alert: UserAlert) => {
            alert.UserName = this.locAllowedUsers.find((user: User) => user.ID === alert.UserID).UserName;
        });
    }

    private setContactNames() {
        this.contctAlerts.forEach((alert: LocationContactAlert) => {
            alert.ContactName = this.locContacts.find((contact: LocationContact) => contact.ID === alert.LocationContactID).ContactName;
        });
    }

    private loadAssetOpts() {
        this.optAssets = [{ label: '(ALL)', value: null }];
        this.optAsms = [{ label: 'ALL', value: null }];

        if (this._location.Assets && this._location.Assets.length > 0) {
            this._location.Assets.forEach((ast: Asset) => {
                this.optAssets.push({ label: ast.Name, value: ast });
            });
        }
    }

    private loadAsmOpts(selAsset: Asset) {
        this.optAsms = [{ label: 'ALL', value: null }];

        if (selAsset) {
            selAsset.Measures.forEach((asm: AssetMeasure) => {
                this.optAsms.push({ label: asm.Name, value: asm });
            });
        }
    }


    private loadAlertTypes() {
        if (!(this.alertTypes && this.alertTypes.length > 0) &&
            !(this.inheritedAlertTypes && this.inheritedAlertTypes.length > 0)) {
            return;
        }

        this.locAlertTypes = [];
        this.locAlertTypes.push.apply(this.locAlertTypes, this.alertTypes);
        this.locAlertTypes.push.apply(this.locAlertTypes, this.inheritedAlertTypes);
        this.locAlertTypes = ServiceHelper.sortArray(this.locAlertTypes, 'Name');

        this.optAlrtTypes = [];
        if (this.locAlertTypes && this.locAlertTypes.length > 0) {
            this.locAlertTypes.forEach((alrtType: AlertType) => {
                this.optAlrtTypes.push({ label: alrtType.Name, value: alrtType });
            });
        }
    }


    private loadAlowdUsers() {
        if (!(this.allowedUsers && this.allowedUsers.length > 0) &&
            !(this.inheritedAllowedUsers && this.inheritedAllowedUsers.length > 0)) {
            return;
        }

        this.locAllowedUsers = [];
        this.locAllowedUsers.push.apply(this.locAllowedUsers, this.allowedUsers);
        this.locAllowedUsers.push.apply(this.locAllowedUsers, this.inheritedAllowedUsers);
        this.locAllowedUsers = ServiceHelper.sortArray(this.locAllowedUsers, 'UserName');

        this.optUsers = [];
        this.locAllowedUsers.forEach((user: User) => {
            this.optUsers.push({ label: user.UserName, value: user });
        });
    }


    private loadAlowdContct() {
        if (!(this.contacts && this.contacts.length > 0) &&
            !(this.inheritedContacts && this.inheritedContacts.length > 0)) {
            return;
        }

        this.locContacts = [];
        this.locContacts.push.apply(this.locContacts, this.contacts);
        this.locContacts.push.apply(this.locContacts, this.inheritedContacts);
        this.locContacts = ServiceHelper.sortArray(this.locContacts, 'ContactName');

        this.optContcts = [];
        this.locContacts.forEach((contct: LocationContact) => {
            this.optContcts.push({ label: contct.ContactName, value: contct });
        });
    }

    private afterUASelected() {
        if (!this.currUserAlrt) {
            return;
        }

        switch (this.currUserAlrt.ObjectTypeID) {
            case ObjectTypes.LOCATION: {
                this.selUAAsset = this.optAssets[0].value;
                this.selUAAsm = this.optAsms[0].value;
                break;
            }

            case ObjectTypes.ASSET: {
                const indx = this.optAssets.findIndex((elmnt: SelectItem) => elmnt.value && elmnt.value.ID === this.currUserAlrt.ObjectID);
                this.selUAAsset = this.optAssets[indx].value;

                this.loadAsmOpts(this.selUAAsset);
                this.selUAAsm = this.optAsms[0].value;
                break;
            }

            case ObjectTypes.ASSET_MEASURE: {
                let flg = true;
                let flg2 = true;
                let ast: Asset = null;
                let asm: AssetMeasure = null;

                for (let indx = 0; indx < this._location.Assets.length && flg; indx++) {
                    ast = this._location.Assets[indx];

                    for (let indx2 = 0; indx2 < ast.Measures.length && flg2; indx2++) {
                        asm = ast.Measures[indx2];

                        if (asm.ID === this.currUserAlrt.ObjectID) {
                            const astIndx = this.optAssets.findIndex((elmnt: SelectItem) => elmnt.value && elmnt.value.ID === ast.ID);
                            this.selUAAsset = this.optAssets[astIndx].value;

                            this.loadAsmOpts(this.selUAAsset);
                            const asmIndx = this.optAsms.findIndex((elmnt: SelectItem) => elmnt.value && elmnt.value.ID === asm.ID);
                            this.selUAAsm = this.optAsms[asmIndx].value;
                            flg = false;
                            flg2 = false;
                        }
                    }
                }
            }
        }
    }

    private afterCASelected() {
        if (!this.currContctAlrt) {
            return;
        }

        switch (this.currContctAlrt.ObjectTypeID) {
            case ObjectTypes.LOCATION: {
                this.selCAAsset = this.optAssets[0].value;
                this.selCAAsm = this.optAsms[0].value;
                break;
            }

            case ObjectTypes.ASSET: {
                const indx = this.optAssets.findIndex((elmnt: SelectItem) => elmnt.value && elmnt.value.ID === this.currContctAlrt.ObjectID);
                this.selCAAsset = this.optAssets[indx].value;

                this.loadAsmOpts(this.selCAAsset);
                this.selCAAsm = this.optAsms[0].value;
                break;
            }

            case ObjectTypes.ASSET_MEASURE: {
                let flg = true;
                let flg2 = true;
                let ast: Asset = null;
                let asm: AssetMeasure = null;

                for (let indx = 0; indx < this._location.Assets.length && flg; indx++) {
                    ast = this._location.Assets[indx];

                    for (let indx2 = 0; indx2 < ast.Measures.length && flg2; indx2++) {
                        asm = ast.Measures[indx2];

                        if (asm.ID === this.currContctAlrt.ObjectID) {
                            const astIndx = this.optAssets.findIndex((elmnt: SelectItem) => elmnt.value && elmnt.value.ID === ast.ID);
                            this.selCAAsset = this.optAssets[astIndx].value;

                            this.loadAsmOpts(this.selCAAsset);
                            const asmIndx = this.optAsms.findIndex((elmnt: SelectItem) => elmnt.value && elmnt.value.ID === asm.ID);
                            this.selCAAsm = this.optAsms[asmIndx].value;
                            flg = false;
                            flg2 = false;
                        }
                    }
                }
            }
        }
    }
}
