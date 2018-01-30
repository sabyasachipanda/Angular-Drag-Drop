import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AddProductComponent } from './add-product/add-product.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'products', component: ProductListComponent },
    { path: 'add', component: AddProductComponent },
    { path: 'drag-drop', component: DragDropComponent },
    { path: '**', component: PagenotfoundComponent }
];
