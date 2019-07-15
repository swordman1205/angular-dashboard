import { ItemTypes } from './../data/constants/itemType';
import { Injectable } from '@angular/core';
import { Location } from '../types/location';
import { IItem } from '../interfaces/item';
import { Asset } from '../types/asset';
import { AssetMeasure } from '../types/assetMeasure';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Events } from '../data/constants/events';
import { DataService } from './data.service';
import { LogService } from './log.service';
import { ITag } from '../interfaces/tag';
import { UserSetting } from '../types/userSetting';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';


@Injectable(({ providedIn: 'root' }))
export class TopologyService {

    timeToCheckStatuses = 60000;
    private _isInitialized = false;
    roots: Array<Location>;
    locationCache = {};         // locationCache[locationId]
    assetCache = {};            // assetCache[assetId] = asset
    assetMeasureCache = {};     // assetMeasureCache[assetMeasureId] = assetMeasure
    searchCollection: any[];
    private message: BehaviorSubject<string>;
    message$: Observable<string>;
    private messageStatusChange: BehaviorSubject<IItem>;
    messageStatusChange$: Observable<IItem>;
    statusInterval;
    private _locationTagsByName: Map<string, ITag>;
    private _assetTagsByName: Map<string, ITag>;
    private _locationTagIdToName: Map<number, string>;
    private _assetTagIdToName: Map<number, string>;
    private _isFilteredByTags = false;
    isFilteredByTags$: Observable<boolean>;
    private isFilteredByTagsSubject: Subject<boolean>;
    private _selectedTags: ITag[];
    private _selectedLocationTagsMap: Map<string, boolean>;
    private _locationTagsTopology: Map<number, Location>;
    private _whiteListAssetsForTags: Map<number, boolean>;
    private _treeModel = [];
    private _treeTagModel = [];
    private _isHierarchicalNavigator = false;

    TAG_PARENT = {
        id: 0,
        type: ItemTypes.TAGS,
        name: 'Tags'
    };

    constructor(private _data: DataService,
        private _logger: LogService,
        private _translate: TranslateService) {
        this.message = new BehaviorSubject('');
        this.message$ = this.message.asObservable();
        this.messageStatusChange = new BehaviorSubject(null);
        this.messageStatusChange$ = this.messageStatusChange.asObservable();
        this.isFilteredByTagsSubject = new Subject<boolean>();
        this.isFilteredByTags$ = this.isFilteredByTagsSubject.asObservable();
    }

    set isInitialized(value: boolean) {
        this._isInitialized = value;
    }

    set selectedTags(value: ITag[]) {
        this._selectedTags = value;
        this._selectedLocationTagsMap = new Map();
        value.forEach(tag => {
            if (tag.type === ItemTypes.LOCATION_TAG) {
                this._selectedLocationTagsMap.set(tag.name, true);
            }
        });
        this.initTopologyByTags();
    }

    get treeModel(): Array<any> {
        return this._treeModel;
    }

    get treeTagModel(): Array<any> {
        return this._treeTagModel;
    }

    set isHierarchicalNavigator(value: boolean) {
        this._isHierarchicalNavigator = value;
        this.message.next(Events.NAVIGATOR_VIEW_CHANGE);
    }

    get isHierarchicalNavigator(): boolean {
        return this._isHierarchicalNavigator;
    }

    get isFilteredByTags(): boolean {
        return this._isFilteredByTags;
    }

    set isFilteredByTags(value: boolean) {
        this._isFilteredByTags = value;
        this.isFilteredByTagsSubject.next(value);
    }

    get selectedTags(): ITag[] {
        return this._selectedTags;
    }

    get locationTagsByName(): Map<string, ITag> {
        return this._locationTagsByName;
    }

    get assetTagsByName(): Map<string, ITag> {
        return this._assetTagsByName;
    }

    get whiteListAssetsForTags(): Map<number, boolean> {
        return this._whiteListAssetsForTags;
    }

    public getLocationTagIdsByLocationTagId(locationTagId: number) {
        const locationTagName = this._locationTagIdToName.get(locationTagId);
        return this.getLocationTagIdsByLocationTagName(locationTagName);
    }

    public getLocationTagIdsByLocationTagName(locationTagName: string) {
        const tag = this._locationTagsByName.get(locationTagName);
        return tag ? tag.ids : [];
    }

