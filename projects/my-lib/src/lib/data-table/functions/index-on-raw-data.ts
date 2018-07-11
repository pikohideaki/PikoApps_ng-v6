import { filterFunction } from './filter-function';
import { HeaderSetting } from '../types/header-setting';
import { TCell } from '../types/table-cell';


export const indexOnRawData = (
    rawData: any[],
    indexOnTableFiltered: number,
    headerSettings: HeaderSetting[],
    headerValuesAll: TCell[],
): number => {
  for ( let i = 0, filteredLineNum = 0; i < rawData.length; ++i ) {
    if ( filterFunction( rawData[i], headerSettings, headerValuesAll ) ) {
      filteredLineNum++;
    }
    if ( filteredLineNum > indexOnTableFiltered ) return i;
  }
  return rawData.length - 1;
};
