import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetMeasureDashboardComponent } from './dashboard/asset-measure-dashboard.component';
import { AssetMeasureWidgetsComponent } from './widgets/asset-measure-widgets.component';
import { NotImplementedYetComponent } from '../../widgets/not-implemented-yet/not-implemented-yet.component';

const routes: Routes = [
    {
        path: '',
        component: AssetMeasureDashboardComponent,
        children: [
            {
                path: 'widgets',
                component: AssetMeasureWidgetsComponent
            },
            {
                path: 'intelliTasks',
                component: NotImplementedYetComponent
            },
            {
                path: 'statusHistory',
                component: NotImplementedYetComponent
            },
            {
                path: 'valueHistory',
                component: NotImplementedYetComponent
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetMeasureRoutingModule { }
