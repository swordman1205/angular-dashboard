import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'rxjs/add/operator/toPromise';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NavigatorMenuComponent } from './navigator-menu/navigator-menu.component';
import { NavigatorComponent } from './navigator/navigator.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { GrowlModule, DialogModule, BreadcrumbModule, ButtonModule } from 'primeng/primeng';
import { WidgetsModule } from '../widgets/widgets.module';
import { MainRoutingModule } from './main.routes';
import { MainComponent } from './main.component';
import { SharedModule } from '../shared/shared.module';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faPlug, faTag, faTags, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TreeModule } from 'primeng/tree';
import { NavigatorTreeComponent } from './navigator-tree/navigator-tree.component';
import { TooltipModule } from 'primeng/tooltip';





// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        ScrollPanelModule,
        BreadcrumbModule,
        ToggleButtonModule,
        ButtonModule,
        GrowlModule,
        HttpModule,
        HttpClientModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        TreeModule,
        SelectButtonModule,
        SharedModule,
        WidgetsModule,
        DialogModule,
        FontAwesomeModule,
        MainRoutingModule,
        TooltipModule
    ],
    declarations: [
        MainComponent,
        NavigatorComponent,
        TopbarComponent,
        NavigatorMenuComponent,
        BreadcrumbsComponent,
        NavigatorTreeComponent,
    ]
})
export class MainModule {
    constructor() {
        // Add an icon to the library for convenient access in other components
        library.add(faHome, faPlug, faTag, faTags, faTachometerAlt);
    }
}
