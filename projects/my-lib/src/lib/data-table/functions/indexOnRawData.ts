import { ColumnState } from '../column-state';
import { filterFunction } from './filterFunction';


export const indexOnRawData = (
    rawData: any[],
    indexOnFilteredData: number,
    columnStates: ColumnState[]
): number => {
  for ( let i = 0, filteredDataNum = 0; i < rawData.length; ++i ) {
    if ( filterFunction( rawData[i], columnStates ) ) filteredDataNum++;
    if ( filteredDataNum > indexOnFilteredData ) return i;
  }
  return rawData.length - 1;
};
