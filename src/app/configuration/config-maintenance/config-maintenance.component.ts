import { LogService } from './../../shared/services/log.service';
import { DataService } from './../../shared/services/data.service';
import { BaseConfigWidgetExtComponent } from '../base-config-widget/base-config-widgetExt.component';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../shared/services/common.service';
import { PreventiveMaintenance } from '../../shared/types/preventiveMaintenance';
import { TopologyService } from '../../shared/services/topology.service';
import { RouteService } from '../../shared/services/route.service';
import { ConfigurationComponent } from '../configuration.component';
import { Actions } from '../../shared/data/constants/actions';
import { AuthService } from '../../shared/services/auth.service';




@Component({
    selector: 'app-config-maintenance',
    templateUrl: './config-maintenance.component.html',
    styleUrls: ['./config-maintenance.component.scss']
})
export class ConfigMaintenanceComponent extends BaseConfigWidgetExtComponent<PreventiveMaintenance> implements OnInit {







    constructor(router: RouteService,
        topology: TopologyService,
        data: DataService,
        logger: LogService,
        translate: TranslateService,
        msgService: MessageService,
        config: ConfigurationComponent,
        auth: AuthService,
        common: CommonService) {
        super(router, topology, data, logger, translate, msgService, config, auth, common);

        this.LabelBy = 'Name';
        this.SortBy = 'Name';
        this.DataNames = ['prevMains'];
        this.ExtraDataNames = null;
        this.SaveAct = Actions.SAVE_LOCATION_PREV_MAIN;

    }








    // LifeCycle Hooks
    // ---------------------
    ngOnInit() {
        super.ngOnInit();
        // this.ecsObjectChanged.subscribe(
        //     event => {
        //         const this = this;
        //         const str = this.CurrECSObject.RepeatInterval;
        //     });
    }



    // Event Handlers
    // ---------------------
    addPrevMaint(event) {
        if (!this.validate()) {
            return;
        }

        const newPrevMain: PreventiveMaintenance = new PreventiveMaintenance();
        newPrevMain.Name = '';
        newPrevMain.StartDate = new Date();
        newPrevMain.StartDate.setHours(8, 0, 0, 0);
        newPrevMain.RepeatInterval = 0;
        this.addEcsObject(newPrevMain);
    }
}

