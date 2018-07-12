import { utils } from '../../../utilities';
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

    if ( ![ 'select',
            'multiSelect-or',
            'multiSelect-and',
          ].includes( header.filterType )
    ) {
      selectorOptions[ colIndex ] = [];
      break;
    }

    if ( !Array.isArray( col[0] ) ) {
      selectorOptions[ colIndex ]
        = utils.array.uniq( col )
            .sort( header.compareFn )
            .map( e => ({
              value: e,
              viewValue: header.transform(e)
                  + `(${colFiltered.filter( (cell: TCellPrimitive) => cell === e ).length})`,
            }) );
    } else {
      selectorOptions[ colIndex ]
        = utils.array.uniq( [].concat( ...col ) )
            .sort( header.compareFn )
            .map( e => ({
              value: e,
              viewValue: header.transform(e)
                + `(${colFiltered.filter( (cell: TCellPrimitive[]) => cell.includes(e) ).length})`,
            }) );
    }
  }

  return selectorOptions;
};
