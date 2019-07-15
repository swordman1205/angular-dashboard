export class EcsEvent {
    eventName: string;
    data: any;

    constructor(eventName: string, data?: any) {
        this.eventName = eventName;
        this.data = data;
    }
}
