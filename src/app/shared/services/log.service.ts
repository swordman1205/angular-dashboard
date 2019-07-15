import {Injectable} from '@angular/core';

@Injectable()
export class LogService {

    debug(msg: string) {
        console.log(`%c DEBUG: ${msg}`, 'background: #222; color: #FFFFFF');
    }

    info(msg: string) {
        console.log(`%c INFO: ${msg}`, 'background: #222; color: #00f5ff');
    }

    warn(msg: string) {
        console.warn(`%c WARNING: ${msg}`, 'background: #222; color: #FFFF00');
    }

    error(msg: string) {
        console.warn(`%c ERROR: ${msg}`, 'background: #222; color: #ff0000');
    }
}
