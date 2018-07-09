import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HeaderSetting } from './header-setting';

@Component({
  selector: 'lib-header-cell',
  template: `
    <ng-container [ngSwitch]="headerSetting.type">
      <ng-container *ngSwitchCase="'input'">
        <mat-form-field>
          <input matInput
              [placeholder]="headerSetting.name"
              [value]="headerValue || ''"
              (input)="changeHeaderValue( headerSetting.id, $event.target.value )" >
          <button matSuffix mat-icon-button (click)="resetOnClick( headerSetting.id )">
            <mat-icon class='clear-select-icon'>clear</mat-icon>
          </button>
        </mat-form-field>
      </ng-container>
      <ng-container *ngSwitchCase="'select'">
        <mat-form-field>
          <mat-select
              [placeholder]="headerSetting.name"
              [value]="headerValue || ''"
              (change)="changeHeaderValue( headerSetting.id, $event.value )" >
            <mat-option *ngFor="let option of selectorOption"
                [value]="option.value">
              {{option.viewValue}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-icon-button (click)="resetOnClick( headerSetting.id )">
          <mat-icon class='clear-select-icon'>clear</mat-icon>
        </button>
      </ng-container>
      <ng-container *ngSwitchCase="'multiSelect-and'">
        <mat-form-field>
          <mat-select
                [placeholder]="headerSetting.name"
                [value]="headerValue"
                (change)="changeHeaderValue( headerSetting.id, $event.value )"
                multiple>
            <mat-option *ngFor="let option of selectorOption"
                [value]="option.value">
              {{option.viewValue}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-icon-button (click)="resetOnClick( headerSetting.id )">
          <mat-icon class='clear-select-icon'>clear</mat-icon>
        </button>
      </ng-container>
      <ng-container *ngSwitchCase="'multiSelect-or'">
        <mat-form-field>
          <mat-select
                [placeholder]="headerSetting.name"
                [value]="headerValue"
                (change)="changeHeaderValue( headerSetting.id, $event.value )"
                multiple>
            <mat-option *ngFor="let option of selectorOption"
                [value]="option.value">
              {{option.viewValue}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-icon-button (click)="resetOnClick( headerSetting.id )">
          <mat-icon class='clear-select-icon'>clear</mat-icon>
        </button>
      </ng-container>
      <ng-container *ngSwitchDefault>
        <span> {{headerSetting.name}} </span>
      </ng-container>
    </ng-container>
  `,
  styles: []
})
export class HeaderCellComponent implements OnInit {

  @Input() headerSetting: HeaderSetting;
  @Input() headerValue: string;
  @Input() selectorOption: { value: string, viewValue: string }[];

  @Output() headerValueChange
    = new EventEmitter<{ columnId: string, value: any }>();

  @Output() reset = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  changeHeaderValue( columnId: string, value ) {
    this.headerValueChange.emit({ columnId: columnId, value: value });
  }

  resetOnClick( columnId: string ) {
    this.reset.emit( columnId );
  }
}
