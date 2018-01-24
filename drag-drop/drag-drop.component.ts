import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.css', '../../../node_modules/ng-drag-drop/style.css']
})

export class DragDropComponent implements OnInit {

  items = [
    { name: 'Apple', type: 'fruit', class: 'green' },
    { name: 'Carrot', type: 'vegetable', class: 'orange' },
    { name: 'Orange', type: 'fruit', class: 'red' }];

  summarySource = [
    { name: 'Apple', type: 'fruit', class: 'green' },
    { name: 'Carrot', type: 'vegetable', class: 'orange' },
    { name: 'Orange', type: 'fruit', class: 'red' }];

  droppedGreenItems = [];
  droppedOrangeItems = [];
  droppedRedItems = [];
  index: number;
  sourceClass: string;

  onItemDrop(e: any) {
    // Get the dropped data here
    alert(e.dragData.class);
    // alert(this.index = this.items.indexOf(e.dragData));
    alert(e.nativeEvent.currentTarget.className);

    if (e.dragData.class === 'green') {
      // alert('g');
      this.droppedGreenItems.push(e.dragData);
    } else if (e.dragData.class === 'orange') {
      // alert('o');
      this.droppedOrangeItems.push(e.dragData);
    } else { this.droppedRedItems.push(e.dragData); }
    this.items.splice(this.index, 1);
  }
  constructor() { }

  onGreenItemDrop(e: any) {
    this.droppedGreenItems.push(e.dragData);
    this.popArray(e);
  }
  onOrangeItemDrop(e: any) {
    this.popArray(e);
    this.droppedOrangeItems.push(e.dragData);
  }
  onRedItemDrop(e: any) {
    this.popArray(e);
    this.droppedRedItems.push(e.dragData);
  }

  popArray(e: any) {
    const srcClass = e.nativeEvent.srcElement.className.split(' ')[1];
    if (this.sourceClass === 'green') {
      this.index = this.droppedGreenItems.indexOf(e.dragData);
      this.droppedGreenItems.splice(this.index, 1);
    } else if (this.sourceClass === 'orange') {
      this.index = this.droppedOrangeItems.indexOf(e.dragData);
      this.droppedOrangeItems.splice(this.index, 1);
    } else if (this.sourceClass === 'red') {
      this.index = this.droppedRedItems.indexOf(e.dragData);
      this.droppedRedItems.splice(this.index, 1);
    } else {
      this.index = this.items.indexOf(e.dragData);
      this.items.splice(this.index, 1);
    }
  }

  OnDrag(e: any) {
    this.sourceClass = e.srcElement.parentElement.className.split(' ')[1];
  }

  filterItems(e: any) {
    const filterClass = e.currentTarget.className.split(' ')[2];
    // Stops event propagation
    if (!e) {
      e = window.event;
    }
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    this.items = this.summarySource.filter(item => item.class === filterClass);
  }

  ngOnInit() {
  }
  isDropAllowed = (dragData: any) => {
    return true;
  }

}
