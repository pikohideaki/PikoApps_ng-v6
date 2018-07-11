import { TCell } from './table-cell';
import { CellPosition } from './cell-position';

export class HeaderSetting {
  displayName: string = '';
  filterType:  ''|'input'|'select'|'multiSelect-and'|'multiSelect-or' = '';
  align:       'l'|'c'|'r' = 'l';  // left, center, right
  isButton:    boolean = false;
  isLink:      boolean = false;
  enableSort:  boolean = true;

  sortBy: (value: TCell, pos?: CellPosition) => number
    = ((_, value) => Number(value));

  transform: (value: TCell, pos?: CellPosition) => string
    = ((_, value) => value.toString());

  constructor() {}
}
