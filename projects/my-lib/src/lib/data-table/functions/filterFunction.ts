import { utils } from '../../../../../../dist/utilities';
import { ColumnState } from '../column-state';


export const filterFunction = ( lineOfData: any, columnStates: ColumnState[] ): boolean => {
  const validSettings = columnStates.filter( column => column.manipState !== undefined );

  for ( const column of validSettings ) {
    /* no mismatches => return true; 1 or more mismatches => return false */
    switch ( column.manip ) {
      case 'input' :
        if ( !utils.string.submatch( lineOfData[ column.name ], column.manipState, true ) ) return false;
        break;

      case 'select' :
        if ( lineOfData[ column.name ] !== column.manipState ) return false;
        break;

      case 'multiSelect-and' :
        if ( !!column.manipState && column.manipState.length > 0 ) {
          const cellValue = lineOfData[ column.name ];
          if ( !utils.array.isSubset( column.manipState, cellValue ) ) return false;
          /* for any e \in column.manipState, e \in cellValue */
        }
        break;

      case 'multiSelect-or' :
        /* column.manipStateの初期状態はundefinedなのでfilteringされなくなっており，
            column.manipStateの全選択初期化は不要になっている */
        if ( !!column.manipState && column.manipState.length > 0 ) {
          const cellValue = lineOfData[ column.name ];
          if ( utils.array.setIntersection( column.manipState, cellValue ).length === 0 ) return false;
          /* for some e \in column.manipState, e \in cellValue */
        }
        break;

      default :
        break;
    }
  }
  return true;
};

