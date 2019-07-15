import {
    Component,
    Input,
    OnChanges,
    OnInit,
    OnDestroy,
    SimpleChanges
} from '@angular/core';
import {TopologyService} from '../../shared/services/topology.service';
import {TreeNode} from 'primeng/api';
import {RouteService} from '../../shared/services/route.service';
import {IItem} from '../../shared/interfaces/item';
import {Subscription} from 'rxjs/index';
import {Events} from '../../shared/data/constants/events';

@Component({
    selector: 'app-navigator-tree',
    templateUrl: './navigator-tree.component.html',
    styleUrls: ['./navigator-tree.component.scss']
})
export class NavigatorTreeComponent implements OnInit, OnChanges, OnDestroy {

    data: TreeNode[] = [];
    selectedNode: TreeNode;
    @Input() selected;
    private routeSubscription$: Subscription;
    private subscriber$: Subscription;

    constructor(private _topologyService: TopologyService, private _routeService: RouteService) {
    }

    ngOnInit() {
        this.data = this._topologyService.isFilteredByTags ? this._topologyService.treeTagModel : this._topologyService.treeModel;
        this.routeSubscription$ = this._routeService.getRoutingSubscription().subscribe(path => {
            this.selectNodeInTree({id: path.itemID, type: path.itemType});
        });

        this.subscriber$ = this._topologyService.message$.subscribe(res => {
            if (res === Events.TOPOLOGY_IS_FILTER_BY_TAGS) {
                this.data = this._topologyService.treeTagModel;
            } else if (res === Events.TOPOLOGY_IS_NOT_FILTER_BY_TAGS) {
                this.data = this._topologyService.treeModel;
            }
        });
    }

    ngOnDestroy() {
        if (this.routeSubscription$) {
            this.routeSubscription$.unsubscribe();
        }
            if (this.subscriber$) {
                this.subscriber$.unsubscribe();
            }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selected &&
            changes.selected.currentValue &&
            changes.selected.currentValue.id &&
            changes.selected.currentValue.type) {
            const itemId = changes.selected.currentValue.id;
            const itemType = changes.selected.currentValue.type;
            this.selectNodeInTree({id: itemId, type: itemType});
        }
    }

    selectNodeInTree(node: IItem) {
        if (this.selectedNode === undefined || this.selectedNode.data.id !== +node.id || this.selectedNode.data.type !== node.type) {
            this.searchSelectExpandNode(node);
        }
    }

    searchSelectExpandNode(item: IItem) {
        this.data.forEach(node => {
            this.searchRecursive(node, item);
        });
    }

    private searchRecursive(node: TreeNode, item: IItem) {
        if (node.data.id === +item.id && node.data.type === item.type) {
            this.expandNodeHierarchy(node);
            this.selectedNode = node;
        } else if (node.children) {
            node.children.forEach(childNode => {
                this.searchRecursive(childNode, item);
            });
        }
    }

    private expandNodeHierarchy(node: TreeNode) {
        node.expanded = true;
        if (node.parent) {
            this.searchNodeInTreeAndExpand(node.parent);
        }
    }

    private searchNodeInTreeAndExpand(item: TreeNode | IItem) {
        this.data.forEach(node => {
            let id, itemType;
            if ((<TreeNode>item).data) {
                id =  (<TreeNode>item).data.id;
                itemType = (<TreeNode>item).data.type;
            } else {
                id = (<IItem>item).id;
                itemType = (<IItem>item).type;
            }

            if (node.data.id === id && node.data.type === itemType) {
                node.expanded = true;
            } else {
                this.searchNodeInTreeAndExpandRecursive(node, item);
            }
        });
    }

    private searchNodeInTreeAndExpandRecursive(node: TreeNode, item: any) {
        if (node.data.id === +item.id && node.data.type === item.type) {
            node.expanded = true;
            this.searchNodeInTreeAndExpand(<IItem>node.parent);
        } else if (node.children) {
            node.children.forEach(childNode => {
                this.searchNodeInTreeAndExpandRecursive(childNode, item);
            });
        }
    }

    expandAll() {
        this.data.forEach(node => {
            this.expandRecursive(node, true);
        });
    }

    collapseAll() {
        this.data.forEach(node => {
            this.expandRecursive(node, false);
        });
    }

    private expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach(childNode => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }

    nodeSelect(event) {
        this._routeService.navigateToPath(
            {
                itemType: event.node.data.type,
                itemID: event.node.data.id,
            }
        );
    }
}
