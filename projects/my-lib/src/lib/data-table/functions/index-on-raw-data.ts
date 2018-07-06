import { ColumnState } from '../column-state';
import { filterFunction } from './filter-function';


export const indexOnRawData = (
    rawData: any[],
    indexOnTableFiltered: number,
    columnStates: ColumnState[]
): number => {
  for ( let i = 0, filteredLineNum = 0; i < rawData.length; ++i ) {
    if ( filterFunction( rawData[i], columnStates ) ) filteredLineNum++;
    if ( filteredLineNum > indexOnTableFiltered ) return i;
  }
  return rawData.length - 1;
};