    init(data, userSettings: UserSetting) {
        this._locationTagsByName = new Map();
        this._locationTagIdToName = new Map();
        this._assetTagsByName = new Map();
        this._assetTagIdToName = new Map();
        this.createTopologyMaps(data);
        this.createTags(data);
        this.selectedTags = this.parseSelectedTagsFromUserSettings(userSettings);
        this.searchCollection = [];
        this.initSearchCollection();
        clearInterval(this.statusInterval);
        this.statusInterval = setInterval(() => this.getItemsStatuses(), this.timeToCheckStatuses);
    }

    reset() {
        this.isInitialized = false;
        this.roots = undefined;
        this.locationCache = {};
        this.assetCache = {};
        this.assetMeasureCache = {};
        this.searchCollection = [];
        this._locationTagsByName = new Map();
        this._locationTagIdToName = new Map();
        this._assetTagsByName = new Map();
        this._assetTagIdToName = new Map();
        clearInterval(this.statusInterval);
    }


    getCachedLocation(locationID: number): Location {
        return this.locationCache[locationID];
    }

    getItemLocation(itemType: string, itemId: number): IItem {
        let item = null;

        switch (itemType) {
            case (ItemTypes.LOCATION): {
                item = this.locationCache[+itemId];
                break;
            }

            case (ItemTypes.ASSET): {
                const ast: Asset = <Asset>this.assetCache[+itemId];
                item = this.locationCache[+ast.LocationID];
                break;
            }

            case (ItemTypes.ASSET_MEASURE): {
                const asm: AssetMeasure = <AssetMeasure>this.assetMeasureCache[+itemId];
                const ast: Asset = this.assetCache[+asm.AssetID];
                item = this.locationCache[+ast.LocationID];
                break;
            }
        }

        return item;
    }


    getItemParent(itemType, itemId): IItem {
        if (!this._isInitialized) {
            this.raiseError();
            return { id: NaN, type: undefined };
        }

        let parent: IItem;
        switch (itemType) {
            case ItemTypes.LOCATION:
                if (this.isFilteredByTags) {
                    const parentId = (<Location>this.locationCache[itemId]).ParentID;
                    parent = (this._locationTagsTopology.has(parentId) && +itemId !== parentId) ? this._locationTagsTopology.get(parentId) : this.TAG_PARENT;
                } else {
                    parent = this.locationCache[(<Location>(this.locationCache[itemId])).ParentID];
                }
                break;
            case ItemTypes.ASSET:
                if (this.isFilteredByTags) {
                    const assetLocationId = (<Asset>this.assetCache[itemId]).LocationID;
                    if (this._locationTagsTopology.has(assetLocationId)) {
                        parent = this._locationTagsTopology.get(assetLocationId);
                    } else {
                        parent = this.TAG_PARENT;
                    }
                } else {
                    const asset: Asset = <Asset>(this.assetCache[itemId]);
                    parent = asset ? this.locationCache[asset.LocationID] : undefined;
                }
                break;
            case ItemTypes.ASSET_MEASURE:
                parent = this.assetCache[(<AssetMeasure>(this.assetMeasureCache[itemId])).AssetID];
                break;
            case ItemTypes.LOCATION_TAG:
            case ItemTypes.ASSET_TAG:
                parent = this.TAG_PARENT;
                break;
        }

        // if parent id is the same id of the item - this is the root
        // in purpose == instead of ===
        if (parent && parent.id === itemId && parent.type === itemType) {
            parent = undefined;
        }
        return parent;
    }

