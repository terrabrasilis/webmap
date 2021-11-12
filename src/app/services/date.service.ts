import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

  constructor(
  ) { }

  /**
   *  Check if the first is greater than second
   * @param date1 First date object to compare.
   * @param date2 Second date object to compare.
   */
  public static isGreater(date1: Date, date2: Date): boolean
  {
    if (date1 > date2)
    {
      return true;
    } 
    return false;
  
  }

  
  /**
   * Check if the first is less than second
   * @param date1 First date object to compare.
   * @param date2 Second date object to compare.
   */
  public static isLess(date1: Date, date2: Date): boolean
  {
    if (date1 < date2)
    {
      return true;
    } 
    return false;
  }

}
