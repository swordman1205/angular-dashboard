import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ConfigRoutingModule } from './configuration-routing.module';
import { BaseConfigWidgetComponent } from './base-config-widget/base-config-widget.component';
import { ConfigurationComponent } from './configuration.component';
import { ConfigDevicesComponent } from './config-devices/config-devices.component';
import { ConfigItemsComponent } from './config-items/config-items.component';
import { ConfigFormsComponent } from './config-forms/config-forms.component';
import { ConfigAlarmTypesComponent } from './config-alarm-types/config-alarm-types.component';
import { ConfigAlertTypesComponent } from './config-alert-types/config-alert-types.component';
import { ConfigAlertsComponent } from './config-alerts/config-alerts.component';
import { ConfigAssetTypesComponent } from './config-asset-types/config-asset-types.component';
import { ConfigAssetMeasureTypesComponent } from './config-assetmeasure-types/config-assetmeasure-types.component';
import { ConfigMaintenanceComponent } from './config-maintenance/config-maintenance.component';
import { ConfigTicketsComponent } from './config-tickets/config-tickets.component';
import { ConfigIntelliTasksComponent } from './config-intellitasks/config-intellitasks.component';
import { ConfigPermissionsComponent } from './config-permissions/config-permissions.component';
import { ConfigDevicesInfoComponent } from './config-devices/config-devices-info/config-devices-info.component';
import { ConfigDevicesMeasurementsComponent } from './config-devices/config-devices-measurements/config-devices-measurements.component';
import { ConfigItemInfoComponent } from './config-items/config-items-info/config-items-info.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { ListboxModule } from 'primeng/listbox';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { SpinnerModule } from 'primeng/spinner';
import { BlockUIModule, MessageModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfigMeshRouterInfoComponent } from './config-devices/config-meshrouter-info/config-meshrouter-info.component';
import { ConfigRouteRecordsComponent } from './config-devices/config-route-records/config-route-records.component';
import { ConfigIntelliChecksComponent } from './config-devices/config-intellichecks/config-intellichecks.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfigItemStepsComponent } from './config-items/config-items-steps/config-items-steps.component';
import { ConfigItemIntelliTaskComponent } from './config-items/config-items-intellitask/config-items-intellitask.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfigFormsInfoComponent } from './config-forms/config.forms.info/config.forms.info.component';
import { ConfigFormsItemsComponent } from './config-forms/config.forms.items/config-forms-items.component';
import { DragDropModule } from 'primeng/dragdrop';
import { CalendarModule } from 'primeng/calendar';
import { BaseConfigWidgetExtComponent } from './base-config-widget/base-config-widgetExt.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { ShowErrorsComponent } from './config-validation/validation-messaging/validation-error.component';
import { IpAddressValidator } from './config-validation/validators/validator-ip-address';
import { PhoneNumberFormatValidator } from './config-validation/validators/validator-phone-number';
import {
  DxSchedulerModule,
  DxSelectBoxModule,
  DxBoxModule,
  DxCheckBoxModule,
  DxTemplateModule,
  DxListModule,
  DxDateBoxModule,
  DxButtonModule,
  DxFormModule,
  DxChartModule,
  DxPopupModule,
  DxRadioGroupModule,
  DxNumberBoxModule,
  DxTabsModule,
  DxDrawerModule,
  DxToolbarModule
} from 'devextreme-angular';
import { ConfigInfoContainerComponent } from './config-info/config-info.component';
import { ConfigLocationInfoComponent } from './config-info/config-location-info/config-location-info.component';
import { ConfigAssetInfoComponent } from './config-info/config-asset-info/config-asset-info.component';
import { ConfigAssetMeasureInfoComponent } from './config-info/config-asset-measure-info/config-asset-measure-info.component';








@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    DxSchedulerModule,
    DxTemplateModule,
    DxListModule,
    DxSelectBoxModule,
    DxRadioGroupModule,
    DxBoxModule,
    DxCheckBoxModule,
    DxNumberBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxFormModule,
    DxChartModule,
    DxPopupModule,
    DxTabsModule,
    DxDrawerModule,
    DxToolbarModule,
    DxListModule,
    TreeModule,
    TabViewModule,
    DropdownModule,
    TableModule,
    CheckboxModule,
    ListboxModule,
    SpinnerModule,
    BlockUIModule,
    PanelModule,
    ButtonModule,
    TooltipModule,
    KeyFilterModule,
    MessageModule,
    InputMaskModule,
    ToastModule,
    DialogModule,
    CardModule,
    InputTextareaModule,
    OverlayPanelModule,
    ColorPickerModule,
    DragDropModule,
    CalendarModule,
    RadioButtonModule,
    ChartModule,
    GalleriaModule,
    ConfigRoutingModule,
  ],
  declarations: [
    BaseConfigWidgetComponent,
    BaseConfigWidgetExtComponent,
    ConfigurationComponent,
    ConfigDevicesComponent,
    ConfigItemsComponent,
    ConfigFormsComponent,
    ConfigAlarmTypesComponent,
    ConfigAlertTypesComponent,
    ConfigAlertsComponent,
    ConfigAssetTypesComponent,
    ConfigAssetMeasureTypesComponent,
    ConfigMaintenanceComponent,
    ConfigTicketsComponent,
    ConfigIntelliTasksComponent,
    ConfigPermissionsComponent,
    ConfigDevicesInfoComponent,
    ConfigDevicesMeasurementsComponent,
    ConfigItemsComponent,
    ConfigItemInfoComponent,
    ConfigItemStepsComponent,
    ConfigItemIntelliTaskComponent,
    ConfigMeshRouterInfoComponent,
    ConfigRouteRecordsComponent,
    ConfigIntelliChecksComponent,
    ConfigFormsInfoComponent,
    ConfigFormsItemsComponent,
    ConfigInfoContainerComponent,
    ConfigLocationInfoComponent,
    ConfigAssetInfoComponent,
    ConfigAssetMeasureInfoComponent,
    ShowErrorsComponent,
    IpAddressValidator,
    PhoneNumberFormatValidator
  ],
  exports: [
    ConfigurationComponent
  ],
  providers: [
    MessageService
  ]
})
export class ConfigurationModule {

}
