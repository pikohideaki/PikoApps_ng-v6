import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { Observable, BehaviorSubject, combineLatest, merge } from 'rxjs';
import { map,
         withLatestFrom,
         debounceTime,
         takeWhile,
         startWith,
         scan } from 'rxjs/operators';

import { ColumnState } from './column-state';
import { filterFunction } from './functions/filter-function';
import { indexOnRawData } from './functions/index-on-raw-data';
import { slice } from './functions/slice';
import { utils } from 'dist/utilities';
import { makeSelectOptions } from './functions/make-select-options';
import { HeaderSetting } from './header-setting';


@Component({
  selector: 'lib-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  @Input() table$: Observable<any[]>;
  @Input() usePagenation: boolean = true;
  @Input() headerSettings: HeaderSetting[];
  @Input() itemsPerPageOptions: number[];
  @Input() itemsPerPageInit: number;

  // transform cells for view
  @Input() transform: (columnName: string, value) => string;

  @Output() cellClicked = new EventEmitter<{
      rowIndex: number,
      rowIndexOnFilter: number,
      columnName: string
    }>();

  @Output() tableFilteredChange = new EventEmitter<any[]>();
  @Output() indiceFilteredChange = new EventEmitter<number[]>();

  private headerValueSource = new BehaviorSubject<Object>({});
  headerValue$: Observable<Object>;

  private tableFiltered$: Observable<any[]>;
  private indiceFiltered$: Observable<number[]>;

  tableFilteredRowSize$: Observable<number>;

  private columnStatesSource = new BehaviorSubject<ColumnState[]>([]);
  columnStates$: Observable<ColumnState[]>;

  private itemsPerPageSource = new BehaviorSubject<number>(100);
  itemsPerPage$: Observable<number>;

  private pageNumberSource = new BehaviorSubject<number>(1);
  pageNumber$: Observable<number>;

  private tableSliced$: Observable<any[]>;

  tableSlicedTransformed$: Observable<any[]>;



  constructor() { }

  ngOnInit() {
    console.assert(
      !this.headerSettings || this.headerSettings.length <= 0,
      'ヘッダ設定が与えられていません。' );

    this.usePagenation = !!this.usePagenation;
    this.transform = ( this.transform || ((_, value) => value) );
    this.headerSettings = ( this.headerSettings || [] );
    this.itemsPerPageOptions = ( this.itemsPerPageOptions || [] );
    // this.columnStatesSource.next( this.columnStates );  // initialize

    this.headerValue$ = this.headerValueSource.asObservable()
                          .pipe( debounceTime(300) );

    // this.columnStates$
    //   = this.tableFiltered$.pipe(
    //         debounceTime( 300 /* ms */ ),
    //         withLatestFrom( this.table$ ),
    //         scan<[any[], any[]], HeaderSetting[]>(
    //           (acc, [tableFiltered, table]) =>
    //               makeSelectOptions(
    //                   acc,
    //                   tableFiltered,
    //                   table ),
    //           this.headerSettings )
    //     );


    this.indiceFiltered$
      = combineLatest(
          this.table$,
          this.columnStates$,
          (table, columnStates) =>
            table.map( (e, i) => ({ val: e, idx: i }) )
                .filter( e => filterFunction( e.val, columnStates ) )
                .map( e => e.idx ) );

    this.tableFiltered$
      = this.indiceFiltered$.pipe(
          withLatestFrom( this.table$ ),
          map( ([indice, table]) => indice.map( idx => table[idx] ) )
        );

    this.tableFilteredRowSize$
      = this.tableFiltered$.pipe( map( e => e.length ) );

    this.itemsPerPage$
      = this.itemsPerPageSource.asObservable()
          .pipe( startWith( this.itemsPerPageInit || 100 ) );

    this.tableSliced$
      = combineLatest(
          this.tableFiltered$,
          this.itemsPerPage$,
          this.pageNumber$,
          (tableFiltered, itemsPerPage, pageNumber) =>
            slice( tableFiltered, itemsPerPage, pageNumber ) );

    this.tableSlicedTransformed$
      = this.tableSliced$.pipe(
          map( table => table.map( line => {
            const transformed = {};
            Object.keys( line ).forEach( key => {
              if ( Array.isArray( line[key] ) ) {
                transformed[key] = line[key].map( e => this.transform( key, e ) ).join(', ');
              } else {
                transformed[key] = this.transform( key, line[key] );
              }
            });
            return transformed;
          }) ));

    this.pageNumber$
      = merge(
          this.pageNumberSource.asObservable(),
          this.indiceFiltered$.pipe( map( _ => 1 ) ) );


    /* subscriptions */
    this.indiceFiltered$
      .pipe( takeWhile( () => this.alive ) )
      .subscribe( val => {
        this.indiceFilteredChange.emit( val );
      });

    this.tableFiltered$
      .pipe( takeWhile( () => this.alive ) )
      .subscribe( val => this.tableFilteredChange.emit( val ) );

    // this.tableFiltered$
    //   .pipe(
    //     withLatestFrom( this.table$ ),
    //     takeWhile( () => this.alive )
    //   )
    //   .subscribe( ([tableFiltered, table]) => {
    //     this.columnStatesSource.next(
    //             makeSelectOptions(
    //                 this.columnStatesSource.getValue(),
    //                 tableFiltered,
    //                 table ) );
    //   });
  }



  ngOnDestroy() {
    this.alive = false;
  }





  itemsPerPageOnChange( value ) {
    this.itemsPerPageSource.next( value );
    this.pageNumberSource.next(0);
  }

  pageNumberOnChange( value ) {
    this.pageNumberSource.next( value );
  }

  cellOnClick(
    rawData,
    rowIndexOnThisPage: number,
    columnName: string,
    columnStates: ColumnState[]
  ) {
    const rowIndexOnFilterData
       = this.itemsPerPageSource.value * this.pageNumberSource.value + rowIndexOnThisPage;
    this.cellClicked.emit({
      rowIndex: indexOnRawData( rawData, rowIndexOnFilterData, columnStates ),
      rowIndexOnFilter: rowIndexOnFilterData,
      columnName: columnName
    });
  }


  changeColumnState( columnName: string, value ) {
    const columnStates = this.columnStatesSource.getValue();
    const column = columnStates.find( e => e.name === columnName );
    if ( column === undefined ) return;
    column.manipState = value;
    this.columnStatesSource.next( columnStates );
  }

  reset( columnName: string ) {
    this.changeColumnState( columnName, undefined );
  }

  resetAll() {
    const columnStates = this.columnStatesSource.getValue();
    columnStates.forEach( e => e.manipState = undefined );
    this.columnStatesSource.next( columnStates );
  }


}
