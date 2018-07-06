export interface HeaderSetting {
  columnId: string;
  name:     string;
  align:    'l'|'c'|'r';
  isButton: boolean;
  type:     ''|'input'|'select'|'multiSelect-and'|'multiSelect-or';
}
