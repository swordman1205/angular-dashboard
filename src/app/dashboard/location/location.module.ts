import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationRoutingModule } from './location-routing.module';
import { LocationDashboardComponent } from './dashboard/location-dashboard.component';
import { LocationWidgetsComponent } from './widgets/location-widgets.component';
import { TicketsComponent } from './tickets/tickets.component';
import { AlarmsComponent } from './alarms/alarms.component';
import { WidgetsModule } from '../../widgets/widgets.module';
import { InformationComponent } from './information/information.component';
import { ReportsModule } from '../../reports/reports.module';
import { MapsModule } from '../../maps/maps.module';
import { DocumentsComponent } from './documents/documents.component';




@NgModule({
    imports: [
        CommonModule,
        LocationRoutingModule,
        WidgetsModule,
        ReportsModule,
        MapsModule
    ],
    declarations: [
        LocationDashboardComponent,
        LocationWidgetsComponent,
        TicketsComponent,
        AlarmsComponent,
        InformationComponent,
        DocumentsComponent
    ]
})
export class LocationModule {
}
