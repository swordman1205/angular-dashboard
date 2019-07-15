import { Device } from './../../shared/types/device';
import { CommonService } from './../../shared/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { LogService } from './../../shared/services/log.service';
import { DataService } from './../../shared/services/data.service';
import { BaseConfigWidgetComponent } from './../base-config-widget/base-config-widget.component';
import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { User } from '../../shared/types/user';
import { CheckForm } from '../../shared/types/checkForm';
import { MeshRouter } from '../../shared/types/meshRouter';
import { TopologyService } from '../../shared/services/topology.service';
import { RouteService } from '../../shared/services/route.service';
import { ServiceHelper } from '../../shared/services/serviceHelper';
import { ConfigurationComponent } from '../configuration.component';
import { DataRowStates } from '../../shared/data/enums/data-row-state.enum';
import { MessageService } from 'primeng/api';
import { DeviceTypes } from '../../shared/data/constants/deviceTypes';
import { Location } from './../../shared/types/location';
import { Subscription } from 'rxjs';
import { DeviceTypeGroups } from '../../shared/data/constants/deviceTypesGroups';
import { Formatter } from '../../shared/services/formatter';
import { AuthService } from '../../shared/services/auth.service';








@Component({
    selector: 'app-config-devices',
    templateUrl: './config-devices.component.html',
    styleUrls: ['./config-devices.component.scss'],
})
export class ConfigDevicesComponent extends BaseConfigWidgetComponent {

    allowedUsers: Array<User>;
    checkForms: Array<CheckForm>;
    devices: Array<Device>;
    _mapDevices: Map<number, Device>;
    dirtyDevices: Array<Device>;
    inheritedAllowedUsers: Array<User>;
    inheritedCheckForms: Array<CheckForm>;
    meshRouters: Array<MeshRouter>;

    locAllowedUsers: Array<User>;
    locCheckForms: Array<CheckForm>;

    private _nodes: Array<TreeNode>;
    selectedNode: TreeNode;
    currRouter: MeshRouter;
    currDevice: Device;
    currDeviceType: number;
    deviceTypes = DeviceTypes;
    rowStates = DataRowStates;

