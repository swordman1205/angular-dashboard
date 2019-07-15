import { HttpErrorHandler } from './services/error-handler.service';
import { PhoneValidator } from './validators/phone.validator';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService } from './services/log.service';
import { DataService } from './services/data.service';
import { AlertsService } from './services/alerts.service';
import { EcsStatusPipe } from './pipes/ecs-status.pipe';
import { EcsDatetimePipe } from './pipes/ecs-datetime.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { EcsLastValuePipe } from './ecs-last-value.pipe';
import { EcsDurationPipe } from './pipes/ecs-duration.pipe';
import { EcsAckPipe } from './pipes/ecs-ack.pipe';
import { BlockerComponent } from './widgets/blocker/blocker.component';



@NgModule({
    imports: [
        CommonModule,
        TranslateModule
    ],
    declarations: [EcsDatetimePipe, EcsStatusPipe, EcsLastValuePipe, EcsDurationPipe,
        EcsAckPipe, BlockerComponent],
    providers: [LogService, DataService, HttpErrorHandler, AlertsService, PhoneValidator],
    exports: [EcsDatetimePipe, EcsStatusPipe, TranslateModule, EcsLastValuePipe,
        EcsDurationPipe, EcsAckPipe, BlockerComponent]
})
export class SharedModule {
}


