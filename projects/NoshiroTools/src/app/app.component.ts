import { Component } from '@angular/core';

import { Observable, of } from 'rxjs';
import { TableSettings } from 'my-lib/lib/data-table/types/table-settings';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  table$: Observable<(string|number)[][]>;
  settings: TableSettings = {
    headerSettings: [
      { displayName: 'No',     },
      { displayName: 'name1',  },
      { displayName: 'name2',  },
    ],
    itemsPerPageInit: 50,
    itemsPerPageOptions: [25, 50],
  };

  constructor() {
    this.table$ = of( [
      [11, 'aaa', 'bbb'],
      [12, 'ccc', 'ddd'],
      [13, 'eee', 'fff'],
    ] );

    this.table$.subscribe( console.log );
  }
}
