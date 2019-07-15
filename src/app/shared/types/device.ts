import { Location } from './location';
import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { BatteryLog } from './batteryLog';
import { RxSignalLog } from './rxSignalLog';
import { TxSignalLog } from './txSignalLog';
import { Measurement } from './measurement';
import { CheckForm } from './checkForm';
import { User } from './user';
import { ClientCerts } from './clientCerts';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';



@JsonObject({ knownTypes: [Device, BatteryLog, RxSignalLog, TxSignalLog, Measurement] })
export class Device implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    DeviceTypeID: number;
    @JsonProperty
    ParentID: number;
    @JsonProperty
    PhysicalID: string;
    @JsonProperty
    StartDate: Date;
    @JsonProperty
    EndDate: Date;
    @JsonProperty
    SecPairRequestedTime: Date;
    @JsonProperty
    SecPairRequested: boolean;
    @JsonProperty
    SecPairStatus: number;
    @JsonProperty
    SerialNumber: string;
    @JsonProperty
    SecPair: number;
    @JsonProperty
    Comments: string;
    @JsonProperty
    IPAddress: string;
    @JsonProperty
    SystemName: string;
    @JsonProperty
    BootCodeVer: string;
    @JsonProperty
    FirmwareVer: string;
    @JsonProperty
    FirmwareBank: string;
    @JsonProperty
    ECSLibVer: string;
    @JsonProperty
    RFChannel: string;
    @JsonProperty
    PanID: string;
    @JsonProperty
    LastUpdate: Date;
    @JsonProperty
    TxPeriod: number;
    @JsonProperty
    SendISCommList: boolean;
    @JsonProperty
    RebootRequested: boolean;
    @JsonProperty
    LastRebooted: Date;
    @JsonProperty
    UpdateFirmwareRequested: boolean;
    @JsonProperty
    LastFirmwareUpdated: Date;
    @JsonProperty
    UpdateFirmwarePath: string;
    @JsonProperty
    CommAddress: number;
    @JsonProperty
    QueryInterval: number;
    @JsonProperty
    TimeoutValue: number;
    @JsonProperty
    NumberRetries: number;
    @JsonProperty
    TempMeasureUnit: string;
    @JsonProperty
    BatchIDRequired: boolean;
    @JsonProperty
    IButtonLogInterval: number;
    @JsonProperty
    IButtonAlarmDelay: number;
    @JsonProperty
    DisconnectAlarmDelay: number;
    @JsonProperty
    LogPeriod: number;
    @JsonProperty
    ModelNumberFlags: number;
    @JsonProperty
    ConfigTxPeriod: number;
    @JsonProperty
    ConfigLogPeriod: number;
    @JsonProperty
    ConfigModelNumberFlags: number;
    @JsonProperty
    ViolationCheckPeriod: number;
    @JsonProperty
    ConfigViolationCheckPeriod: number;
    @JsonProperty
    AllowNewISAssociations: boolean;
    @JsonProperty
    ConfigAllowNewISAssociations: boolean;
    @JsonProperty
    RelayEnabled: boolean;
    @JsonProperty
    ConfigRelayEnabled: boolean;
    @JsonProperty
    RelayStatus: boolean;
    @JsonProperty
    ZoneID: string;
    @JsonProperty
    PacketVer: number;
    @JsonProperty
    LastData: Date;
    @JsonProperty({ type: Array, elements: { type: Device, name: 'Device' } })
    Children: Array<Device>;
    @JsonProperty({ type: Array, elements: { type: BatteryLog, name: 'BatteryLog' } })
    BatteryLogs: Array<BatteryLog>;
    @JsonProperty({ type: Array, elements: { type: RxSignalLog, name: 'RxSignalLog' } })
    RxSignalLogs: Array<RxSignalLog>;
    @JsonProperty({ type: Array, elements: { type: TxSignalLog, name: 'TxSignalLog' } })
    TxSignalLogs: Array<TxSignalLog>;
    @JsonProperty({ type: Array, elements: { type: Measurement, name: 'Measurement' } })
    Measurements: Array<Measurement>;
    @JsonProperty({ type: Array, elements: { type: Measurement, name: 'CheckForm' } })
    CheckForms: Array<CheckForm>;
    @JsonProperty({ type: Array, elements: { type: Measurement, name: 'User' } })
    Users: Array<User>;
    @JsonProperty
    Certificates: ClientCerts;
    location: Location;
    log: Array<object>;
    // batteryLog: Array<object>;
    // rxSignalLog: Array<object>;
    // txSignalLog: Array<object>;
    // logStartTime: number;
    // logEndTime: number;
    @JsonProperty
    RSSI: string;
    @JsonProperty
    LastRTUpdate: Date;
    NotValid: boolean;
    Label: string;

    RowState: number = DataRowStates.UNCHANGED;
}
