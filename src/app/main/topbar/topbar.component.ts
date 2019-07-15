import {Component, Input, ViewChild} from '@angular/core';
import {RouteService} from '../../shared/services/route.service';
import {DataService} from '../../shared/services/data.service';
import {CommonService} from '../../shared/services/common.service';
import {TopologyService} from '../../shared/services/topology.service';
import {LogService} from '../../shared/services/log.service';
import {AuthService} from '../../shared/services/auth.service';
import {GeneralSettingsComponent} from '../../widgets/general-settings/general-settings.component';
import {MainComponent} from '../../main/main.component';
import {MenuItem} from 'primeng/api';
import {UserTypes} from '../../shared/data/constants/userTypes';


declare var flashvars: any;


@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

    items: MenuItem[];
    @Input() itemType;
    @Input() itemId;
    configChecked: boolean;
    version: string;
    dbVersion: string;
    settingsDialogVisible = false;
    @ViewChild(GeneralSettingsComponent)
    private generalSettingsComponent: GeneralSettingsComponent;
    isFilteredByTags;
    isAdmin = false;

    btnModes = [
        {label: 'Live View', value: 'liveView', icon: 'fab fa-dashcube'},
        {label: 'Configuration', value: 'configuration', icon: 'fas fa-wrench'}];

    constructor(public main: MainComponent, private _data: DataService,
                private _logger: LogService, private _topology: TopologyService,
                private _commonData: CommonService, private _router: RouteService,
                private _auth: AuthService) {
        this.version = flashvars.version;
        this.dbVersion = flashvars.dbVer;
        _topology.isFilteredByTags$.subscribe(val => {
            this.isFilteredByTags = val;
        });
        this.isAdmin = _commonData.loggedUser && _commonData.loggedUser.UserTypeID === UserTypes.SYSTEM_ADMIN;
    }


    onLogout() {
        this._logger.info('User clicked on logout');
        this._data.logout().subscribe(() => {
            document.cookie = 'ECSFusionAuth=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = '.ECSFusionAuth=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            this._topology.reset();
            this._commonData.reset();
            this._auth.reset();
            setTimeout(() => this._router.navigateToLogin(), 100);
        });
        this.isAdmin = false;
    }

    toggleSettingsDialog(open: boolean) {
        this.settingsDialogVisible = open;
    }

    onSettingsShow() {
        this.generalSettingsComponent.init();
    }

    onIconClicked(view) {
        this._router.navigateToItemView({
            type: this.itemType,
            id: this.itemId,
            view
        });
    }

    onSettingsClicked() {

    }
}
