import { utils } from 'dist/utilities';
import { HeaderSetting } from '../types/header-setting';
import { SelectorOption } from '../types/selector-option';
import { TCell, TCellPrimitive } from '../types/table-cell';


export const makeSelectOptions = (
  table: TCell[][],
  tableFiltered: TCell[][],
  headerSettings: HeaderSetting[],
): SelectorOption[][] => {

  const selectorOptions: SelectorOption[][]
     = headerSettings.map( _ => [] );  // initialize

  if ( !table || table.length === 0 ) {
    return selectorOptions;
  }


  for ( let colIndex = 0; colIndex < headerSettings.length; ++colIndex ) {
    const col         = table        .map( line => line[ colIndex ] );
    const colFiltered = tableFiltered.map( line => line[ colIndex ] );

    const header = headerSettings[ colIndex ];

    if ( !['select',
          'multiSelect-or',
          'multiSelect-and'].includes( header.filterType ) ) {
      selectorOptions[ colIndex ] = [];
      break;
    }

    const firstCell = table[0][ colIndex ];

    if ( !Array.isArray( firstCell ) ) {
      selectorOptions[ colIndex ]
        = utils.array.uniq( col )
            .sort( (a, b) => header.sortBy(a) - header.sortBy(b) )
            .map( e => ({
              value: e,
              viewValue: this.transform( header.displayName, e )
                  + `(${colFiltered.filter( (cell: TCellPrimitive) => cell === e ).length})`,
            }) );
    } else {
      selectorOptions[ colIndex ]
        = utils.array.uniq( [].concat( ...col ) )
            .sort( (a, b) => header.sortBy(a) - header.sortBy(b) )
            .map( e => ({
              value: e,
              viewValue: this.transform( header.displayName, e )
                + `(${colFiltered.filter( (cell: TCellPrimitive[]) => cell.includes(e) ).length})`,
            }) );
    }
  }

  return selectorOptions;
};
