import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsModule } from './../widgets/widgets.module';
import { GrowlModule, ButtonModule } from 'primeng/primeng';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardContainerComponent } from './dashboard-container.component';
import { LocationModule } from './location/location.module';
import { AssetModule } from './asset/asset.module';
import { AssetMeasureModule } from './asset-measure/asset-measure.module';
import { TagsModule } from './tags/tags.module';
import { FormsModule } from '@angular/forms';
import { BlockUIModule } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';


@NgModule({
    imports: [
        CommonModule,
        WidgetsModule,
        GrowlModule,
        DialogModule,
        ButtonModule,
        FormsModule,
        BlockUIModule,
        ToastModule,
        ProgressBarModule,
        ListboxModule,
        CalendarModule,
        DropdownModule,
        CheckboxModule,
        TableModule,
        SharedModule,
        LocationModule,
        AssetModule,
        AssetMeasureModule,
        TagsModule,
        DashboardRoutingModule,
    ],
    declarations: [
        DashboardContainerComponent
    ]
})
export class DashboardModule {
}