    saveRouterSubscrp: Subscription;
    private flgNoValidation = false;
    lblGenCode: string = null;






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
    }










    // Properties
    // -----------------------------
    get nodes(): TreeNode[] | any {
        if (this._nodes && this._nodes.length > 0) {
            return this._nodes;
        } else {
            return null;
        }
    }








    // Data Manipulation
    // -------------------------------
    getData() {
        this.loading = true;
        this.Logger.info(`Getting data for widget locations config devices - LocationId: ${this.locationID}`);
        super.getData();

        this.getDataSubscrp = this.Data.getLocationData(this.locationID,
            ['devices',
                'meshRouters',
                'inheritedCheckForms',
                'checkForms',
                'inheritedAllowedUsers',
                'allowedUsers'])
            .subscribe(
                res => {
                    this.allowedUsers = res['allowedUsers'];
                    this.checkForms = res['checkForms'];
                    this.devices = res['devices'];
                    this.inheritedAllowedUsers = res['inheritedAllowedUsers'];
                    this.inheritedCheckForms = res['inheritedCheckForms'];
                    this.meshRouters = res['meshRouters'];

                    const location: Location = <Location>this.Topology.getCachedLocation(this.locationID);
                    location.Devices = this.devices;

                    this.loadTreeItems();
                    this.loadCheckForms();
                    this.loadallowUsers();
                    this.setSelAndOpenNodes();

                    this.Config.unDirtifyTab();
                    this.isDirty = false;
                    this.loading = false;
                },
                err => {
                    this.Logger.error(`error in config location devices ${err}`);
                    this.loading = false;
                    this.getDataSubscrp.unsubscribe();

                    this.MsgService.add({
                        severity: 'error',
                        summary: 'Get Devices Data',
                        detail: 'Getting Devices Data operations has failed. ' + err
                    });
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });

    }


    saveData() {
        this.loading = true;
        this.Logger.info(`Saving data for widget locations config devices - LocationId: ${this.locationID}`);
        super.saveData();

        if (!(this.devices && this.devices.length > 0)) {
            return;
        }

        // Find Dirty Devices
        // ------------------
        this.dirtyDevices = [];
        this.devices.forEach((dvc: Device) => {
            this.findDirtyDevices(dvc);
        });

        // Update Dirty Devices
        // ----------------------------------
        if (this.dirtyDevices.length > 0) {
            if (!this.validateLocationDevices(this._nodes)) {
                this.loading = false;
                return;
            }

            if (this.flgNoValidation || this.validateDevicesIntervals()) {
                this.saveDataSubscrp = this.Data.saveLocationDevices(this.locationID, this.dirtyDevices)
                    .subscribe(
                        res => {
                            this.Logger.info('Location Devices were updated to the ECS Server. Location ID: ' + this.locationID);
                            let dvcIndx = -1;

                            // Remove ALL DELETED Devices from the Devices list, BEFORE re-creating the devices tree
                            this.dirtyDevices.forEach((updtDevice: Device) => {
                                if (updtDevice.RowState === DataRowStates.DELETED) {
                                    let lstDevices: Array<Device> = null;
                                    if (updtDevice.ParentID === updtDevice.ID) {
                                        lstDevices = this.devices;
                                    } else {
                                        const parentDevice = this._mapDevices[updtDevice.ParentID];
                                        if (parentDevice) {
                                            lstDevices = parentDevice.Children;
                                        }
                                    }

                                    dvcIndx = lstDevices.findIndex((dvc: Device) => dvc.ID === updtDevice.ID);
                                    if (dvcIndx >= 0) {
                                        lstDevices.splice(dvcIndx, 1);
                                    }
                                }

                                if (updtDevice.RowState === DataRowStates.ADDED) {
                                    const newDevice: Device = res.find((dv: Device) => dv.PhysicalID === updtDevice.PhysicalID);
                                    if (newDevice) {
                                        updtDevice.ID = newDevice.ID;
                                    }
                                }
                            });


                            if (this.currDevice) {
                                this.currDevice.RowState = DataRowStates.UNCHANGED;
                            }

                            this.loadTreeItems();
                            this.setSelAndOpenNodes();
                            this.dirtyDevices = null;
                        },
                        err => {
                            this.Logger.error(`error in saving location devices ${err}`);
                            this.loading = false;
                            this.saveDataSubscrp.unsubscribe();

                            this.MsgService.add({
                                severity: 'error',
                                summary: 'Devices Update',
                                detail: 'The Updating Location devices has failed. ' + err
                            });
                        },
                        () => {
                            this.saveDataSubscrp.unsubscribe();
                            this.saveDirtyRouters();
                        }
                    );
            }
        } else {
            this.saveDirtyRouters();
        }
    }










    // Event Handlers
    // --------------------------
    nodeSelectHandler(event) {
        if (this.selectedNode.data.DeviceTypeID === this.deviceTypes.MESH_ROUTER) {
            this.currRouter = <MeshRouter>(this.selectedNode.data);
            this.currDeviceType = DeviceTypes.MESH_ROUTER;
            this.currDevice = null;
            this.ECSObject = this.currRouter;
        } else {
            this.currDevice = <Device>(this.selectedNode.data);
            this.currDeviceType = this.currDevice.DeviceTypeID;
            this.currRouter = null;
            this.ECSObject = this.currDevice;
        }
    }


    addDevice(parent: TreeNode = null) {
        const parentDevice: Device = parent ? parent.data : null;
        const newDevice: Device = new Device();
        newDevice.ID = 0;

        newDevice.DeviceTypeID = this.deviceTypes.INTELLIGATE;  // this.Common.getDeviceType(10).ID;
        newDevice.ParentID = parentDevice ? parentDevice.ID : newDevice.ID;
        newDevice.PhysicalID = '';
        newDevice.DisconnectAlarmDelay = 120;
        newDevice.LogPeriod = 0;
        newDevice.ModelNumberFlags = 0;
        newDevice.ConfigLogPeriod = 0;
        newDevice.ConfigModelNumberFlags = 0;
        newDevice.Children = [];
        newDevice.BatteryLogs = [];
        newDevice.RxSignalLogs = [];
        newDevice.TxSignalLogs = [];
        newDevice.Measurements = [];
        newDevice.CheckForms = [];
        newDevice.Users = [];
        newDevice.RowState = DataRowStates.ADDED;

        const newDeviceNode: TreeNode = this.createDeviceNodes(newDevice);

        if (parentDevice) {
            parentDevice.Children.push(newDevice);
            const parentNode: TreeNode = this.findNodeInTree(parentDevice);
            if (parentNode) {
                if (!parentNode.children) {
                    parentNode.children = new Array<TreeNode>();
                }

                parentNode.children.push(newDeviceNode);
                this.expandNode(parentNode, true);
                this.selectedNode = newDeviceNode;
            }
        } else {
            this.devices.push(newDevice);
            this._nodes.push(newDeviceNode);
            this.selectedNode = newDeviceNode;
        }

        this.loadTreeItems();
        this.setSelAndOpenNodes();
        this.dirtifyItem();
    }


    removeNode() {
        if (this.selectedNode.data.DeviceTypeID === DeviceTypes.MESH_ROUTER) {
            this.removeMeshRouter();
        } else {
            this.removeDevice();
        }
    }


    generateIDCode() {
        this.loading = true;
        this.Logger.info(`Setting Location Identification Code - LocationId: ${this.locationID}`);
        super.getData();

        this.getDataSubscrp = this.Data.generateIdentificationCode(this.locationID)
            .subscribe(
                res => {
                    this.loading = false;
                    this.lblGenCode = res;
                },
                err => {
                    this.Logger.error(`error in config location devices ${err}`);
                    this.loading = false;
                },
                () => {
                    this.getDataSubscrp.unsubscribe();
                });
    }









    // Private "Helper" Methods
    // --------------------------
    private loadTreeItems() {
        this._nodes = new Array<TreeNode>();
        this._mapDevices = new Map<number, Device>();

        if (!(this.devices && this.devices.length > 0)) {
            this.currRouter = this.currDevice = null;
            this.ECSObject = null;
            return;
        }

        this._nodes = new Array<TreeNode>();
        const dvcNodes = new Array<TreeNode>();
        this._mapDevices = new Map<number, Device>();
        this.devices.forEach((dvc: Device) => {
            const dvcItem: TreeNode = this.createDeviceNodes(dvc);
            dvcNodes.push(dvcItem);
            this._mapDevices[dvc.ID] = dvc;
        });

        if (dvcNodes && dvcNodes.length > 0) {
            this._nodes = ServiceHelper.sortArray(dvcNodes, 'label');
        }

        if (!(this.meshRouters && this.meshRouters.length > 0)) {
            return;
        }

        this.meshRouters.forEach((router: MeshRouter) => {
            const rtItem: TreeNode = this.createRouterNodes(router);
            const parent: TreeNode = this._nodes.find((nd: TreeNode) => nd.data.ID === router.IntelliGateID);
            if (parent) {
                if (!parent.children) {
                    parent.children = [];
                }

                rtItem.parent = parent;
                parent.children.push(rtItem);
            }
        });
    }


    private loadCheckForms() {
        if (!(this.checkForms && this.checkForms.length > 0) &&
            !(this.inheritedCheckForms && this.inheritedCheckForms.length > 0)) {
            return;
        }

        this.locCheckForms = [];
        this.locCheckForms.push.apply(this.locCheckForms, this.checkForms);
        this.locCheckForms.push.apply(this.locCheckForms, this.inheritedCheckForms);
        this.locCheckForms = ServiceHelper.sortArray(this.locCheckForms, 'Name');
    }


    private loadallowUsers() {
        if (!(this.allowedUsers && this.allowedUsers.length > 0) &&
            !(this.inheritedAllowedUsers && this.inheritedAllowedUsers.length > 0)) {
            return;
        }

        this.locAllowedUsers = [];
        this.locAllowedUsers.push.apply(this.locAllowedUsers, this.allowedUsers);
        this.locAllowedUsers.push.apply(this.locAllowedUsers, this.inheritedAllowedUsers);
        this.locAllowedUsers = ServiceHelper.sortArray(this.locAllowedUsers, 'UserName');
    }


    private createDeviceNodes(device: Device): TreeNode {
        const lbl: string = this.Common.getDeviceType(device.DeviceTypeID).Name + ' ' +
            this.Common.getPhysicalIDSnippet(device.PhysicalID);

        let icoName = 'fas fa-thermometer-half';
        if (ServiceHelper.isDeviceIntelliGate(device.DeviceTypeID)) {
            icoName = 'fas fa-project-diagram';
        }
        if (device.DeviceTypeID === DeviceTypes.ANALOG5V40 ||
            device.DeviceTypeID === DeviceTypes.ANALOG5V40_WIFI) {
            icoName = 'fas fa-code-branch';
        }

        if (device.DeviceTypeID === DeviceTypes.DISH11 ||
            device.DeviceTypeID === DeviceTypes.DISH11_WIFI) {
            icoName = 'fas fa-satellite-dish';
        }

        if (device.DeviceTypeID === DeviceTypes.HUMIDITY11 ||
            device.DeviceTypeID === DeviceTypes.HUMIDITY11_WIFI ||
            device.DeviceTypeID === DeviceTypes.HUMIDITY22 ||
            device.DeviceTypeID === DeviceTypes.HUMIDITY22_WIFI) {
            icoName = 'fas fa-humidity';
        }

        if (device.DeviceTypeID === DeviceTypes.INTELLICHECK) {
            icoName = 'fab fa-trello';
        }

        if (device.DeviceTypeID === DeviceTypes.OEM) {
            icoName = '';
        }

        const dvcNode: TreeNode = {
            label: lbl,
            data: device,
            icon: icoName,
            expandedIcon: 'fa fa-folder-open',
            collapsedIcon: 'fa fa-folder'
        };

        dvcNode['style'] = { width: '100%', color: 'black' };

        if (device.Children && device.Children.length > 0) {
            const children = device.Children;
            const nodeChildrn: TreeNode[] = new Array<TreeNode>();

            children.forEach((child: Device) => {
                const chldNode: TreeNode = this.createDeviceNodes(child);
                chldNode.parent = dvcNode;
                nodeChildrn.push(chldNode);
            });

            dvcNode.children = nodeChildrn;
        }

        return dvcNode;
    }


    private createRouterNodes(router: MeshRouter): TreeNode {
        const lbl: string = this.Common.getDeviceType(router.DeviceTypeID).Name + ' ' +
            this.Common.getPhysicalIDSnippet(router.PhysicalID);

        const rtrItem: TreeNode = {
            label: lbl,
            data: router,
            icon: 'fa fa-trello',
            expandedIcon: 'fa fa-folder-open',
            collapsedIcon: 'fa fa-folder'
        };

        rtrItem['style'] = { width: '100%', color: 'black' };
        return rtrItem;
    }


    private resetDeviceNode(device: Device) {
        const node: TreeNode = this.findNodeInTree(device);
        if (node) {
            node['data'] = device;
            node['style'] = { width: '100%', color: 'black' };
            node['label'] = this.Common.getDeviceType(device.DeviceTypeID).Name + ' ' +
                this.Common.getPhysicalIDSnippet(device.PhysicalID);
        }
    }

    private findDirtyDevices(device: Device) {
        if (device.RowState !== DataRowStates.UNCHANGED) {
            this.dirtyDevices.push(device);
            return;
        }

        if (device.Children && device.Children.length > 0) {
            device.Children.forEach((child: Device) => {
                this.findDirtyDevices(child);
            });
        }
    }


    private setSelAndOpenNodes() {
        if (!(this._nodes && this._nodes.length > 0)) {
            return;
        }

        if (this.selectedNode) {
            this.selectedNode = this.findNodeInTree(this.selectedNode.data);
            if (!this.selectedNode) {
                this.selectedNode = this._nodes[0];
            }
        } else {
            this.selectedNode = this._nodes[0];
        }

        if (this.selectedNode.parent) {
            this.expandNode(this.selectedNode.parent, true);
        } else {
            this.expandNode(this.selectedNode, true);
        }

        this.nodeSelectHandler(null);
    }


    private saveDirtyRouters() {
        const dirtyRouters: Array<MeshRouter> = [];
        this.meshRouters.forEach((router: MeshRouter) => {
            if (router.RowState !== DataRowStates.UNCHANGED) {
                dirtyRouters.push(router);
            }
        });


        // Update Dirty MeshRouters
        // ----------------------------------
        if (dirtyRouters.length > 0) {
            if (this.saveRouterSubscrp) {
                this.saveRouterSubscrp.unsubscribe();
            }

            this.saveRouterSubscrp = this.Data.saveLocationMeshRouters(this.locationID, dirtyRouters)
                .subscribe(
                    res => {
                        this.dirtyDevices = null;
                        let rtIndx = -1;

                        this.Logger.info('Location Mesh Routers were updated to the ECS Server. Location ID: ' + location);
                        res.forEach((rt: MeshRouter) => {
                            rtIndx = this.meshRouters.findIndex((routr: MeshRouter) => routr.ID === rt.ID);
                            if (rtIndx >= 0) {
                                this.meshRouters[rtIndx] = rt;
                            }
                        });

                        if (this.currRouter) {
                            this.currRouter.RowState = DataRowStates.UNCHANGED;
                        }
                    },
                    err => {
                        this.Logger.error(`error in saving location mesh routers ${err}`);
                        this.loading = false;

                        this.MsgService.add({
                            severity: 'error',
                            summary: 'Devices Update',
                            detail: 'ThUpdating Location devices has failed. ' + err
                        });
                    },
                    () => {
                        this.saveRouterSubscrp.unsubscribe();

                        this.loading = false;
                        this.Config.unDirtifyTab();
                        this.isDirty = false;
                        this.MsgService.add({
                            severity: 'success',
                            summary: 'Devices Update',
                            detail: 'Updating Location devices was successful'
                        });
                    }
                );
        } else {
            this.loading = false;
            this.Config.unDirtifyTab();
            this.isDirty = false;
            this.MsgService.add({
                severity: 'success',
                summary: 'Devices Update',
                detail: 'Updating Location devices was successful'
            });
        }
    }


    private findNodeInTree(device: Device): TreeNode {
        let flgBreak = false;
        let reqNode: TreeNode = null;
        this._nodes.forEach((node: TreeNode) => {
            if (!flgBreak) {
                reqNode = this.iterateAndFindNode(node, device);
                if (reqNode) {
                    flgBreak = true;
                }
            }
        });

        return reqNode;
    }


    private iterateAndFindNode(node: TreeNode, device: Device): TreeNode {
        let flgBreak = false;
        let reqNode: TreeNode = null;


        if ((device.ID < 1 || node.data.ID < 1) && node.data.PhysicalID === device.PhysicalID) {
            reqNode = node;
        } else if (node.data.ID === device.ID) {
            reqNode = node;
        } else {
            if (node.children && node.children.length > 0) {
                node.children.forEach((child: TreeNode) => {
                    if (!flgBreak) {
                        reqNode = this.iterateAndFindNode(child, device);
                        if (reqNode) {
                            flgBreak = true;
                        }
                    }
                });
            }
        }

        return reqNode;
    }

    private expandNode(node: TreeNode, isExpand: boolean, withChildren: boolean = false) {
        node.expanded = isExpand;
        if (withChildren && node.children) {
            node.children.forEach((child: TreeNode) => {
                this.expandNode(child, isExpand);
                child.expanded = isExpand;
            });
        }
    }


    private validateDevicesIntervals(withAlert: boolean = true): boolean {
        let isValid = true;
        const wifiSensors: Array<number> = DeviceTypeGroups.INTELLISENSOR_WIFI['Devices'];

        this.resetTreeItemsValidity();

        this.devices.forEach((device: Device) => {
            if (device.RowState !== DataRowStates.DELETED) {
                if (device.DeviceTypeID === DeviceTypes.INTELLIGATE) {
                    if (!this.validateIntelligateIntervals(device)) {
                        isValid = false;
                    }
                } else if (wifiSensors.indexOf(device.DeviceTypeID) >= 0) {
                    if (!this.validateWiFiIntervals(device)) {
                        isValid = false;
                    }
                }
            }
        });

        // this.devicesTree.validateNow();
        // this.busy = false;

        if (!isValid) {
            this.loading = false;
            if (withAlert) {
                this.MsgService.clear();
                this.MsgService.add({
                    key: 'confirmDialg',
                    sticky: true,
                    severity: 'warn',
                    summary: 'Tx Period Validation Error',
                    detail: 'Some Devices have their TxPeriod value equal or ' +
                        'larger than Disconnect Alarm Delay. Would you like to continue?',
                    data: {
                        this: this,
                        onConfirm: () => {
                            this.MsgService.clear('confirmDialg');
                            this.flgNoValidation = true;
                            this.saveData();
                        },
                        onReject: () => {

                            this.MsgService.clear('confirmDialg');
                        }
                    }
                });
            }
        }

        return isValid;
    }


    private resetTreeItemsValidity() {
        this._nodes.forEach((node: TreeNode) => {
            this.resetValidity(node);
        });
    }


    private resetValidity(node: TreeNode) {
        node['style'] = { width: '100%', color: 'black' };

        if (node.hasOwnProperty('children') && node.children) {
            node.children.forEach((child: TreeNode) => {
                this.resetValidity(child);
            });
        }
    }


    private validateIntelligateIntervals(gateWay: Device): boolean {
        let flg = true;
        let node: TreeNode = null;

        if (gateWay.RowState !== DataRowStates.DELETED) {
            if (gateWay.ConfigTxPeriod >= (gateWay.DisconnectAlarmDelay * 60)) {
                flg = false;
                gateWay.NotValid = true;

                node = this.getDeviceNode(gateWay);
                if (node) {
                    node['style'] = { width: '100%', color: 'red' };
                }
            }

            if (gateWay.Children && gateWay.Children.length > 0) {
                gateWay.Children.forEach((child: Device) => {
                    if (child.RowState !== DataRowStates.DELETED) {
                        if (child.ConfigTxPeriod >= (gateWay.DisconnectAlarmDelay * 60) ||
                            child.ConfigTxPeriod >= (child.DisconnectAlarmDelay * 60)) {
                            flg = false;
                            child.NotValid = true;

                            node = this.getDeviceNode(child);
                            if (node) {
                                node['style'] = { width: '100%', color: 'red' };
                            }
                        }
                    }
                });
            }
        }

        return flg;
    }


    private validateWiFiIntervals(wifi: Device): boolean {
        if (wifi.ConfigTxPeriod >= (wifi.DisconnectAlarmDelay * 60)) {
            wifi.NotValid = true;

            const node: TreeNode = this.getDeviceNode(wifi);
            if (node) {
                node['style'] = { width: '100%', color: 'red' };
            }

            return false;
        }

        return true;
    }


    private getDeviceNode(device: Device): TreeNode {
        let reqNode: TreeNode = null;
        if (device) {
            let macth: TreeNode = null;
            this._nodes.forEach((node: TreeNode) => {
                macth = this.iterateDeviceItems(device, node);
                if (macth) {
                    reqNode = macth;
                }
            });
        }

        return reqNode;
    }


    private iterateDeviceItems(device: Device, node: TreeNode): TreeNode {
        let reqNode: TreeNode = null;
        if (node.data.ID === device.ID &&
            node.data.DeviceTypeID === device.DeviceTypeID) {
            reqNode = node;
        }

        if (!reqNode && node.hasOwnProperty('children') && node.children) {
            node.children.forEach((child: TreeNode) => {
                if (this.iterateDeviceItems(device, child)) {
                    reqNode = child;
                }
            });
        }

        return reqNode;
    }


    private removeDevice() {
        if (this.currDevice.RowState === DataRowStates.ADDED) {
            const parentNode: TreeNode = this.selectedNode.parent;
            const parentDevice: Device = parentNode.data;

            const lstDevices: Array<Device> = parentDevice ? parentDevice.Children : this.devices;
            const dvcIndx = lstDevices.findIndex((dvc: Device) => dvc.ID === this.currDevice.ID);
            if (dvcIndx >= 0) {
                lstDevices.splice(dvcIndx, 1);
            }

            this.devices.forEach((dvc: Device) => {
                if (dvc.RowState !== DataRowStates.UNCHANGED) {
                    this.isDirty = true;
                }
            });

            let indx = -1;
            if (parentNode) {
                indx = parentNode.children.findIndex((node: TreeNode) => this.selectedNode.data.ID === node.data.ID);
                parentNode.children.splice(indx, 1);
            } else {
                indx = this._nodes.findIndex((node: TreeNode) => this.selectedNode.data.ID === node.data.ID);
                this._nodes.splice(indx, 1);
            }

            let devicNode: TreeNode = this.selectedNode.parent;
            if (!devicNode && this._nodes.length > 0) {
                devicNode = this._nodes[0];
            }

            this.selectedNode = parentNode;
            this.setSelAndOpenNodes();
        } else {
            this.currDevice.RowState = DataRowStates.DELETED;
            this.expandNode(this.selectedNode, false);
            this.dirtifyItem();
            this.isDirty = true;
        }
    }


    private removeMeshRouter() {
        this.selectedNode.data.RowState = DataRowStates.DELETED;
        this.expandNode(this.selectedNode, false);
        this.dirtifyItem();
        this.isDirty = true;
    }


    private validateLocationDevices(nodes: Array<TreeNode>): boolean {
        let flg = true;
        if (nodes && nodes.length > 0) {
            nodes.forEach((nd: TreeNode) => {
                if (flg && nd.data.DeviceTypeID < DeviceTypes.MESH_ROUTER) {
                    const device: Device = nd.data;

                    if (device.RowState === DataRowStates.ADDED) {
                        const existDevc: Device = this.devices.find((devc: Device) =>
                            devc.RowState !== DataRowStates.ADDED && devc.RowState !== DataRowStates.DELETED && devc.PhysicalID === device.PhysicalID);

                        if (existDevc) {
                            this.loading = false;
                            if (nd.parent) {
                                this.expandNode(nd.parent, true);
                            }

                            this.selectedNode = nd;
                            flg = false;

                            this.MsgService.clear();
                            this.MsgService.add({
                                severity: 'warn',
                                summary: 'MAC Address Validation',
                                detail: 'MAC Address already exist!'
                            });
                        }

                        if (flg && !(device.PhysicalID && device.PhysicalID.length > 0)) {
                            this.loading = false;
                            if (nd.parent) {
                                this.expandNode(nd.parent, true);
                            }

                            this.selectedNode = nd;
                            flg = false;

                            this.MsgService.clear();
                            this.MsgService.add({
                                severity: 'warn',
                                summary: 'MAC Address Validation',
                                detail: 'MAC Address can be empty value'
                            });
                        }

                        if (flg && !this.macAddressRegExValidate(device)) {
                            this.loading = false;
                            if (nd.parent) {
                                this.expandNode(nd.parent, true);
                            }

                            this.selectedNode = nd;
                            flg = false;

                            this.MsgService.clear();
                            this.MsgService.add({
                                severity: 'warn',
                                summary: 'MAC Address Validation',
                                detail: 'MAC Address is invalid'
                            });
                        }
                    }

                    if (flg && nd.children) {
                        flg = this.validateLocationDevices(nd.children);
                    }
                }
            });
        }

        return flg;
    }

    private getMaskBytesCount(mask: string): number {
        return (mask.replace(/\:/g, '').length / 2) - 1;
    }

    private macAddressRegExValidate(device: Device): boolean {
        const mask = this.geNewDeviceMask(device);
        const regexp = Formatter.REGEX_PHYSICAL_ID.replace('[maskBytesCount]', this.getMaskBytesCount(mask).toString());
        const MACRegex = new RegExp(regexp);
        return MACRegex.test(device.PhysicalID);
    }

    geNewDeviceMask(device: Device): string {
        if (device) {
            if (ServiceHelper.isIntelliSensorDeviceZB(device.DeviceTypeID) ||
                device.DeviceTypeID === this.deviceTypes.OEM) {
                return '**:**:**:**:**:**:**:**';
            } else {
                return '**:**:**:**:**:**';
            }
        } else {
            return '';
        }
    }
}
