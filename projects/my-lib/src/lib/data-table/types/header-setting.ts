import { TableCell } from './table-cell';
import { CellPosition } from './cell-position';

export interface HeaderSetting {
  id:        string;
  name:      string;
  align:     'l'|'c'|'r';  // left, center, right
  isButton:  boolean;
  type:      ''|'input'|'select'|'multiSelect-and'|'multiSelect-or';
  transform: (value: TableCell, pos?: CellPosition ) => string;
}
