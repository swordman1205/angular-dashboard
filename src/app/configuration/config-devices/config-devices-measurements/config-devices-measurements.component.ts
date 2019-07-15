import { Device } from '../../../shared/types/device';
import { CommonService } from '../../../shared/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { LogService } from '../../../shared/services/log.service';
import { Component, Input } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { DeviceTypePort } from '../../../shared/types/deviceTypePort';
import { AssetMeasure } from '../../../shared/types/assetMeasure';
import { Measurement } from '../../../shared/types/measurement';
import { Asset } from '../../../shared/types/asset';
import { ServiceHelper } from '../../../shared/services/serviceHelper';
import { TopologyService } from '../../../shared/services/topology.service';
import { Location } from '../../../shared/types/location';
import { BaseConfigItem } from '../../base-config-widget/base-config-item';
import { DataRowStates } from '../../../shared/data/enums/data-row-state.enum';





@Component({
    selector: 'config-devices-measurements',
    templateUrl: './config-devices-measurements.component.html',
    styleUrls: ['./config-devices-measurements.component.scss']
})
export class ConfigDevicesMeasurementsComponent extends BaseConfigItem {

    private _device: Device;
    private _locationID: number;
    private _location: Location;
    dvcTypePorts: Array<DeviceTypePort>;

    selDevicePort: DeviceTypePort;
    selMeasurement: Measurement;
    selAsset: Asset;
    selAsm: AssetMeasure;
    lastSelRow = -1;

    assetOptions: SelectItem[];
    asmOptions: SelectItem[];

    measureCols = [
        { field: 'Icon', header: '', sortable: false },
        { field: 'Name', header: 'Port', sortable: true },
        { field: 'PortType', header: 'Type', sortable: true }
        // { field: 'measure', header: 'Measure', sortable: true }
    ];








    constructor(logger: LogService,
        translate: TranslateService,
        common: CommonService,
        msgService: MessageService,
        topology: TopologyService) {
        super(logger, common, translate, msgService, null, topology);
    }








    // Properties
    // -------------------------------------------
    @Input()
    set device(device: Device) {
        this._device = device;
        if (this._device) {
            this.loadData();
        }
    }

    get device(): Device {
        return this._device;
    }


    @Input()
    set locationID(locID: number) {
        this._locationID = locID;
        if (this._locationID > 0) {
            this._location = this.Topology.getCachedLocation(this.locationID);
        }
    }

    get locationID(): number {
        return this._locationID;
    }









    // Event Handlers
    // ---------------------------------
    setEditMode(event: MouseEvent, dvcPort: DeviceTypePort) {
        if (this.selDevicePort && this.selDevicePort.ID === dvcPort.ID) {
            return;
        }

        this.dvcTypePorts.forEach((port: DeviceTypePort) => {
            if (port.ID === dvcPort.ID) {
                if (port.EditMode) {
                    return;
                }
                port.EditMode = true;
            } else {
                port.EditMode = false;
            }
        });

        this.selMeasurement = ServiceHelper.getDeviceMeasurement(this.device.Measurements, dvcPort.ID);

        this.selAsset = this.selMeasurement ?
            ServiceHelper.getAssetByAssetMeasure(this._location.Assets, this.selMeasurement.AssetMeasureID) :
            null;

        this.selAsm = (this.selMeasurement && this.selAsset) ? ServiceHelper.getAssetMeasure(
            this.selAsset.Measures, this.selMeasurement.AssetMeasureID) : null;

        this.fillAssetCombo();

        if (!this.selMeasurement) {
            if (this.assetOptions.length === 0) {
                return;
            }

            this.selAsset = this.assetOptions[0].value;
            const newMeasurement: Measurement = new Measurement();
            newMeasurement.DeviceTypePortID = dvcPort.ID;
            newMeasurement.RowState = DataRowStates.ADDED;
            this.device.Measurements.push(newMeasurement);
            this.selMeasurement = newMeasurement;
            this.onDirtify();
            this.astComboChanged();
        } else {
            this.fillAsmCombo();
        }
    }


    rowSelected(event) {
        const edtPort: DeviceTypePort = this.dvcTypePorts.find((port: DeviceTypePort) => port.EditMode === true);
        if (edtPort && edtPort.ID !== this.selDevicePort.ID) {
            edtPort.EditMode = false;
        }
    }


    rowUnselected(event) {
        // const edtPort: DeviceTypePort = this.dvcTypePorts.find((port: DeviceTypePort) => port.EditMode === true);
        // if (edtPort && edtPort.ID === event.data.ID) {
        //     edtPort.EditMode = false;
        // }
        this.dvcTypePorts.forEach((port: DeviceTypePort) => port.EditMode = false);
    }


