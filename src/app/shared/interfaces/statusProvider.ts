import { IECSObject } from './ecsObject';
import { Ticket } from '../types/ticket';


export interface IStatusProvider extends IECSObject {
    StatusView: number;
    // status: any[];
    // alarms: any[];
    // tickets: Array<Ticket>;
    // summary: {};
    AckType: number;
    BypassType: number;

}
