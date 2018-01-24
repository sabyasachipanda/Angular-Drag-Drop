import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropComponent } from './drag-drop.component';
import { NgDragDropModule } from 'ng-drag-drop';

@NgModule({
    declarations: [DragDropComponent],
    imports: [BrowserModule, NgDragDropModule.forRoot()],
    bootstrap: [DragDropComponent]
})

export class DragDropModule { }
