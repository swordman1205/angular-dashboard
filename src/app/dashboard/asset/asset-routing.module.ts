import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetWidgetsComponent } from './widgets/asset-widgets.component';
import { AssetDashboardComponent } from './dashboard/asset-dashboard.component';
import { NotImplementedYetComponent } from '../../widgets/not-implemented-yet/not-implemented-yet.component';
import {DocumentsComponent} from './documents/documents.component';

const routes: Routes = [
    {
        path: '',
        component: AssetDashboardComponent,
        children: [
            {
                path: 'widgets',
                component: AssetWidgetsComponent
            },
            {
                path: 'alarms',
                component: NotImplementedYetComponent
            },
            {
                path: 'tickets',
                component: NotImplementedYetComponent
            },
            {
                path: 'intelliMaps',
                component: NotImplementedYetComponent
            },
            {
                path: 'documents',
                component: DocumentsComponent
            },
            {
                path: 'intelliTasks',
                component: NotImplementedYetComponent
            },
            {
                path: 'measures',
                component: NotImplementedYetComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssetRoutingModule {
}
