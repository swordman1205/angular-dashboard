import { Component } from '@angular/core';
import { TopologyService } from '../../shared/services/topology.service';
import { RouteService } from '../../shared/services/route.service';
import { IItem } from '../../shared/interfaces/item';
import { ItemTypes } from '../../shared/data/constants/itemType';

@Component({
    selector: 'app-spotlight',
    templateUrl: './spotlight.component.html',
    styleUrls: ['./spotlight.component.scss']
})
export class SpotlightComponent {

    name = 'SpotlightComponent';
    selectedItem: IItem;
    filteredItemsSingle: any[];
    itemTypes: any;

    constructor(private _topology: TopologyService, private _route: RouteService) {
        this.itemTypes = ItemTypes;
    }

    filterItemsSingle(event) {
        const query = event.query;
        this.filteredItemsSingle = this._topology.search(query);
    }

    onSelect() {
        const item = { ...this.selectedItem };
        this.selectedItem = { id: 0, type: undefined, name: '' };
        this._route.navigateToItemView(item);
    }

}
