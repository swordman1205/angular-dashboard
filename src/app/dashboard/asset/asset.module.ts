import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AssetRoutingModule} from './asset-routing.module';
import {AssetWidgetsComponent} from './widgets/asset-widgets.component';
import {WidgetsModule} from '../../widgets/widgets.module';
import {AssetDashboardComponent} from './dashboard/asset-dashboard.component';
import { DocumentsComponent } from './documents/documents.component';

@NgModule({
    imports: [
        CommonModule,
        AssetRoutingModule,
        WidgetsModule
    ],
    declarations: [
        AssetDashboardComponent,
        AssetWidgetsComponent,
        DocumentsComponent
    ]
})
export class AssetModule {
}
