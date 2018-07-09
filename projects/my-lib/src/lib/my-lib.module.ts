import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyLibComponent } from './my-lib.component';

import { AlertDialogComponent } from './alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MessageDialogComponent } from './message-dialog.component';

import { WaitingSpinnerComponent } from './waiting-spinner.component';

import { AngularMaterialModule } from './angular-material.module';

import { DataTableComponent } from './data-table/data-table.component';
import { PagenationComponent } from './data-table/pagenation/pagenation.component';
import { ItemsPerPageComponent } from './data-table/items-per-page.component';
import { HeaderCellComponent } from './data-table/header-cell.component';



@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
  ],
  declarations: [
    MyLibComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    MessageDialogComponent,
    WaitingSpinnerComponent,
    DataTableComponent,
    PagenationComponent,
    ItemsPerPageComponent,
    HeaderCellComponent,
  ],
  exports: [
    MyLibComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    MessageDialogComponent,
    WaitingSpinnerComponent,
  ],
})
export class MyLibModule { }
