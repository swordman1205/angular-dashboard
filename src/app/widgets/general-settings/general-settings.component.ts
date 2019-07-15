import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {TagsComponent} from '../tags/tags.component';
import {TopologyService} from '../../shared/services/topology.service';
import {DataService} from '../../shared/services/data.service';

@Component({
    selector: 'app-general-settings',
    templateUrl: './general-settings.component.html',
    styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent {

    name = 'GeneralSettingsComponent';
    @ViewChild(TagsComponent)
    private tagsComponent: TagsComponent;
    @Output() notifyShouldClose = new EventEmitter<boolean>();
    isNavigatorTree = false;

    constructor(private _topology: TopologyService, private _data: DataService) {
    }

    init() {
        this.tagsComponent.init();
    }

    onSave() {
        this._data.saveTags(
            this.tagsComponent.selectedLocationTags.map(tag => tag.name),
            this.tagsComponent.selectedAssetTags.map(tag => tag.name)
        ).subscribe(res => {
            this._topology.selectedTags = this.tagsComponent.selectedTags;
            this.notifyShouldClose.emit(true);
        });
    }

    onCancel() {
        this.notifyShouldClose.emit(true);
    }

    onNavigatorToggleChange(e) {
        this._topology.isHierarchicalNavigator = e.checked;
    }
}
