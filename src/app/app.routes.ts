import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ECSPreloadingStrategy } from './shared/preloading/preloading-strategy';
import { EmptyPageComponent } from './empty-page/empty-page.component';

const appRoutes: Routes = [
     { path: '', redirectTo: 'login', pathMatch: 'full' },
    // { path: '**', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', component: EmptyPageComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            {
                enableTracing: false, // <-- debugging purposes only
                preloadingStrategy: ECSPreloadingStrategy
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

export class AppRoutingModule {}
