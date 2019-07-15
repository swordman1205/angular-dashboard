import { LogService } from '../../shared/services/log.service';
import { DataService } from '../../shared/services/data.service';
import { BaseConfigWidgetExtComponent } from '../base-config-widget/base-config-widgetExt.component';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { User } from '../../shared/types/user';
import { TopologyService } from '../../shared/services/topology.service';
import { RouteService } from '../../shared/services/route.service';
import { ConfigurationComponent } from '../configuration.component';
import { Actions } from '../../shared/data/constants/actions';
import { ServiceHelper } from '../../shared/services/serviceHelper';
import { CommonService } from '../../shared/services/common.service';
import { AuthService } from '../../shared/services/auth.service';



@Component({
  selector: 'app-config-permissions',
  templateUrl: './config-permissions.component.html',
  styleUrls: ['./config-permissions.component.scss']
})
export class ConfigPermissionsComponent extends BaseConfigWidgetExtComponent<User> {

  locAllowedUsers: Array<User>;


  permissCols = [
    { field: 'Icon', header: '', sortable: false },
    { field: 'UserName', header: 'User Name', sortable: true },
    { field: 'FirstName', header: 'First Name', sortable: true },
    { field: 'LastName', header: 'Last Name', sortable: true },
    { field: 'UserTypeName', header: 'Type', sortable: true },
    { field: 'Sync', header: 'Permission', sortable: true }
  ];

  dataCols = [
    { field: 'Icon', header: '', sortable: false },
    { field: 'UserName', header: 'User Name', sortable: true },
    { field: 'FirstName', header: 'First Name', sortable: true },
    { field: 'LastName', header: 'Last Name', sortable: true },
    { field: 'UserTypeName', header: 'Type', sortable: true }
  ];




  constructor(router: RouteService,
    topology: TopologyService,
    data: DataService,
    logger: LogService,
    translate: TranslateService,
    msgService: MessageService,
    config: ConfigurationComponent,
    auth: AuthService,
    common: CommonService) {
    super(router, topology, data, logger, translate, msgService, config, auth, common);

    this.LabelBy = 'UserName';
    this.SortBy = 'UserName';
    this.DataNames = ['inheritedAllowedUsers', 'allowedUsers'];
    this.ExtraDataNames = null;
    this.DataFunctionBag = { Func: this.Data.getAllowedUsers };
    this.SaveAct = Actions.SAVE_LOCATION_PERMISSIONS;
  }








  // ----------------------------------
  // Overriding Base Class Operations
  // ----------------------------------
  protected afterDataRetrieve(extraData: any) {
    if (extraData && extraData['func']) {
      this.locAllowedUsers = extraData['func'];
    }

    this.loadAllowedUsers();
    this.setPermissions();
  }

  saveData() {
    this.DirtyEcsObjects = this.EcsObjects;
    super.saveData();
  }







  // Event Handlers
  // ------------------------------
  permissChanged(selected: boolean, user: User) {
    if (selected) {
      this.EcsObjects.push(user);
    } else {
      const indx: number = this.EcsObjects.findIndex((usr: User) => usr.ID === user.ID);
      if (indx >= 0) {
        this.EcsObjects.splice(indx, 1);
      }
    }

    this.dirtifyItem();
  }






  // Private "Helper" Methods
  // --------------------------
  private loadAllowedUsers() {
    if (this.locAllowedUsers && this.locAllowedUsers.length > 0) {
      this.locAllowedUsers = ServiceHelper.sortArray(this.locAllowedUsers, 'UserName');
    }
  }


  private setPermissions() {
    if (!(this.EcsObjects && this.EcsObjects.length > 0 &&
      this.locAllowedUsers && this.locAllowedUsers.length > 0)) {
      return;
    }

    let currUser: User = null;
    this.locAllowedUsers.forEach((locUser: User) => {
      locUser.UserTypeName = this.Common.getUserType(locUser.UserTypeID).Name;
      currUser = this.EcsObjects.find((user: User) => user.ID === locUser.ID);
      if (currUser) {
        locUser.Sync = true;
      } else {
        locUser.Sync = false;
      }
    });
  }
}

