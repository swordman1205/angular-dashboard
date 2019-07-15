import { Pipe, PipeTransform } from '@angular/core';

declare var moment: any;

@Pipe({
  name: 'ecsDatetime'
})
export class EcsDatetimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
      return moment(value).format('lll');
  }

}
