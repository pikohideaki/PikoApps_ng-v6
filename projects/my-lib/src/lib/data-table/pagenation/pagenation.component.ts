import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { utils } from 'dist/utilities';


@Component({
  selector: 'lib-pagenation',
  templateUrl: './pagenation.component.html',
  styleUrls: ['./pagenation.component.css']
})
export class PagenationComponent implements OnInit {


  @Input()  itemsPerPage$: Observable<number>;
  @Input()  rowSize$: Observable<number>;
  @Input()  pageNumber$: Observable<number>;
  @Output() pageNumberChange = new EventEmitter<number>();

  rangeStart$: Observable<number>;
  rangeEnd$:   Observable<number>;
  pageLength$: Observable<number>;
  pageIndice$: Observable<number[]>;


  constructor(
  ) {
  }

  ngOnInit() {
    this.pageLength$ = combineLatest(
        this.itemsPerPage$,
        this.rowSize$,
        (itemsPerPage, rowSize) => Math.ceil( rowSize / itemsPerPage ) );

    this.pageIndice$
      = this.pageLength$.pipe( map( len => utils.number.seq0( len ) ) );

    this.rangeStart$ = combineLatest(
        this.itemsPerPage$,
        this.pageNumber$,
        (itemsPerPage, pageNumber) =>
          itemsPerPage * pageNumber + 1 );

    this.rangeEnd$ = combineLatest(
        this.itemsPerPage$,
        this.pageNumber$,
        this.rowSize$,
        (itemsPerPage, pageNumber, rowSize) =>
          Math.min( rowSize, (itemsPerPage * (pageNumber + 1)) ) );
  }

  setPageNumber( pageNumber: number ) {
    this.pageNumberChange.emit( pageNumber );
  }
}
