import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';
import {SweetAlertType} from 'sweetalert2/dist/sweetalert2';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class AlertsService {

    constructor(private _translate: TranslateService) {}

    private showAlert(title, desc, typeOfAlert): Promise<any> {
        return Swal.fire({
            title,
            text: desc,
            type: typeOfAlert
        });
    }

    success(title, desc) {
        return this.showAlert(this._translate.instant(title), this._translate.instant(desc), 'success');
    }

    info(title, desc) {
        return this.showAlert(this._translate.instant(title), this._translate.instant(desc), 'info');
    }

    warning(title, desc) {
        return this.showAlert(this._translate.instant(title), this._translate.instant(desc), 'warning');
    }

    error(title, desc) {
        return this.showAlert(this._translate.instant(title), this._translate.instant(desc), 'error');
    }

    question(title, desc) {
        return this.showAlert(this._translate.instant(title), this._translate.instant(desc), 'question');
    }

    isVisible() {
        return Swal.isVisible();
    }
}
