import { MenuItem } from 'primeng/api';

export interface IItem {
    id: number;     // is the js property (same as ID)
    type: string;   // is same as $type
    name?: string;   // is same as Name
    $id?: string;
    $type?: string;
    tag?: string;
    HasMapImage?: boolean;
    ID?: number;
    Name?: string;
    MapX?: number;
    MapY?: number;
    children?: Array<IItem>;
    parentId?: number;
    StatusCode?: number;
    StatusView?: number;
    oldStatusView?: number;
    nameSearch?: string;
    view?: string;  // view is the url path of the item board, like: widgets,alarms, tickets, etc...
}

