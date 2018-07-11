import { utils } from 'dist/utilities';
import { HeaderSetting } from '../types/header-setting';
import { SelectorOption } from '../types/selector-option';
import { TCell } from '../types/table-cell';


export const makeSelectOptions = (
  headerSettings: HeaderSetting[],
  table: TCell[][],
  tableFiltered: TCell[][],
): SelectorOption[][] => {
  const selectorOptions: SelectorOption[][] = [];

  headerSettings.forEach( (header, colIndex) => {
    const col         = table        .map( line => line[ colIndex ] );
    const colFiltered = tableFiltered.map( line => line[ colIndex ] );
    switch ( header.type ) {
      case 'select' : {
        const options = utils.array.uniq( col ).sort();
        selectorOptions[ colIndex ]
          = options.map( e => ({
                value: e,
                viewValue: this.transform( header.displayName, e )
                    + `(${colFiltered.filter( cell => cell === e ).length})`,
              }) );
      } break;
      case 'multiSelect-or' :
      case 'multiSelect-and' : {
        const options = utils.array.uniq( [].concat( ...col ) ).sort();
        selectorOptions[ colIndex ]
          = options.map( e => ({
                value: e,
                viewValue: this.transform( header.displayName, e )
                    + `(${colFirltered.filter( cell => cell.includes(e) ).length})`,
              }) );
      } break;
      default: break;
    }
  });

  return selectorOptions;
};
