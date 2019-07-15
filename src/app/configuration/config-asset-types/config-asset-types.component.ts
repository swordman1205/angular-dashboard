import { LogService } from './../../shared/services/log.service';
import { DataService } from './../../shared/services/data.service';
import { BaseConfigWidgetExtComponent } from '../base-config-widget/base-config-widgetExt.component';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AssetType } from '../../shared/types/assetType';
import { TopologyService } from '../../shared/services/topology.service';
import { RouteService } from '../../shared/services/route.service';
import { ConfigurationComponent } from '../configuration.component';
import { Actions } from '../../shared/data/constants/actions';
import { AuthService } from '../../shared/services/auth.service';







@Component({
  selector: 'app-config-asset-types',
  templateUrl: './config-asset-types.component.html',
  styleUrls: ['./config-asset-types.component.scss']
})
export class ConfigAssetTypesComponent extends BaseConfigWidgetExtComponent<AssetType> {


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
    this.DataNames = ['assetTypes'];
    this.ExtraDataNames = null;
    this.SaveAct = Actions.SAVE_LOCATION_ASSET_TYPES;
  }






  // LifeCycle Hooks
  // ---------------------
  // ngOnInit() {
  //   super.ngOnInit();
  //   this.ecsObjectChanged.subscribe(
  //     event => {


  //     });
  // }

  addAssetType(event) {
    if (!this.validate()) {
      return;
    }

    const newAssetType: AssetType = new AssetType();
    newAssetType.Name = '';
    this.addEcsObject(newAssetType);
  }
}
