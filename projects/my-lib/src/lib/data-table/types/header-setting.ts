import { TCell } from './table-cell';
import { CellPosition } from './cell-position';

export class HeaderSetting {
  displayName: string = '';
  align:       'l'|'c'|'r' = 'l';  // left, center, right
  isButton:    boolean = false;
  type:        ''|'input'|'select'|'multiSelect-and'|'multiSelect-or' = '';
  transform: (value: TCell, pos?: CellPosition ) => string
    = ((_, value) => value.toString());

  constructor() {}
}
