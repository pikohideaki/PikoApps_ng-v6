import { filterFunction } from './filter-function';
import { HeaderSetting } from '../types/header-setting';


export const indexOnRawData = (
    rawData: any[],
    indexOnTableFiltered: number,
    headerSettings: HeaderSetting[],
    headerValues: object,
): number => {
  for ( let i = 0, filteredLineNum = 0; i < rawData.length; ++i ) {
    if ( filterFunction( rawData[i], headerSettings, headerValues ) ) {
      filteredLineNum++;
    }
    if ( filteredLineNum > indexOnTableFiltered ) return i;
  }
  return rawData.length - 1;
};
