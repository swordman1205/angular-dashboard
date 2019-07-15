import { Component, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuItem } from 'primeng/primeng';
import { MainComponent } from '../../main/main.component';
import { faHome, faPlug, faTag, faTags, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { faTachometerAltFast } from '@fortawesome/pro-light-svg-icons';

@Component({
    selector: 'app-navigator-menu',
    templateUrl: './navigator-menu.component.html',
    styleUrls: ['./navigator-menu.component.scss'],
    animations: [
        trigger('children', [
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            state('visible', style({
                height: '*'
            })),
            state('hidden', style({
                height: '0px'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class NavigatorMenuComponent {

    name = 'NavigatorMenuComponent';
    @Input() item: MenuItem;
    @Input() root: boolean;
    @Input() visible: boolean;
    activeIndex: number;
    faHome = faHome;
    faPlug = faPlug;
    faTag = faTag;
    faTags = faTags;
    faTachometerAlt = faTachometerAlt;
    faTachometerAltFast = faTachometerAltFast;

    constructor(public main: MainComponent) {
    }

    onMouseEnter(index: number) {
        if (this.root && this.main.menuHoverActive && (this.main.isHorizontal() || this.main.isSlim())) {
            this.activeIndex = index;
        }
    }

    isActive(index: number): boolean {
        return this.activeIndex === index;
    }
}
