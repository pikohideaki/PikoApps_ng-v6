import { utils } from 'dist/utilities';
import { HeaderSetting } from '../types/header-setting';
import { SelectorOption, SelectorOptionMap } from '../types/selector-option';


export const makeSelectOptions = (
  headerSettings: HeaderSetting[],
  table: any[],
  tableFiltered: any[],
): SelectorOptionMap => {
  const selectorOptions: SelectorOptionMap = {};

  headerSettings.forEach( header => {
    const col         = table        .map( line => line[ header.memberName ] );
    const colFiltered = tableFiltered.map( line => line[ header.memberName ] );
    switch ( header.type ) {
      case 'select' : {
        const options = utils.array.uniq( col ).sort();
        selectorOptions[ header.memberName ]
          = options.map( e => ({
                value: e,
                viewValue: this.transform( header.displayName, e )
                    + `(${colFiltered.filter( cell => cell === e ).length})`,
              }) );
      } break;
      case 'multiSelect-or' :
      case 'multiSelect-and' : {
        const options = utils.array.uniq( [].concat( ...col ) ).sort();
        selectorOptions[ header.memberName ]
          = options.map( e => ({
                value: e,
                viewValue: this.transform( header.displayName, e )
                    + `(${colFiltered.filter( cell => cell.includes(e) ).length})`,
              }) );
      } break;
      default: break;
    }
  });

  return selectorOptions;
};
