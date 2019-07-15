import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page/login-page.component';
import { RouterModule } from '@angular/router';
import { LoginRoutes } from './login.routes';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule, ProgressSpinnerModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        LoginRoutes,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ProgressSpinnerModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        TooltipModule,
        BlockUIModule,
    ],
    declarations: [LoginPageComponent, ChangePasswordComponent]
})
export class LoginModule {
}