    astComboChanged() {
        if (this.selMeasurement) {
            this.selMeasurement.AssetMeasureID = 0;
        }

        if (this.selAsset.RowState === DataRowStates.DETACHED) {
            // User Choose the forst "Empty"  option
            this.deleteSelMeasurement();
            this.selDevicePort.EditMode = false;
            this.selDevicePort.Measurement = null;
            return;
        }

        this.fillAsmCombo();

        this.selAsm = this.asmOptions[0].value;
        this.selMeasurement.AssetMeasureID = this.selAsm.ID;
        if (this.selMeasurement.RowState !== DataRowStates.ADDED) {
            this.selMeasurement.RowState = DataRowStates.MODIFIED;
            this.onDirtify();
        }

        const currDvcPort: DeviceTypePort = this.dvcTypePorts.find(
            (port: DeviceTypePort) => this.selMeasurement.DeviceTypePortID === port.ID);

        currDvcPort.Measurement = { asset: this.selAsset, asm: this.selAsm };
    }


    asmComboChnaged(event) {
        this.selMeasurement.AssetMeasureID = event.value.ID; // AssetMeasure(measuresCombo.selectedItem).ID;
        if (this.selMeasurement.RowState !== DataRowStates.ADDED) {
            this.selMeasurement.RowState = DataRowStates.MODIFIED;
            this.onDirtify();
        }

        const currDvcPort: DeviceTypePort = this.dvcTypePorts.find(
            (port: DeviceTypePort) => this.selMeasurement.DeviceTypePortID === port.ID);

        currDvcPort.Measurement = { asset: this.selAsset, asm: this.selAsm };
    }







    // Private "Helper" Methods
    // ------------------------------
    private loadData() {
        if (this.device) {
            this.dvcTypePorts = this.Common.getDeviceTypePorts(this.device.DeviceTypeID);
            this.dvcTypePorts.forEach((port: DeviceTypePort) => {
                port.Icon = 'fs fa-thermometer-quarter';
                port.PortType = this.Common.getPort(port.PortID).Type;
                port.Measurement = this.getMeasurement(port.ID);
                port.EditMode = false;
            });

            this.assetOptions = [];
            this.asmOptions = [];
        }
    }


    private getMeasurement(deviceTypePortID: number): { asset: Asset, asm: AssetMeasure } {
        if (!(this._device && this._device.Measurements)) {
            return null;
        }

        const measurement: Measurement = ServiceHelper.getDeviceMeasurement(this.device.Measurements, deviceTypePortID);
        const asset: Asset = measurement ? ServiceHelper.getAssetByAssetMeasure(
            this._location.Assets, measurement.AssetMeasureID) : null;
        const asm: AssetMeasure = (measurement && asset) ? ServiceHelper.getAssetMeasure(
            asset.Measures, measurement.AssetMeasureID) : null;

        return { asset: asset, asm: asm };
    }


    private fillAssetCombo() {
        const measurmnts: Array<Measurement> = ServiceHelper.getMeasurements(this._location.Devices);

        this.assetOptions = [];   // filteredAssets
        this.asmOptions = [];     // filteredAssetMeasures

        // If the current DeviceTypePort Row
        // has allready a measuremnet attached to it
        if (this.selMeasurement) {
            this.assetOptions.push({ label: '', value: { Name: '', RowState: DataRowStates.DETACHED } });
        }

        this._location.Assets.forEach((ast: Asset) => {
            let avlMeasuresExist = false;

            ast.Measures.forEach((asm: AssetMeasure) => {
                let measureAvailable = true;

                measurmnts.forEach((measrmnt: Measurement) => {
                    if (measrmnt.AssetMeasureID === asm.ID &&
                        measrmnt.RowState !== DataRowStates.DELETED &&
                        asm !== this.selAsm) {
                        measureAvailable = false;
                    }
                });

                if (measureAvailable) {
                    avlMeasuresExist = true;
                    measureAvailable = false;
                }
            });

            if (avlMeasuresExist || ast === this.selAsset) {
                this.assetOptions.push({ label: ast.Name, value: ast });
            }
        });
    }


    private fillAsmCombo() {
        const measurmnts: Array<Measurement> = ServiceHelper.getMeasurements(this._location.Devices);

        this.asmOptions = [];
        this.selAsset.Measures.forEach((asm: AssetMeasure) => {
            let measureAvailable = true;
            measurmnts.forEach((measrmnt: Measurement) => {
                if (measureAvailable) {
                    if (measrmnt.AssetMeasureID === asm.ID &&
                        measrmnt.RowState !== DataRowStates.DELETED &&
                        (!this.selAsm || asm.ID !== this.selAsm.ID)) {
                        measureAvailable = false;
                    }
                }
            });

            if (measureAvailable) {
                this.asmOptions.push({ label: asm.Name, value: asm });
            }
        });
    }


    private deleteSelMeasurement() {
        const measurements: Array<Measurement> = this.device.Measurements;
        if (this.selMeasurement.RowState === DataRowStates.ADDED) {
            const indx = measurements.findIndex(measrmnt => measrmnt.ID === this.selMeasurement.ID);
            if (indx >= 0) {
                measurements.splice(indx, 1);
            }
        } else {
            this.selMeasurement.RowState = DataRowStates.DELETED;
            this.onDirtify();
        }
    }
}
