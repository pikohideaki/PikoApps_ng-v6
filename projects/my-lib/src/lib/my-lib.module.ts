import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from './angular-material.module';

import { MyLibComponent } from './my-lib.component';

import { AlertDialogComponent } from './alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MessageDialogComponent } from './message-dialog.component';

import { WaitingSpinnerComponent } from './waiting-spinner.component';

import { DataTableComponent } from './data-table/data-table.component';
import { PaginationComponent } from './data-table/pagination/pagination.component';
import { ItemsPerPageComponent } from './data-table/items-per-page.component';
import { HeaderCellComponent } from './data-table/header-cell.component';
import { ObjectDataTableComponent } from './data-table/object-data-table.component';



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
    PaginationComponent,
    ItemsPerPageComponent,
    HeaderCellComponent,
    ObjectDataTableComponent,
  ],
  exports: [
    MyLibComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    MessageDialogComponent,
    WaitingSpinnerComponent,
    DataTableComponent,
    PaginationComponent,
    ItemsPerPageComponent,
    HeaderCellComponent,
    ObjectDataTableComponent,
  ],
})
export class MyLibModule { }
