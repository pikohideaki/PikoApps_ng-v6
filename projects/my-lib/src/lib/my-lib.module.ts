import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyLibComponent } from './my-lib.component';

import { AlertDialogComponent } from './alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MessageDialogComponent } from './message-dialog.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WaitingSpinnerComponent } from './waiting-spinner.component';



@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    MyLibComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    MessageDialogComponent,
    WaitingSpinnerComponent,
  ],
  exports: [MyLibComponent]
})
export class MyLibModule { }