    getItemChildren(itemType, id) {
        let children = [];

        if (!this._isInitialized) {
            this.raiseError();
            return children;
        }

        switch (itemType) {
            case ItemTypes.LOCATION:
                if (!this._isFilteredByTags) {
                    children = [
                        ...(<Location>this.locationCache[id]).Children,
                        ...(<Location>this.locationCache[id]).Assets,
                        ...(<Location>this.locationCache[id]).IntelliChecks
                    ];
                } else {
                    children = [
                        ...(<Location>this.locationCache[id]).Children.filter(loc => {
                            let locTagFound = false;
                            loc.Tags.forEach(locTag => {
                                if (this._selectedLocationTagsMap.has(locTag.Name)) {
                                    locTagFound = true;
                                }
                            });
                            return (loc.Tags.length > 0 && locTagFound);
                        }),
                        ...((this.locationCache[id]).Assets.filter((ast: Asset) => {
                            return this._whiteListAssetsForTags.size === 0 || this._whiteListAssetsForTags.has(ast.ID);
                        })),
                        ...((this.locationCache[id]).IntelliChecks.filter((ast: Asset) => {
                            return this._whiteListAssetsForTags.size === 0 || this._whiteListAssetsForTags.has(ast.ID);
                        }))
                    ];
                }
                break;
            case ItemTypes.ASSET:
                const asset = <Asset>this.assetCache[id];
                children = asset ? [...asset.Measures] : [];
                break;
            case ItemTypes.ASSET_MEASURE:
                children = [];
                break;
            case ItemTypes.TAGS:
                if (this.isOnlyAssetTags()) {
                    this._whiteListAssetsForTags.forEach((val, assetId) => {
                        children.push(this.assetCache[assetId]);
                    });
                } else {
                    if (this._locationTagsTopology) {
                        this._locationTagsTopology.forEach(location => {
                            if (!this._locationTagsTopology.has(location.ParentID) || location.ParentID === location.ID) {
                                children.push(location);
                            }
                        });
                    }
                }
                break;
        }
        return children;
    }

    getRoots() {
        if (!this._isInitialized) {
            this.raiseError();
            return [];
        }
        return this.roots;
    }

    getItemByTypeAndID(itemType: string, itemID: number): any {
        if (!this._isInitialized) {
            this.raiseError();
            return { id: NaN, type: undefined };
        }

        let cacheItem: any;
        switch (itemType) {
            case ItemTypes.LOCATION:
                cacheItem = <Location>this.locationCache[+itemID];
                break;
            case ItemTypes.ASSET:
                cacheItem = <Asset>this.assetCache[+itemID];
                break;
            case ItemTypes.ASSET_MEASURE:
                cacheItem = <AssetMeasure>this.assetMeasureCache[+itemID];
                break;
            case ItemTypes.LOCATION_TAG:
                console.warn('Check why we here ?!?');
                break;
            case ItemTypes.ASSET_TAG:
                console.warn('Check why we here ?!?');
                break;
            case ItemTypes.TAGS:
                cacheItem = {
                    name: this._translate.instant('SETTINGS.TAGS'),
                    id: NaN,
                    type: ItemTypes.TAGS
                };
                break;
        }
        return cacheItem;
    }

    getItem(item): IItem {
        if (!this._isInitialized) {
            this.raiseError();
            return { id: NaN, type: undefined };
        }

        let cacheItem: IItem;
        switch (item.type) {
            case ItemTypes.LOCATION:
                cacheItem = this.locationCache[+item.id];
                break;
            case ItemTypes.ASSET:
                cacheItem = this.assetCache[+item.id];
                break;
            case ItemTypes.ASSET_MEASURE:
                cacheItem = this.assetMeasureCache[+item.id];
                break;
            case ItemTypes.LOCATION_TAG:
                console.warn('Check why we here ?!?');
                break;
            case ItemTypes.ASSET_TAG:
                console.warn('Check why we here ?!?');
                break;
            case ItemTypes.TAGS:
                cacheItem = {
                    name: this._translate.instant('SETTINGS.TAGS'),
                    id: NaN,
                    type: ItemTypes.TAGS
                };
                break;
        }
        return cacheItem;
    }

    search(name: string) {
        if (!this._isInitialized) {
            this.raiseError();
            return [];
        }

        return _.filter(this.searchCollection, item => item.nameSearch.toLowerCase().indexOf(name.toLowerCase()) > -1);
    }

    private parseSelectedTagsFromUserSettings(userSettings: UserSetting) {
        const tags: ITag[] = [];
        if (userSettings) {
            if (userSettings.LocationTags) {
                userSettings.LocationTags.forEach(locationTag => {
                    this._locationTagsByName.forEach(tag => {
                        if (tag.name === locationTag) {
                            tags.push(tag);
                        }
                    });
                });
            }
            if (userSettings.AssetTags) {
                userSettings.AssetTags.forEach(assetTag => {
                    this._assetTagsByName.forEach(tag => {
                        if (tag.name === assetTag) {
                            tags.push(tag);
                        }
                    });
                });
            }
        }
        return tags;
    }

