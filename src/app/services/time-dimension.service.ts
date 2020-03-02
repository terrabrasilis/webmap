
import {throwError as observableThrowError,  Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Constants } from '../util/constants';
import { head, last } from "lodash";

/**
 * This is a stateless service that contains static functions to process bussiness logic algorithms related with Time Dimension rules.
 */
@Injectable()
export class TimeDimensionService {
  
  constructor(
   ) { }

/**
 * Method allows to get granularity (Daily, Monthly or Yearly) from a time dimension list (List of Dates).
 * @param dimensionList List of Dimensions get from capabilities and processed by @method WmsCapabilitiesProviderService.getDimensionsFromLayer()
 * @returns A constant declared on @method Constants.Granularity{Daily,Montly,Yearly}
 */
  public static getLayerTimeDimensionGranularity(dimensionList:any)
  {
    let dailyData = false;
    let monthlyData = false;
    let granularity = Constants.Granularity.Daily;

    //if contains only one dimension is daily data.
    if(dimensionList.length>1) {

      for (let i = 0; i < dimensionList.length; i++) {
        let dimension: Date = dimensionList[i];
  
        if(dailyData==false)
        {
          if(dimension.getDate()!=1)//getDate() return a index between 1-31
          {
            dailyData = true; //Found diferent days on data (not only the first day of each month)
            break;
          }
        }
  
        if(monthlyData==false)
        {
          if(dimension.getMonth()!=0)//getMonth() return a index between 0-11
          {
            monthlyData = true; // Found diferrent month than January
          }
        }
      }
    }   
    if(dailyData == true)
    {

      granularity = Constants.Granularity.Daily;

    } else if(monthlyData == true)
    {

      granularity = Constants.Granularity.Monthly;

    } else 
    {

      granularity = Constants.Granularity.Yearly;

    }

    return granularity;
    
  }
/**
 * Method allows to get start and end date from from a time dimension list (List of Dates).
 * @param dimensionList List of Dimensions get from capabilities and processed by @method WmsCapabilitiesProviderService.getDimensionsFromLayer()
 * @returns An object with to attributes startDate and endDate.
 */
  public static getStartAndEndDate(dimensionList:any)
  {
    let dateRange = {startDate: null,endDate: null};

    if(dimensionList.length>0)
    {
      dateRange.startDate = new Date(head(dimensionList));
    }
    if(dimensionList.length>1)
    {
      dateRange.endDate = new Date(last(dimensionList));
    }
    else
    {
      dateRange.endDate = dateRange.startDate; //If there is only one time dimension...
    }

    if(dateRange.startDate != null && dateRange.endDate != null)
    {
      return dateRange;
    }
    else
    {
      throw Error("Failed to get start and end date from time dimension list.");
    }
  }
}
