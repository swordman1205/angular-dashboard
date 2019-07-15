import { Component, OnInit, Input } from '@angular/core';
import { RouteService } from '../../../shared/services/route.service';
import { TopologyService } from '../../../shared/services/topology.service';
import { DataService } from '../../../shared/services/data.service';
import { LogService } from '../../../shared/services/log.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ConfigurationComponent } from '../../configuration.component';
import { AuthService } from '../../../shared/services/auth.service';
import { Actions } from '../../../shared/data/constants/actions';
import { AssetMeasure } from '../../../shared/types/assetMeasure';
import { ItemTypes } from '../../../shared/data/constants/itemType';






@Component({
  selector: 'app-config-asset-measure-info',
  templateUrl: './config-asset-measure-info.component.html',
  styleUrls: ['./config-asset-measure-info.component.scss']
})
export class ConfigAssetMeasureInfoComponent {
  @Input() assetMeasure: AssetMeasure;





  constructor() {
  }


  // ngOnInit() {
  // }


}
