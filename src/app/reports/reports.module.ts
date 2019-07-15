import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { BlockUIModule } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService } from 'primeng/api';





@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        FormsModule,
        BlockUIModule,
        ToastModule,
        ListboxModule,
        TableModule,
        DropdownModule,
        CalendarModule,
        CheckboxModule,
        DialogModule,
        ProgressBarModule
    ],
    declarations: [
        ReportsComponent
    ],
    providers: [
        ReportsComponent,
        MessageService
    ],
    exports: [
        ReportsComponent
    ]
})
export class ReportsModule {
}
