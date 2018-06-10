import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

/* angular material */
import { MyOwnCustomMaterialModule } from './my-own-custom-material.module';

/* Feature Modules */
import { ClipboardModule } from 'ngx-clipboard';

import { NotFoundPageComponent } from './not-found-page.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent
  ],
  imports: [
    BrowserModule,
    ClipboardModule,
    AppRoutingModule,
    MyOwnCustomMaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
