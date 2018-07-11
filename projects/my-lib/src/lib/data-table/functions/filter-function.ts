import { utils } from 'dist/utilities';
import { HeaderSetting } from '../types/header-setting';
import { TCell } from '../types/table-cell';


export const filterFunction = (
  tableLine: TCell[],
  headerSettings: HeaderSetting[],
  headerValuesAll: TCell[],
): boolean => {

  for ( let colIndex = 0; colIndex < headerSettings.length; ++colIndex ) {
    const headerValue = headerValuesAll[ colIndex ];
    if ( headerValue === undefined ) continue;

    const header = headerSettings[ colIndex ];
    const cell = tableLine[ colIndex ];

    /* no mismatches => return true; 1 or more mismatches => return false */
    switch ( header.filterType ) {
      case 'input' :
        if ( typeof cell !== 'string' ) return false;
        if ( typeof headerValue !== 'string' ) return false;
        if ( !utils.string.submatch(
                cell, headerValue, true ) ) return false;
        break;

      case 'select' :
        if ( tableLine[ header.displayName ] !== headerValuesAll[ header.memberName ] ) return false;
        break;

      case 'multiSelect-and' :
        if ( !!headerValuesAll[ header.memberName ] && headerValuesAll[ header.memberName ].length > 0 ) {
          const cellValue = tableLine[ header.displayName ];
          if ( !utils.array.isSubset( headerValuesAll[ header.memberName ], cellValue ) ) return false;
          /* for any e \in column.manipState, e \in cellValue */
        }
        break;

      case 'multiSelect-or' :
        /* column.manipStateの初期状態はundefinedなのでfilteringされなくなっており，
            column.manipStateの全選択初期化は不要になっている */
        if ( !!headerValuesAll[ header.memberName ] && headerValuesAll[ header.memberName ].length > 0 ) {
          const cellValue = tableLine[ header.displayName ];
          if ( utils.array.setIntersection( headerValuesAll[ header.memberName ], cellValue ).length === 0 ) return false;
          /* for some e \in column.manipState, e \in cellValue */
        }
        break;

      default :
        break;
    }

  }

  return true;
};

