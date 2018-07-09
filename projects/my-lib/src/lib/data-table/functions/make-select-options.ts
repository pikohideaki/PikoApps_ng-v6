import { utils } from 'dist/utilities';
import { HeaderSetting } from '../header-setting';
import { SelectorOption } from '../selector-option';


export const makeSelectOptions = (
  headerSettings: HeaderSetting[],
  table: any[],
  tableFiltered: any[],
): SelectorOption => {
  const selectorOptions = {};

  headerSettings.forEach( header => {
    const col         = table        .map( line => line[ header.id ] );
    const colFiltered = tableFiltered.map( line => line[ header.id ] );
    switch ( header.type ) {
      case 'select' : {
        const options = utils.array.uniq( col ).sort();
        selectorOptions[ header.id ]
          = options.map( e => ({
                value: e,
                viewValue: this.transform( header.name, e )
                    + `(${colFiltered.filter( cell => cell === e ).length})`,
              }) );
      } break;
      case 'multiSelect-or' :
      case 'multiSelect-and' : {
        const options = utils.array.uniq( [].concat( ...col ) ).sort();
        selectorOptions[ header.id ]
          = options.map( e => ({
                value: e,
                viewValue: this.transform( header.name, e )
                    + `(${colFiltered.filter( cell => cell.includes(e) ).length})`,
              }) );
      } break;
      default: break;
    }
  });

  return selectorOptions;
};
