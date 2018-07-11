import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TCell } from './types/table-cell';
import { SelectorOption } from './types/selector-option';

@Component({
  selector: 'lib-header-cell',
  template: `
    <ng-container [ngSwitch]="header.settings.type">
      <ng-container *ngSwitchCase="'input'">
        <mat-form-field>
          <input matInput
              [placeholder]="header.settings.name"
              [value]="data.selectorValue || ''"
              (input)="changeHeaderValue( header.settings.id, $event.target.value )" >
          <button matSuffix mat-icon-button (click)="resetOnClick( header.settings.id )">
            <mat-icon class='clear-select-icon'>clear</mat-icon>
          </button>
        </mat-form-field>
      </ng-container>
      <ng-container *ngSwitchCase="'select'">
        <mat-form-field>
          <mat-select
              [placeholder]="header.settings.name"
              [value]="data.headerValue || ''"
              (change)="changeHeaderValue( header.settings.id, $event.value )" >
            <mat-option *ngFor="let option of data.selectorOptions"
                [value]="option.value">
              {{option.viewValue}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-icon-button (click)="resetOnClick( header.settings.id )">
          <mat-icon class='clear-select-icon'>clear</mat-icon>
        </button>
      </ng-container>
      <ng-container *ngSwitchCase="'multiSelect-and'">
        <mat-form-field>
          <mat-select
                [placeholder]="header.settings.name"
                [value]="data.selectorValue"
                (change)="changeHeaderValue( header.settings.id, $event.value )"
                multiple>
            <mat-option *ngFor="let option of data.selectorOptions"
                [value]="option.value">
              {{option.viewValue}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-icon-button (click)="resetOnClick( header.settings.id )">
          <mat-icon class='clear-select-icon'>clear</mat-icon>
        </button>
      </ng-container>
      <ng-container *ngSwitchCase="'multiSelect-or'">
        <mat-form-field>
          <mat-select
                [placeholder]="header.settings.name"
                [value]="data.selectorValue"
                (change)="changeHeaderValue( header.settings.id, $event.value )"
                multiple>
            <mat-option *ngFor="let option of data.selectorOptions"
                [value]="option.value">
              {{option.viewValue}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-icon-button (click)="resetOnClick( header.settings.id )">
          <mat-icon class='clear-select-icon'>clear</mat-icon>
        </button>
      </ng-container>
      <ng-container *ngSwitchDefault>
        <span> {{header.settings.name}} </span>
      </ng-container>
    </ng-container>
  `,
  styles: []
})
export class HeaderCellComponent implements OnInit {

  @Input() selectorValue: TCell[];
  @Input() selectorOptions: SelectorOption[];

  @Output() selectorValueChange
    = new EventEmitter<{ columnIndex: number, value: TCell[] }>();


  constructor() { }

  ngOnInit() {
  }

  changeHeaderValue( columnIndex: number, value: TCell[] ) {
    this.selectorValueChange.emit({ columnIndex: columnIndex, value: value });
  }

  resetOnClick( columnIndex: number ) {
    this.changeHeaderValue( columnIndex, undefined );
  }
}
