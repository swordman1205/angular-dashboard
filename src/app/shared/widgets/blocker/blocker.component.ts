import { Component, ElementRef } from '@angular/core';
import { BlockableUI } from 'primeng/api';

@Component({
  selector: 'app-blocker',
  templateUrl: './blocker.component.html',
  styleUrls: ['./blocker.component.scss']
})
export class BlockerComponent implements BlockableUI {

  constructor(private el: ElementRef) { }

  getBlockableElement(): HTMLElement {
    return this.el.nativeElement.children[0];
  }

}
