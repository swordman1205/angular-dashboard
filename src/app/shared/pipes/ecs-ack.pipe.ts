import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ecsAck'
})
export class EcsAckPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? 'Yes' : 'No';
  }

}
