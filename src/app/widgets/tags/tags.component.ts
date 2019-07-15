import { Component } from '@angular/core';
import { TopologyService } from '../../shared/services/topology.service';
import { LogService } from '../../shared/services/log.service';
import { ITag } from '../../shared/interfaces/tag';
import * as _ from 'lodash';
import { ItemTypes } from '../../shared/data/constants/itemType';

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
    get selectedTags(): ITag[] {
        this._selectedTags = [...this.selectedLocationTags, ...this.selectedAssetTags];
        return this._selectedTags;
    }

    get availableAssetTags(): ITag[] {
        return this._availableAssetTags;
    }

    get availableLocationTags(): ITag[] {
        return this._availableLocationTags;
    }

    get selectedAssetTags(): ITag[] {
        return this._selectedAssetTags;
    }

    get selectedLocationTags(): ITag[] {
        return this._selectedLocationTags;
    }

    name = 'TagsComponent';
    private _availableLocationTags: ITag[];
    private _availableAssetTags: ITag[];
    private _selectedLocationTags: ITag[];
    private _selectedAssetTags: ITag[];
    private draggedLocationTag: ITag;
    private draggedAssetTag: ITag;
    private _selectedTags: ITag[];

    constructor(private _topology: TopologyService,
        private _logger: LogService) {
    }

    init() {
        setTimeout(() => {
            this._selectedLocationTags = this._topology.selectedTags.filter(tag => tag.type === ItemTypes.LOCATION_TAG);
            this._selectedAssetTags = this._topology.selectedTags.filter(tag => tag.type === ItemTypes.ASSET_TAG);

            this._availableLocationTags = Array.from(this._topology.locationTagsByName.values());

            this._selectedLocationTags.forEach(selectedTag => {
                this._availableLocationTags = this._availableLocationTags.filter(tag => selectedTag.name !== tag.name);
            });

            this._availableAssetTags = Array.from(this._topology.assetTagsByName.values());

            this._selectedAssetTags.forEach(selectedTag => {
                this._availableAssetTags = this._availableAssetTags.filter(tag => selectedTag.name !== tag.name);
            });
        });
    }

    dragLocationTagStart(event, tag: ITag) {
        this.draggedLocationTag = tag;
    }

    dragLocationTagEnd(event) {
        this.draggedLocationTag = null;
    }

    dropLocationTag(event) {
        if (this.draggedLocationTag) {
            this._selectedLocationTags = [...this._selectedLocationTags, this.draggedLocationTag];
            this._availableLocationTags = _.without(this._availableLocationTags, this.draggedLocationTag);
            this.draggedLocationTag = null;
        }
    }

    onRemoveLocationTag(tag) {
        this._selectedLocationTags = _.without(this._selectedLocationTags, tag);
        this._availableLocationTags = [...this._availableLocationTags, tag];
    }

    dragAssetTagStart(event, tag: ITag) {
        this.draggedAssetTag = tag;
    }

    dragAssetTagEnd(event) {
        this.draggedAssetTag = null;
    }

    dropAssetTag(event) {
        if (this.draggedAssetTag) {
            this._selectedAssetTags = [...this._selectedAssetTags, this.draggedAssetTag];
            this._availableAssetTags = _.without(this._availableAssetTags, this.draggedAssetTag);
            this.draggedAssetTag = null;
        }
    }

    onRemoveAssetTag(tag) {
        this._selectedAssetTags = _.without(this._selectedAssetTags, tag);
        this._availableAssetTags = [...this._availableAssetTags, tag];
    }
}
