import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { TCell } from './types/table-cell';
import { TableSettings } from './types/table-settings';
import { CellPosition } from './types/cell-position';


@Component({
  selector: 'lib-object-data-table',
  template: `
    <lib-data-table
        [table$]="table$"
      >
    </lib-data-table>
  `,
  styles: []
})
export class ObjectDataTableComponent implements OnInit {

  @Input() table$!: Observable<TCell[][]>;
  @Input() tableSettings!: TableSettings;

  @Output() cellClicked = new EventEmitter<CellPosition>();

  @Output() tableFilteredChange = new EventEmitter<TCell[][]>();
  @Output() indiceFilteredChange = new EventEmitter<number[]>();

  // private headerValuesSource = new BehaviorSubject<TableCell[]>([]);
  // private pageNumberSource = new BehaviorSubject<number>(1);
  // private itemsPerPageSource = new BehaviorSubject<number>(100);


  constructor() { }

  ngOnInit() {
  }

}
