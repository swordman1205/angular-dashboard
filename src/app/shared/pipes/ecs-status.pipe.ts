import { Pipe, PipeTransform } from '@angular/core';
import { statusView } from '../data/constants/statusView';

@Pipe({
    name: 'ecsStatus'
})
export class EcsStatusPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let status = statusView[value];
        if (status) {
            status = status.caption;
        } else {
            console.error('status not supported in statusView file');
        }
        return status;
    }
}
