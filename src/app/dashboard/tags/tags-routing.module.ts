import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from '../../main/main.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {StatusComponent} from './status/status.component';
import {TicketsComponent} from './tickets/tickets.component';
import {AlarmsComponent} from './alarms/alarms.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: 'status',
                component: StatusComponent
            },
            {
                path: 'tickets',
                component: TicketsComponent
            },
            {
                path: 'alarms',
                component: AlarmsComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TagsRoutingModule { }
