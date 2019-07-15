import { Component, OnInit, Input } from '@angular/core';
import { Asset } from '../../../shared/types/asset';






@Component({
  selector: 'app-config-asset-info',
  templateUrl: './config-asset-info.component.html',
  styleUrls: ['./config-asset-info.component.scss']
})
export class ConfigAssetInfoComponent {
  @Input() asset: Asset;







  constructor() {
  }


  // ngOnInit() {
  // }



}