    private initTopologyByTags() {
        // reset map
        this._locationTagsTopology = new Map();
        this._whiteListAssetsForTags = new Map();

        this.selectedTags.forEach(tag => {
            if (tag.type === ItemTypes.LOCATION_TAG) {
                tag.ids.forEach(id => {
                    this._locationTagsTopology.set(id, Object.assign({}, this.locationCache[id]));
                });
            } else if (tag.type === ItemTypes.ASSET_TAG) {
                tag.ids.forEach(id => {
                    this._whiteListAssetsForTags.set(id, true);
                });
            }
        });
        this.isFilteredByTags = this.selectedTags.length > 0;
        if (this._isFilteredByTags) {
            this.initTreeTagModel();
        }
        this.isFilteredByTags ?
            this.message.next(Events.TOPOLOGY_IS_FILTER_BY_TAGS) :
            this.message.next(Events.TOPOLOGY_IS_NOT_FILTER_BY_TAGS);
    }

    private createLocationTreeObject(item: Location) {
        return {
            'label': item.Name,
            'data': { type: ItemTypes.LOCATION, id: item.ID },
            'expandedIcon': 'fa fa-home',
            'collapsedIcon': 'fa fa-home',
            'children': this.getLocationTagAssets(item),
            'parent': {
                id: item.ID === item.ParentID ? this.TAG_PARENT.id : item.ParentID,
                type: item.ID === item.ParentID ? this.TAG_PARENT.type : ItemTypes.LOCATION
            }
        };
    }

    private createAssetTreeObject(item: Asset | any) {
        return {
            'label': item.Name,
            'data': { type: ItemTypes.ASSET, id: item.ID },
            'expandedIcon': 'fa fa-plug',
            'collapsedIcon': 'fa fa-plug',
            'children': this.createAssetMeasures(item.Measures),
            'parent': this.getItemParent(ItemTypes.ASSET, item.ID)
        };
    }

    private createAssetMeasures(amList: AssetMeasure[]) {
        const arr = [];

        amList.forEach(am => {
            arr.push({
                'label': am.Name,
                'data': { type: ItemTypes.ASSET_MEASURE, id: am.ID },
                'expandedIcon': 'fa fa-tachometer',
                'collapsedIcon': 'fa fa-tachometer',
                'children': [],
                'parent': {
                    id: am.AssetID,
                    type: ItemTypes.ASSET
                }
            });
        });

        return arr;
    }

    private getLocationTagAssets(item: Location) {
        const arr = [];

        item.Assets.forEach(asset => {
            if (this._whiteListAssetsForTags.size === 0 || this._whiteListAssetsForTags.has(asset.ID)) {
                arr.push(this.createAssetTreeObject(asset));
            }
        });

        item.IntelliChecks.forEach(ic => {
            if (this._whiteListAssetsForTags.size === 0 || this._whiteListAssetsForTags.has(ic.ID)) {
                arr.push(this.createAssetTreeObject(ic));
            }
        });

        return arr;
    }

    private initTreeTagModel() {
        this._treeTagModel = [
            {
                'label': 'Tags',
                'data': { ...this.TAG_PARENT },
                'expandedIcon': 'fa fa-home',
                'collapsedIcon': 'fa fa-home',
                'parent': undefined,
                'children': []
            }
        ];

        // -------- Only asset tags
        if (this.isOnlyAssetTags()) {
            let assetIds = [];
            this.selectedTags.forEach(tag => {
                assetIds = [...assetIds, ...tag.ids];
            });
            assetIds = _.uniq(assetIds);
            assetIds.forEach(id => {
                const asset = this.assetCache[id];
                this._treeTagModel[0].children.push({
                    'label': asset.Name,
                    'data': { type: ItemTypes.ASSET, id: asset.ID },
                    'expandedIcon': 'fa fa-plug',
                    'collapsedIcon': 'fa fa-plug',
                    'parent': this.TAG_PARENT
                });
            });
        } else {
            let idsToRemoveFromMap = [];
            const locationTagsTopologyCloned = _.cloneDeep(this._locationTagsTopology);
            // create roots
            locationTagsTopologyCloned.forEach((v, k) => {
                if (!locationTagsTopologyCloned.has(v.ParentID) || v.ID === v.ParentID) {
                    this._treeTagModel[0].children.push(this.createLocationTreeObject(v));
                    idsToRemoveFromMap.push(k);
                }
            });

            idsToRemoveFromMap.forEach(id => {
                locationTagsTopologyCloned.delete(id);
            });

            while (locationTagsTopologyCloned.size > 0) {
                idsToRemoveFromMap = [];

                locationTagsTopologyCloned.forEach(v => {
                    this.addLocationToTreeRecursive(this._treeTagModel, v, idsToRemoveFromMap);
                });

                idsToRemoveFromMap.forEach(id => {
                    locationTagsTopologyCloned.delete(id);
                });
            }
        }
    }

