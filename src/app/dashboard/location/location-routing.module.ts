import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationDashboardComponent } from './dashboard/location-dashboard.component';
import { LocationWidgetsComponent } from './widgets/location-widgets.component';
import { TicketsComponent } from './tickets/tickets.component';
import { AlarmsComponent } from './alarms/alarms.component';
import { ReportsComponent } from '../../reports/reports.component';
import { MapsComponent } from '../../maps/maps.component';
import { ActivityGridComponent } from '../../widgets/activity-grid/activity-grid.component';
import { DocumentsComponent } from './documents/documents.component';






const routes: Routes = [
    {
        path: '',
        component: LocationDashboardComponent,
        children: [
            {
                path: 'widgets',
                component: LocationWidgetsComponent
            },
            {
                path: 'tickets',
                component: TicketsComponent
            },
            {
                path: 'alarms',
                component: AlarmsComponent
            },
            {
                path: 'activities',
                component: ActivityGridComponent
            },
            {
                path: 'reports',
                component: ReportsComponent
            },
            {
                path: 'intelliMaps',
                component: MapsComponent
            },
            {
                path: 'documents',
                component: DocumentsComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LocationRoutingModule { }
