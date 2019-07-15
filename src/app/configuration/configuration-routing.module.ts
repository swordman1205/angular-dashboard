
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';
import { ConfigDevicesComponent } from './config-devices/config-devices.component';
import { ConfigFormsComponent } from './config-forms/config-forms.component';
import { ConfigItemsComponent } from './config-items/config-items.component';
import { ConfigAlarmTypesComponent } from './config-alarm-types/config-alarm-types.component';
import { ConfigAlertTypesComponent } from './config-alert-types/config-alert-types.component';
import { ConfigAlertsComponent } from './config-alerts/config-alerts.component';
import { ConfigAssetTypesComponent } from './config-asset-types/config-asset-types.component';
import { ConfigAssetMeasureTypesComponent } from './config-assetmeasure-types/config-assetmeasure-types.component';
import { ConfigMaintenanceComponent } from './config-maintenance/config-maintenance.component';
import { ConfigTicketsComponent } from './config-tickets/config-tickets.component';
import { ConfigPermissionsComponent } from './config-permissions/config-permissions.component';
import { ConfigIntelliTasksComponent } from './config-intellitasks/config-intellitasks.component';
import { CanDeactivateConfigGuard } from './can-deactivate-config-guard.service';
import { ConfigInfoContainerComponent } from './config-info/config-info.component';



const configRoutes: Routes = [
    {
        path: '',
        component: ConfigurationComponent,
        children: [
            {
                path: 'info',
                canDeactivate: [CanDeactivateConfigGuard],
                component: ConfigInfoContainerComponent
            },
            {
                path: 'devices',
                canDeactivate: [CanDeactivateConfigGuard],
                component: ConfigDevicesComponent
            },
            {
                path: 'items',
                canDeactivate: [CanDeactivateConfigGuard],
                component: ConfigItemsComponent
            },
            {
                path: 'forms',
                canDeactivate: [CanDeactivateConfigGuard],
                component: ConfigFormsComponent
            },
            {
                path: 'alarmTypes',
                canDeactivate: [CanDeactivateConfigGuard],
                component: ConfigAlarmTypesComponent
            },
            {
                path: 'alertTypes',
                canDeactivate: [CanDeactivateConfigGuard],
                component: ConfigAlertTypesComponent
            },
            {
                path: 'alerts',
                canDeactivate: [CanDeactivateConfigGuard],
                component: ConfigAlertsComponent
            },
            {
                path: 'assetTypes',
                canDeactivate: [CanDeactivateConfigGuard],
                component: ConfigAssetTypesComponent
            },
            {
                path: 'asmTypes',
                canDeactivate: [CanDeactivateConfigGuard],
                component: ConfigAssetMeasureTypesComponent
            },
            {
                path: 'maintenance',
                canDeactivate: [CanDeactivateConfigGuard],
                component: ConfigMaintenanceComponent
            },
            {
                path: 'tickets',
                canDeactivate: [CanDeactivateConfigGuard],
                component: ConfigTicketsComponent
            },
            {
                path: 'permissions',
                canDeactivate: [CanDeactivateConfigGuard],
                component: ConfigPermissionsComponent
            },
            {
                path: 'intelliTasks',
                canDeactivate: [CanDeactivateConfigGuard],
                component: ConfigIntelliTasksComponent
            }
        ]
     }
];




@NgModule({
    imports: [
        RouterModule.forChild(configRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        CanDeactivateConfigGuard
    ]
})
export class ConfigRoutingModule { }
