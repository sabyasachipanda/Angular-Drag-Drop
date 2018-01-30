import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { Router } from '@angular/router/src/router';
import { appRoutes } from './app.routes';
import { HomeComponent } from './home/home.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { ProductsService } from './service/products.service';
import { ProductListModule } from './product-list/product-list.module';
import { ProductDetailsModule } from './product-details/product-details.module';
import { AddProductModule } from './add-product/add-product.module';
import { DragDropModule } from './drag-drop/drag-drop.module';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PagenotfoundComponent,
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(appRoutes),
    FormsModule, ProductListModule, ProductDetailsModule, AddProductModule, DragDropModule
  ],
  providers: [ProductsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