    private addLocationToTreeRecursive(arr, item, idsToRemoveFromMap) {
        let foundFlag = false;

        arr.forEach(node => {
            if (node.data.id === item.ParentID) {
                node.children.push(this.createLocationTreeObject(item));
                idsToRemoveFromMap.push(item.ID);
                foundFlag = true;
            }
        });

        if (!foundFlag) {
            // recursive foreach of the children
            arr.forEach(node => {
                return this.addLocationToTreeRecursive(node.children, item, idsToRemoveFromMap);
            });
        }
    }

    private isOnlyAssetTags() {
        let areThereAssetTags = false;
        let areThereLocationTags = false;

        if (this.selectedTags) {
            this.selectedTags.forEach(tag => {
                if (tag.type === ItemTypes.ASSET_TAG) {
                    areThereAssetTags = true;
                } else if (tag.type === ItemTypes.LOCATION_TAG) {
                    areThereLocationTags = true;
                }
            });
            return (areThereAssetTags && !areThereLocationTags);
        }
    }

    private isHybridTags() {
        let areThereAssetTags = false;
        let areThereLocationTags = false;

        if (this.selectedTags) {
            this.selectedTags.forEach(tag => {
                if (tag.type === ItemTypes.ASSET_TAG) {
                    areThereAssetTags = true;
                } else if (tag.type === ItemTypes.LOCATION_TAG) {
                    areThereLocationTags = true;
                }
            });
            return (areThereAssetTags && areThereLocationTags);
        }
    }

    private createTopologyMaps(roots: Array<Location>) {
        this.roots = roots;
        this._treeModel = this.initTreeModel(roots);
        this.populateMapsRecursivly(roots);
        this.isInitialized = true;
    }

    private createTags(data) {
        data.forEach(location => {
            location.Tags.forEach(tag => {
                const ids = this._locationTagsByName.has(tag.Name) ? [...this._locationTagsByName.get(tag.Name).ids] : [];
                ids.push(tag.LocationID);
                this._locationTagIdToName.set(+tag.ID, tag.Name);
                this._locationTagsByName.set(tag.Name, {
                    type: ItemTypes.LOCATION_TAG,
                    ids,
                    id: tag.ID,
                    name: tag.Name
                });
            });

            location.Assets.forEach(asset => {
                asset.Tags.forEach(tag => {
                    const ids = this._assetTagsByName.has(tag.Name) ? [...this._assetTagsByName.get(tag.Name).ids] : [];
                    ids.push(tag.AssetID);
                    this._assetTagIdToName.set(+tag.ID, tag.Name);
                    this._assetTagsByName.set(tag.Name, {
                        type: ItemTypes.ASSET_TAG,
                        ids,
                        id: tag.ID,
                        name: tag.Name
                    });
                });
            });

            if (location.Children && location.Children.length > 0) {
                this.createTags(location.Children);
            }
        });
    }


