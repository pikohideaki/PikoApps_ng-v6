import { utils } from 'dist/utilities';
import { HeaderSetting } from '../types/header-setting';


export const filterFunction = (
    lineOfData: any,
    headerSettings: HeaderSetting[],
    headerValues: object,
): boolean => {
  const validSettings
    = headerSettings.filter( header =>
          headerValues[header.id] !== undefined );

  for ( const header of validSettings ) {
    /* no mismatches => return true; 1 or more mismatches => return false */
    switch ( header.type ) {
      case 'input' :
        if ( !utils.string.submatch(
                lineOfData[ header.name ],
                headerValues[ header.id ], true ) ) return false;
        break;

      case 'select' :
        if ( lineOfData[ header.name ] !== headerValues[ header.id ] ) return false;
        break;

      case 'multiSelect-and' :
        if ( !!headerValues[ header.id ] && headerValues[ header.id ].length > 0 ) {
          const cellValue = lineOfData[ header.name ];
          if ( !utils.array.isSubset( headerValues[ header.id ], cellValue ) ) return false;
          /* for any e \in column.manipState, e \in cellValue */
        }
        break;

      case 'multiSelect-or' :
        /* column.manipStateの初期状態はundefinedなのでfilteringされなくなっており，
            column.manipStateの全選択初期化は不要になっている */
        if ( !!headerValues[ header.id ] && headerValues[ header.id ].length > 0 ) {
          const cellValue = lineOfData[ header.name ];
          if ( utils.array.setIntersection( headerValues[ header.id ], cellValue ).length === 0 ) return false;
          /* for some e \in column.manipState, e \in cellValue */
        }
        break;

      default :
        break;
    }
  }
  return true;
};

