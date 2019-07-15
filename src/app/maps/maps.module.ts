import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MapsComponent } from './maps.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { BlockUIModule } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DxMapModule, DxSelectBoxModule } from 'devextreme-angular';






@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        FormsModule,
        BlockUIModule,
        ToastModule,
        DxMapModule,
        DxSelectBoxModule
    ],
    declarations: [
        MapsComponent
    ],
    providers: [
        MapsComponent,
        MessageService
    ],
    exports: [
        MapsComponent
    ]
})
export class MapsModule {
}