    private initTreeModel = (nodes, parent = undefined) => {
        const arr = [];

        nodes.forEach(node => {
            if (node.Assets && node.Children) {
                arr.push({
                    'label': node.Name,
                    'data': { type: ItemTypes.LOCATION, id: node.ID },
                    'expandedIcon': 'fa fa-home',
                    'collapsedIcon': 'fa fa-home',
                    'children': this.initTreeModel([...node.Children, ...node.Assets, ...node.IntelliChecks], node),
                    'parent': parent ? {
                        id: parent.ID,
                        type: ItemTypes.LOCATION
                    } : undefined
                });
            } else if (node.AssetTypeID !== undefined) {
                arr.push({
                    'label': node.Name,
                    'data': { type: ItemTypes.ASSET, id: node.ID },
                    'expandedIcon': 'fa fa-plug',
                    'collapsedIcon': 'fa fa-plug',
                    'children': this.initTreeModel(node.Measures, node),
                    'parent': parent ? {
                        id: parent.ID,
                        type: ItemTypes.LOCATION
                    } : undefined
                });
            } else {
                arr.push({
                    'label': node.Name ?
                        node.Name :
                        `IntelliCheck (${node.PhysicalID.slice(-4)})`,
                    'data': {
                        type: ItemTypes.ASSET_MEASURE,
                        id: node.ID
                    },
                    'expandedIcon': node.Name ? 'fa fa-tachometer' : 'fa fa-thermometer',
                    'collapsedIcon': node.Name ? 'fa fa-tachometer' : 'fa fa-thermometer',
                    'children': this.initTreeModel([], node),
                    'parent': parent ? {
                        id: parent.ID,
                        type: ItemTypes.ASSET
                    } : undefined
                });
            }
        });

        return arr;
    }

    private populateMapsRecursivly(node: Array<Location>) {
        node.forEach(location => {
            location.id = location.ID;
            location.type = ItemTypes.LOCATION;
            location.name = location.Name;
            this.locationCache[location.id] = location;
            location.Assets.forEach(asset => {
                asset.id = asset.ID;
                asset.type = ItemTypes.ASSET;
                asset.name = asset.Name;
                this.assetCache[asset.id] = asset;
                asset.Measures.forEach(am => {
                    am.id = am.ID;
                    am.type = ItemTypes.ASSET_MEASURE;
                    am.name = am.Name;
                    this.assetMeasureCache[am.id] = am;
                });
            });
            this.populateMapsRecursivly(location.Children);
        });
    }

    private initSearchCollection() {
        // Adding locations with their parents to the list
        Object.keys(this.locationCache).forEach(key => {
            const location = this.locationCache[key];
            const locationName = this.locationCache[location.id].name;
            const parentLocation = this.getItemParent(location.type, location.id);
            const name = parentLocation ? `${parentLocation.Name} - ${locationName}` : locationName;

            const item: IItem = {
                id: location.id,
                type: ItemTypes.LOCATION,
                nameSearch: locationName.toLowerCase(),
                name: name
            };
            this.searchCollection.push(item);
        });

        // Adding assets with their locations to the list
        Object.keys(this.assetCache).forEach(key => {
            const asset = this.assetCache[key];
            const name = this.locationCache[asset.LocationID].name;
            const assetName = asset.name;
            const item: IItem = {
                id: asset.id,
                type: ItemTypes.ASSET,
                nameSearch: assetName,
                name: `${name} - ${assetName}`
            };
            this.searchCollection.push(item);
        });
    }

    private raiseError() {
        this.message.next(Events.TOPOLOGY_SERVICE_IS_NOT_INITIALIZED);
    }

    private getItemsStatuses() {
        this._logger.debug('Interval - Updating items statuses');
        this._data.getUserLocations()
            .subscribe(
                data => this.updateNewStates(data),
                error2 => this._logger.error(error2));
    }

    /* Iterate the topology objects, and update new viewstate if necessary */
    private updateNewStates(node: Array<Location>
    ) {
        node.forEach(location => {
            if (this.locationCache[location.id] && this.locationCache[location.id].StatusView !== location.StatusView) {
                this.locationCache[location.id].oldStatusView = this.locationCache[location.id].StatusView;
                this.locationCache[location.id].StatusView = location.StatusView;
                this.messageStatusChange.next(location);
            }
            location.Assets.forEach(asset => {
                if (this.assetCache[asset.id] && this.assetCache[asset.id].StatusView !== asset.StatusView) {
                    this.assetCache[asset.id].oldStatusView = this.assetCache[asset.id].StatusView;
                    this.assetCache[asset.id].StatusView = asset.StatusView;
                    this.messageStatusChange.next(asset);
                }
                asset.Measures.forEach(am => {
                    if (this.assetMeasureCache[am.id] && this.assetMeasureCache[am.id].StatusView !== am.StatusView) {
                        this.assetMeasureCache[am.id].oldStatusView = this.assetMeasureCache[am.id].StatusView;
                        this.assetMeasureCache[am.id].StatusView = am.StatusView;
                        this.messageStatusChange.next(am);
                    }
                });
            });
            this.updateNewStates(location.Children);
        });
    }
}
