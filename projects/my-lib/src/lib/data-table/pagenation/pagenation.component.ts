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

  @Input()  rowSize$: Observable<number>;
  @Input()  itemsPerPage$: Observable<number>;
  @Input()  pageLength$: Observable<number>;
  @Input()  pageNumber$: Observable<number>;
  @Output() pageNumberChange = new EventEmitter<number>();

  rangeStart$: Observable<number>;
  rangeEnd$:   Observable<number>;
  pageIndice$: Observable<number[]>;


  constructor(
  ) {
  }

  ngOnInit() {
    this.pageIndice$
      = this.pageLength$.pipe( map( len => utils.number.numSeq( 1, len ) ) );

    this.rangeStart$ = combineLatest(
        this.itemsPerPage$,
        this.pageNumber$,
        (itemsPerPage, pageNumber) =>
          itemsPerPage * (pageNumber - 1) + 1 );

    this.rangeEnd$ = combineLatest(
        this.itemsPerPage$,
        this.pageNumber$,
        this.rowSize$,
        (itemsPerPage, pageNumber, rowSize) =>
          Math.min( rowSize, (itemsPerPage * pageNumber) ) );
  }

  setPageNumber( pageNumber: number ) {
    this.pageNumberChange.emit( pageNumber );
  }
}
