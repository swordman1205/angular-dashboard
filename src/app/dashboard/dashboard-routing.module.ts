import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardContainerComponent } from './dashboard-container.component';


const dashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardContainerComponent,
        children: [
            {
                path: 'locationDashboard',
                // loadChildren: async() => await import('../dashboard/location/location.module').then(mdl => mdl.LocationModule),
                loadChildren: 'app/dashboard/location/location.module#LocationModule',
                data: { preload: true, delay: false }
            },
            {
                path: 'assetDashboard',
                // loadChildren: async() => await import('../dashboard/asset/asset.module').then(mdl => mdl.AssetModule),
                loadChildren: 'app/dashboard/asset/asset.module#AssetModule',
                data: { preload: true, delay: false }
            },
            {
                path: 'assetMeasureDashboard',
                // loadChildren: async() => await import('../dashboard/asset-measure/asset-measure.module').then(mdl => mdl.AssetMeasureModule),
                loadChildren: 'app/dashboard/asset-measure/asset-measure.module#AssetMeasureModule',
                data: { preload: true, delay: false }
            },
            {
                path: 'tagsDashboard',
                // loadChildren: async() => await import('../dashboard/tags/tags.module').then(mdl => mdl.TagsModule),
                loadChildren: 'app/dashboard/tags/tags.module#TagsModule',
                data: { preload: true, delay: false }
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(dashboardRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardRoutingModule { }
