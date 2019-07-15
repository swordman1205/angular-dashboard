import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsRoutingModule } from './tags-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatusComponent } from './status/status.component';
import { WidgetsModule } from '../../widgets/widgets.module';
import { DxTabsModule } from 'devextreme-angular';
import { TicketsComponent } from './tickets/tickets.component';
import { AlarmsComponent } from './alarms/alarms.component';

@NgModule({
    imports: [
        CommonModule,
        DxTabsModule,
        TagsRoutingModule,
        WidgetsModule,
    ],
    declarations: [
        DashboardComponent,
        StatusComponent,
        TicketsComponent,
        AlarmsComponent
    ]
})
export class TagsModule {
}
