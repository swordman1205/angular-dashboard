import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { ECSPreloadingStrategy } from '../shared/preloading/preloading-strategy';




const mainRoutes: Routes = [
    {
        path: ':itemType/:itemId',
        component: MainComponent,
        children: [
            {
                path: 'live-view',
                // loadChildren: async() => await import('../dashboard/dashboard.module').then(mdl => mdl.DashboardModule),
                loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
                outlet: 'live-view',
                data: { preload: true, delay: false }
            },
            {
                path: 'configuration',
                // loadChildren: async() => await import('../configuration/configuration.module').then(mdl => mdl.ConfigurationModule),
                loadChildren: 'app/configuration/configuration.module#ConfigurationModule',
                outlet: 'config',
                data: { preload: true, delay: false }
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            mainRoutes,
            {
                enableTracing: false, // <-- debugging purposes only
                preloadingStrategy: ECSPreloadingStrategy,
            }
        )
    ],
    exports: [
        RouterModule
    ],
    providers: [
        ECSPreloadingStrategy
    ]
})
export class MainRoutingModule { }
