import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { Observable, BehaviorSubject, combineLatest, merge } from 'rxjs';
import { map, withLatestFrom, debounceTime, takeWhile, startWith } from 'rxjs/operators';

import { ColumnState } from './column-state';
import { filterFunction } from './functions/filterFunction';
import { indexOnRawData } from './functions/indexOnRawData';
import { slice } from './functions/slice';
import { utils } from '../../../../../dist/utilities';


@Component({
  selector: 'lib-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnDestroy {
  private alive: boolean = true;

  @Input() table$: Observable<any[]>;
  @Input() usePagenation: boolean = true;
  @Input() columnStates: ColumnState[];  // initializer
  @Input() itemsPerPageOptions: number[];
  @Input() itemsPerPageInit: number;

  // transform cells for view
  @Input() transform: (columnName: string, value) => string;

  @Output() cellClicked = new EventEmitter<{
      rowIndex: number,
      rowIndexOnFiltered: number,
      columnName: string
    }>();

  @Output() tableFilteredChange = new EventEmitter<any[]>();
  @Output() indiceFilteredChange = new EventEmitter<number[]>();


  private tableFiltered$: Observable<any[]>;
  private indiceFiltered$: Observable<number[]>;

  tableFilteredSize$: Observable<number>;

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
    this.columnStatesSource.next( this.columnStates );  // initialize
    this.transform = ( this.transform || ((_, value) => value) );
    this.columnStates = ( this.columnStates || [] );
    this.itemsPerPageOptions = ( this.itemsPerPageOptions || [] );


    this.columnStates$
      = this.columnStatesSource.asObservable()
          .pipe( debounceTime( 300 /* ms */ ) );


    this.indiceFiltered$
      = combineLatest(
          this.table$,
          this.columnStates$,
          (data, columnStates) =>
            data.map( (e, i) => ({ val: e, idx: i }) )
                .filter( e => filterFunction( e.val, columnStates ) )
                .map( e => e.idx ) );

    this.tableFiltered$
      = this.indiceFiltered$.pipe(
          withLatestFrom( this.table$ ),
          map( ([indice, table]) => indice.map( idx => table[idx] ) )
        );

    this.tableFilteredSize$
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


    this.tableFiltered$
      .pipe(
        withLatestFrom( this.table$ ),
        takeWhile( () => this.alive )
      )
      .subscribe( ([filteredData, table]) => {
        const columnStates = this.columnStatesSource.getValue();
        columnStates.forEach( column => {
          const dataOfColumn         = table        .map( line => line[ column.name ] );
          const dataOfColumnFiltered = filteredData.map( line => line[ column.name ] );
          switch ( column.manip ) {
            case 'select' : {
              const options = utils.array.uniq( dataOfColumn ).sort();
              column.selectOptions
                = options.map( e => ({
                      value: e,
                      viewValue: this.transform( column.name, e )
                          + `(${dataOfColumnFiltered.filter( cell => cell === e ).length})`,
                    }) );
            } break;
            case 'multiSelect-or' :
            case 'multiSelect-and' : {
              const options = utils.array.uniq( [].concat( ...dataOfColumn ) ).sort();
              column.selectOptions
                = options.map( e => ({
                      value: e,
                      viewValue: this.transform( column.name, e )
                          + `(${dataOfColumnFiltered.filter( cell => cell.includes(e) ).length})`,
                    }) );
            } break;
            default: break;
          }
        });
        this.columnStatesSource.next( columnStates );
      });
  }



  ngOnDestroy() {
    this.alive = false;
  }





  itemsPerPageOnChange( value ) {
    this.itemsPerPageSource.next( value );
    this.pageNumberSource.next(0);
  }

  selectedPageIndexOnChange( value ) {
    this.pageNumberSource.next( value );
  }

  cellOnClick(
    rawData,
    rowIndexOnThisPage: number,
    columnName: string,
    columnStates: ColumnState[]
  ) {
    const rowIndexOnFilteredData
       = this.itemsPerPageSource.value * this.pageNumberSource.value + rowIndexOnThisPage;
    this.cellClicked.emit({
      rowIndex: indexOnRawData( rawData, rowIndexOnFilteredData, columnStates ),
      rowIndexOnFiltered: rowIndexOnFilteredData,
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
