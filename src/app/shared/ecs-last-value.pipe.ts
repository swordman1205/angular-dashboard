import { Pipe, PipeTransform } from '@angular/core';
import { AssetMeasureStatus } from './types/assetMeasureStatus';
import { defaults } from './data/defaults';

@Pipe({
    name: 'ecsLastValue'
})
export class EcsLastValuePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        const ams = <AssetMeasureStatus>args;

        if (!ams) {
            return '';
        }

        if (ams.MeasureID === 3) {    // DIGITAL
            return value === defaults.NAFEM_TRUE ? ams.TrueString : ams.FalseString;
        }

        return `${parseFloat(value.toFixed(ams.Precision))} ${ams.MeasureUnitName}`;
    }

}
