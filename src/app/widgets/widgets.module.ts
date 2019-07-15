import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    DataTableModule,
    ButtonModule,
    BreadcrumbModule,
    ChartModule,
    BlockUIModule,
    PanelModule,
    CalendarModule,
    SelectButtonModule,
    MessagesModule,
    AutoCompleteModule,
    TooltipModule,
    DragDropModule,
    DataGridModule,
    DataGrid,
    Panel,
    BlockUI,
    InputSwitchModule,
    AccordionModule,
    ListboxModule
} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { LocationsStatusTableComponent } from './locations-status-table/locations-status-table.component';
import { SharedModule } from '../shared/shared.module';
import { ActivityGridComponent } from './activity-grid/activity-grid.component';
import { ActiveAlarmsChartComponent } from './active-alarms-chart/active-alarms-chart.component';
import { OpenTicketsChartComponent } from './open-tickets-chart/open-tickets-chart.component';
import { AssetMeasuresChartComponent } from './asset-measures-chart/asset-measures-chart.component';
import { FormsModule } from '@angular/forms';
import { SpotlightComponent } from './spotlight/spotlight.component';
import { BaseWidgetComponent } from './base-widget/base-widget.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { AssetLastValueGaugeComponent } from './asset-last-value-gauge/asset-last-value-gauge.component';
import { TagsComponent } from './tags/tags.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { AlarmListComponent } from './alarm-list/alarm-list.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { EcsDatetimePipe } from '../shared/pipes/ecs-datetime.pipe';
import { AssetMeasureHighchartComponent } from '../asset-measure-highchart/asset-measure-highchart.component';
import { LocationInformationComponent } from './location-information/location-information.component';
import { TagsStatusComponent } from './tags-status/tags-status.component';
import { NotImplementedYetComponent } from './not-implemented-yet/not-implemented-yet.component';
import { DocumentListComponent } from './document-list/document-list.component';



@NgModule({
    imports: [
        CommonModule,
        DataTableModule,
        SharedModule,
        ButtonModule,
        BreadcrumbModule,
        ChartModule,
        BlockUIModule,
        PanelModule,
        CalendarModule,
        FormsModule,
        SelectButtonModule,
        MessagesModule,
        AutoCompleteModule,
        TooltipModule,
        DragDropModule,
        DataGridModule,
        PanelModule,
        UiSwitchModule,
        InputSwitchModule,
        TableModule,
        AccordionModule,
        ListboxModule
    ],
    declarations: [
        LocationsStatusTableComponent,
        ActivityGridComponent,
        ActiveAlarmsChartComponent,
        OpenTicketsChartComponent,
        AssetMeasuresChartComponent,
        SpotlightComponent,
        BaseWidgetComponent,
        GeneralSettingsComponent,
        AssetLastValueGaugeComponent,
        TagsComponent,
        AlarmListComponent,
        TicketListComponent,
        AssetMeasureHighchartComponent,
        LocationInformationComponent,
        TagsStatusComponent,
        DocumentListComponent,
        NotImplementedYetComponent
    ],
    exports: [
        LocationsStatusTableComponent,
        ActivityGridComponent,
        ActiveAlarmsChartComponent,
        OpenTicketsChartComponent,
        AssetMeasuresChartComponent,
        SpotlightComponent,
        GeneralSettingsComponent,
        AssetLastValueGaugeComponent,
        DataGrid,
        Panel,
        BlockUI,
        AlarmListComponent,
        TicketListComponent,
        AssetMeasureHighchartComponent,
        LocationInformationComponent,
        TagsStatusComponent,
        DocumentListComponent,
        NotImplementedYetComponent
    ],
    providers: [
        EcsDatetimePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetsModule {
}
