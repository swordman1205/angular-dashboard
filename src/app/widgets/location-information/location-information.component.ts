import { Component } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { DataService } from '../../shared/services/data.service';
import { LogService } from '../../shared/services/log.service';
import { TopologyService } from '../../shared/services/topology.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-location-information',
  templateUrl: './location-information.component.html',
  styleUrls: ['./location-information.component.scss']
})
export class LocationInformationComponent extends BaseWidgetComponent {

  name = 'LocationsInformationComponent';
  data;

  locationData = [
    {
      header: 'WIDGETS.LOCATION_INFORMATION.GENERAL',
      columns: [
        { title: 'WIDGETS.LOCATION_INFORMATION.NAME', key: 'Name' },
        { title: 'WIDGETS.LOCATION_INFORMATION.TIME_ZONE', key: 'ZoneName' },
        { title: 'WIDGETS.LOCATION_INFORMATION.COMMENTS', key: 'Comments' }
      ]
    },
    {
      header: 'WIDGETS.LOCATION_INFORMATION.ADDRESS',
      columns: [
        { title: 'WIDGETS.LOCATION_INFORMATION.STREET', key: 'Street' },
        { title: 'WIDGETS.LOCATION_INFORMATION.CITY', key: 'City' },
        { title: 'WIDGETS.LOCATION_INFORMATION.STATE', key: 'State' },
        { title: 'WIDGETS.LOCATION_INFORMATION.POSTAL_CODE', key: 'PostalCode' },
        { title: 'WIDGETS.LOCATION_INFORMATION.COUNTRY', key: 'Country' },
        { title: 'WIDGETS.LOCATION_INFORMATION.ADDRESS', key: 'AddressText' }
      ]
    },
    {
      header: 'WIDGETS.LOCATION_INFORMATION.CONTACT',
      columns: [
        { title: 'WIDGETS.LOCATION_INFORMATION.PHONE1', key: 'Phone1' },
        { title: 'WIDGETS.LOCATION_INFORMATION.PHONE2', key: 'Phone2' },
        { title: 'WIDGETS.LOCATION_INFORMATION.MOBILE_PHONE', key: 'MobilePhone' },
        { title: 'WIDGETS.LOCATION_INFORMATION.FAX', key: 'Fax' },
        { title: 'WIDGETS.LOCATION_INFORMATION.PRIMARY_EMAIL', key: 'Email' },
        { title: 'WIDGETS.LOCATION_INFORMATION.EMAIL2', key: 'Email2' },
        { title: 'WIDGETS.LOCATION_INFORMATION.EMAIL3', key: 'Email3' }
      ]
    },
    {
      header: 'WIDGETS.LOCATION_INFORMATION.MISC',
      columns: [
        { title: 'WIDGETS.LOCATION_INFORMATION.URL', key: 'URL' },
        { title: 'WIDGETS.LOCATION_INFORMATION.LDAP_GROUP', key: 'LDAPGroup' }
      ]
    }
  ];

  constructor(private _data: DataService,
              _logger: LogService,
              private _topology: TopologyService,
              _auth: AuthService) {
    super(_auth, _logger);
  }

  getData() {
    super.getData();

    this._logger.debug(`Getting data for widget location information - LocationId: ${this.itemId}`);
    this.loading = true;
    this.getDataSubscrp = this._data.getLocationInformation(this.itemId)
        .subscribe(
            res => {
              this.data = res;
              this.loading = false;
            },
            err => {
              this.data = undefined;
              this._logger.error(`error in locationInfo: ${err}`);
              this.loading = false;
            });
  }
}