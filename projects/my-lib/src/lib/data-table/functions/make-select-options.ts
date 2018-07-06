import { ColumnState } from '../column-state';
import { utils } from 'dist/utilities';


export const makeSelectOptions = (
  columnStates: ColumnState[],
  table: any[],
  tableFiltered: any[],
) => {
  columnStates.forEach( colSettings => {
    const col         = table        .map( line => line[ colSettings.name ] );
    const colFiltered = tableFiltered.map( line => line[ colSettings.name ] );
    switch ( colSettings.manip ) {
      case 'select' : {
        const options = utils.array.uniq( col ).sort();
        colSettings.selectOptions
          = options.map( e => ({
                value: e,
                viewValue: this.transform( colSettings.name, e )
                    + `(${colFiltered.filter( cell => cell === e ).length})`,
              }) );
      } break;
      case 'multiSelect-or' :
      case 'multiSelect-and' : {
        const options = utils.array.uniq( [].concat( ...col ) ).sort();
        colSettings.selectOptions
          = options.map( e => ({
                value: e,
                viewValue: this.transform( colSettings.name, e )
                    + `(${colFiltered.filter( cell => cell.includes(e) ).length})`,
              }) );
      } break;
      default: break;
    }
  });
  return columnStates;
};
