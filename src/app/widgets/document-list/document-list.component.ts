import { Component, OnInit, Input } from '@angular/core';
import {BaseWidgetComponent} from '../base-widget/base-widget.component';
import {DataService} from '../../shared/services/data.service';
import {LogService} from '../../shared/services/log.service';
import {AuthService} from '../../shared/services/auth.service';
import {ItemTypes} from '../../shared/data/constants/itemType';



@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent extends BaseWidgetComponent {

  @Input() itemType: string;
  // itemId: number;
  data;

  constructor(private _data: DataService, _logger: LogService, _auth: AuthService) {
    super(_auth, _logger);
  }

  getData() {
    super.getData();

    this._logger.debug(`Getting data for widget document list`);
    if (this.itemType === ItemTypes.LOCATION) {
      this.loading = true;
      this.getDataSubscrp = this._data.getLocationDocuments(this.itemId)
          .subscribe(
              res => {
                this.data = (<any>res).documents.$values;
                this.loading = false;
              },
              err => {
                this.data = undefined;
                this._logger.error(`error in document-list: ${err}`);
                this.loading = false;
              });
    } else if (this.itemType === ItemTypes.ASSET) {
      this.loading = true;
      this.getDataSubscrp = this._data.getAssetDocuments(this.itemId)
          .subscribe(
              res => {
                this.data = (<any>res).$values;
                this.loading = false;
              },
              err => {
                this.data = undefined;
                this._logger.error(`error in asset-documents: ${err}`);
                this.loading = false;
              });
    }
  }
}
