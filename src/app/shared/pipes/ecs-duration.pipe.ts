import { Pipe, PipeTransform } from '@angular/core';

declare var moment: any;

@Pipe({
    name: 'ecsDuration'
})
export class EcsDurationPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let ret = '';

        if (value) {
            const duration = moment.duration(moment().diff(value))._data;
            // ret = duration.humanize();
            let flg = false;
            if (duration.days > 0) {
                ret = duration.days + 'd ';
                flg = true;
            }

            if (duration.hours > 0 || flg) {
                ret += duration.hours + 'h ';
                flg = true;
            }

            if (duration.minutes > 0 || flg) {
                ret += duration.minutes + 'm ';
            }

            if (duration.seconds > 0 || flg) {
                ret += duration.seconds + 's ';
                flg = true;
            }
        }

        return ret;
    }

}
