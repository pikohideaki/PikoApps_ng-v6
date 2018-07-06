export interface HeaderSetting {
  name:     string;
  title:    string;
  align:    'l'|'c'|'r';
  isButton: boolean;
  manip:    ''|'input'|'select'|'multiSelect-and'|'multiSelect-or';
}
