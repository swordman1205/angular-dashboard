import { TranslateService } from '@ngx-translate/core';
import { LogService } from './../../../shared/services/log.service';
import { DataService } from './../../../shared/services/data.service';
import { Component, Input } from '@angular/core';
import { CheckItem } from '../../../shared/types/checkItem';
import { BaseConfigItem } from '../../base-config-widget/base-config-item';
import { SelectItem, MessageService } from 'primeng/api';
import { CommonService } from '../../../shared/services/common.service';
import { CheckItemImage } from '../../../shared/types/checkItemImage';
import { ServiceHelper } from '../../../shared/services/serviceHelper';






@Component({
    selector: 'config-items-info',
    templateUrl: './config-items-info.component.html',
    styleUrls: ['./config-items-info.component.scss']
})
export class ConfigItemInfoComponent extends BaseConfigItem {

    private _checkItem: CheckItem;
    flgDisplayDlg: boolean;
    // private _flgEditImage: boolean;
    imgPath: string;

    lstOpts: SelectItem[];
    selDialgItm: SelectItem;
    checkItemImages: any[];






    constructor(logger: LogService,
        common: CommonService,
        translate: TranslateService,
        msgService: MessageService,
        data: DataService) {
        super(logger, common, translate, msgService, data);
    }






    // Properties
    // -------------------------------------------
    @Input()
    set checkItem(chkItem: CheckItem) {
        this._checkItem = chkItem;
        if (this._checkItem) {
            // this.imgPath = this.Data.host + '/IntelliCheck/Images/' + this._checkItem.CheckItemImageID + '.swf';
            this.imgPath = this.Data.host + '/Images/FusionLogo.png';
        }
    }

    get checkItem(): CheckItem {
        return this._checkItem;
    }







    // Event Handlers
    // ----------------------------------
    browseImage() {
        if (!(this.checkItemImages && this.checkItemImages.length > 0)) {
            this.checkItemImages = [];
            const images = [];

            this.Common.commonData.CheckItemImages.forEach((chkItmImg: CheckItemImage) => {
                // images.push({ source: 'assets/showcase/images/demo/galleria/galleria1.jpg', alt: '', title: chkItmImg.Name });
                images.push({ source: this.Data.host + '/IntelliCheck/Images/' + chkItmImg.ID + '.swf', alt: 'Description for Image 1', title: 'Title 1', id: chkItmImg.ID });
            });

            this.checkItemImages = ServiceHelper.sortArray(images, 'Name');
        }

        this.flgDisplayDlg = true;
        // this._flgEditImage = true;
    }


    deleteImage() {
        this._checkItem.CheckItemImageID = 0;
        // this._flgEditImage = true;
        this.onDirtify();
    }

    imageSelected(event) {
        this._checkItem.CheckItemImageID = event.image.id;
        this.onDirtify();
    }
}
