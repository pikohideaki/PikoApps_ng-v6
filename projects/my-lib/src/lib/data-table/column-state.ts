import { Observable } from 'rxjs';

export interface ColumnState {
  name:            string;
  headerTitle:     string;
  align?:          'l'|'c'|'r';
  isButton?:       boolean;
  manip?:          ''|'input'|'select'|'multiSelect-and'|'multiSelect-or';
  selectOptions$?: Observable<{ value: any, viewValue: string }[]>;  // select, multiSelect-and
  selectOptions?:  { value: any, viewValue: string }[];  // select, multiSelect-and
  manipState?:     any;
}
