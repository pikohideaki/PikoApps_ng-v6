import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { Observable, BehaviorSubject, combineLatest, merge } from 'rxjs';
import { map,
         withLatestFrom,
         debounceTime,
         takeWhile,
         startWith
        } from 'rxjs/operators';

import { utils } from 'dist/utilities';

import { HeaderSetting } from './types/header-setting';
import { filterFunction } from './functions/filter-function';
import { indexOnRawData } from './functions/index-on-raw-data';
import { slice } from './functions/slice';
import { makeSelectOptions } from './functions/make-select-options';
import { SelectorOption } from './types/selector-option';
import { TableCell } from './types/table-cell';
import { CellPosition } from './types/cell-position';
import { TableSettings } from './types/table-settings';


@Component({
  selector: 'lib-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  /**
   * number, string, boolean or Array of those are supported for cell type
   */

  @Input() table$!: Observable<TableCell[][]>;
  // @Input() headerSettings!: HeaderSetting[];
  // @Input() itemsPerPageOptions!: number[];
  // @Input() itemsPerPageInit!: number;
  // @Input() usePagenation: boolean = true;
  // @Input() displayNo: boolean = true;
  @Input() tableSettings!: TableSettings;

  @Output() cellClicked = new EventEmitter<CellPosition>();

  @Output() tableFilteredChange = new EventEmitter<TableCell[][]>();
  @Output() indiceFilteredChange = new EventEmitter<number[]>();

  private headerValuesSource = new BehaviorSubject<TableCell[][]>([]);
  private pageNumberSource = new BehaviorSubject<number>(1);
  private itemsPerPageSource = new BehaviorSubject<number>(100);

  private headerValuesAll$: Observable<TableCell[][]>;
  selectorOptionsAll$: Observable<SelectorOption[][]>;

  private tableFiltered$: Observable<TableCell[][]>;
  private indiceFiltered$: Observable<number[]>;
  tableFilteredRowSize$: Observable<number>;
  itemsPerPage$: Observable<number>;
  pageLength$: Observable<number>;
  pageNumber$: Observable<number>;
  private tableSliced$: Observable<TableCell[][]>;
  tableSlicedTransformed$: Observable<string[][]>;



  constructor() { }

  ngOnInit() {
    /* Input check */
    console.assert(
      !this.headerSettings || this.headerSettings.length <= 0,
      'ヘッダ設定が与えられていません。' );

    console.assert(
      !this.itemsPerPageOptions || this.itemsPerPageOptions.length <= 0,
      '表示行数オプションが設定されていません。' );

    console.assert(
      !this.itemsPerPageInit,
      '表示行数初期値が与えられていません。' );

    this.transform = ( this.transform || ((_, value) => value.toString() ) );
    this.itemsPerPageSource.next( this.itemsPerPageInit );

    /* observables */
    this.headerValuesAll$
      = this.headerValuesSource.asObservable()
              .pipe( debounceTime(300) );

    this.indiceFiltered$
      = combineLatest(
          this.table$,
          this.headerValuesAll$,
          (table, headerValues) =>
            table.map( (e, i) => ({ val: e, idx: i }) )
              .filter( e => filterFunction(
                              e.val,
                              this.headerSettings,
                              headerValues ) )
              .map( e => e.idx ) );

    this.tableFiltered$
      = this.indiceFiltered$.pipe(
          withLatestFrom( this.table$ ),
          map( ([indice, table]) => indice.map( idx => table[idx] ) )
        );

    this.selectorOptionsAll$
      = this.tableFiltered$.pipe(
          withLatestFrom( this.table$ ),
          map( ([tableFiltered, table]) =>
                  makeSelectOptions(
                    this.headerSettings,
                    table,
                    tableFiltered ) )
        );

    this.tableFilteredRowSize$
      = this.tableFiltered$.pipe( map( e => e.length ) );

    this.itemsPerPage$
      = this.itemsPerPageSource.asObservable()
          .pipe( startWith( this.itemsPerPageInit || 100 ) );

    this.pageLength$
      = combineLatest(
          this.tableFilteredRowSize$,
          this.itemsPerPage$,
          (length, itemsPerPage) =>
            Math.ceil( length / itemsPerPage ) );

    this.pageNumber$
      = merge(
          this.pageNumberSource.asObservable(),
          this.pageLength$.pipe( map( _ => 1 ) ) );


    this.tableSliced$
      = combineLatest(
          this.itemsPerPage$,
          this.pageNumber$
        ).pipe(
          withLatestFrom( this.tableFiltered$ ),
          map( ([[itemsPerPage, pageNumber], tableFiltered]) =>
            slice( tableFiltered, itemsPerPage, pageNumber ) ),
        );

    // this.tableSlicedTransformed$
    //   = this.tableSliced$.pipe(
    //       map( table => table.map( line => {
            // this.headerSettings.map( (hd, idx) => {
            //   line[ hd.id ];

            // })
            // const transformed = {};
            // utils.object.forEach( line, (elm, key) => {
            //   transformed[key]
            //     = ( Array.isArray( elm )
            //         ? elm.map( e => this.transform( key, e ) ).join(', ')
            //         : this.transform( key, elm ) );
            // });
            // return transformed;
          // }) ));


    /* subscriptions */
    this.indiceFiltered$
      .pipe( takeWhile( () => this.alive ) )
      .subscribe( val => {
        this.indiceFilteredChange.emit( val );
      });

    this.tableFiltered$
      .pipe( takeWhile( () => this.alive ) )
      .subscribe( val => this.tableFilteredChange.emit( val ) );
  }



  ngOnDestroy() {
    this.alive = false;
  }





  itemsPerPageOnChange( value ) {
    this.itemsPerPageSource.next( value );
  }

  pageNumberOnChange( value ) {
    this.pageNumberSource.next( value );
  }

  cellOnClick(
    rawData,
    rowIndexInThisPage: number,
    columnId: string,
    headerValues: object,
  ) {
    const rowIndexInTableFiltered
       = this.itemsPerPageSource.value * this.pageNumberSource.value
            + rowIndexInThisPage;
    this.cellClicked.emit({
      rowIndex: indexOnRawData(
                  rawData,
                  rowIndexInTableFiltered,
                  this.headerSettings,
                  headerValues ),
      rowIndexInTableFiltered: rowIndexInTableFiltered,
      columnId: columnId
    });
  }


  selectorValueOnChange( columnIndex: number, value: TableCell[] ) {
    const selectorValues = this.headerValuesSource.getValue();
    selectorValues[columnIndex] = value;
    this.headerValuesSource.next( selectorValues );
  }

  reset( columnIndex: number ) {
    this.selectorValueOnChange( columnIndex, undefined );
  }

  resetAll() {
    const headerValues = this.headerValuesSource.getValue();
    utils.object.forEach( headerValues,
        (_, key, obj) => obj[key] = undefined );
    this.headerValuesSource.next( headerValues );
  }
}
