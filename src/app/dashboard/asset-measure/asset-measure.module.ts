import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AssetMeasureRoutingModule} from './asset-measure-routing.module';
import {WidgetsModule} from '../../widgets/widgets.module';
import {AssetMeasureWidgetsComponent} from './widgets/asset-measure-widgets.component';
import {AssetMeasureDashboardComponent} from './dashboard/asset-measure-dashboard.component';

@NgModule({
    imports: [
        CommonModule,
        WidgetsModule,
        AssetMeasureRoutingModule
    ],
    declarations: [
        AssetMeasureDashboardComponent,
        AssetMeasureWidgetsComponent
    ]
})
export class AssetMeasureModule {
}
