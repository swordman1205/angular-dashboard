import { Component, Input } from '@angular/core';
import { Location } from '../../../shared/types/location';







@Component({
  selector: 'app-config-location-info',
  templateUrl: './config-location-info.component.html',
  styleUrls: ['./config-location-info.component.scss']
})
export class ConfigLocationInfoComponent {

  @Input() location: Location;






  constructor() {
  }


  // ngOnInit() {
  // }


}
