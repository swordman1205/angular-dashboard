import {LoginPageComponent} from './login-page/login-page.component';
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

export const routes: Routes = [
    {path: 'login', component: LoginPageComponent}
];

export const LoginRoutes: ModuleWithProviders = RouterModule.forChild(routes);
