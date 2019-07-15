import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MainModule } from './main/main.module';
import { AppRoutingModule } from './app.routes';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient, HttpClientXsrfModule, HttpClientJsonpModule } from '@angular/common/http';
import { TopologyService } from './shared/services/topology.service';
import { RouteService } from './shared/services/route.service';
import { CommonService } from './shared/services/common.service';
import { LogService } from './shared/services/log.service';
import { AuthService } from './shared/services/auth.service';
import { EmptyPageComponent } from './empty-page/empty-page.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientJsonpModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'ECS-Xsrf-Cookie',
            headerName: 'ECS-Xsrf-Header',
        }),
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        LoginModule,
        MainModule,
        AppRoutingModule
    ],
    declarations: [
        EmptyPageComponent,
        AppComponent,
    ],
    providers: [
        TopologyService,
        RouteService,
        CommonService,
        AuthService],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(router: Router, private _log: LogService) {
        this._log.info('Routes: ' + JSON.stringify(router.config));
    }
}
