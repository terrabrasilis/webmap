/**
 * This class is responsible to expose auxiliary functions within deforestation options code
 */    

import * as Terrabrasilis from "terrabrasilis-api";
import { Constants } from './constants';
import * as dc from "dc";
import * as d3 from "d3";

export class DeforestationOptionsUtils {

  public static setLoiNamesDownload(loi:any, loinames:any, checkedLoiNames:any) {
        
    loi.loinames.forEach(function(loiname:any) {  
      var [mun, state] = loiname.loiname.split("_");
      if (checkedLoiNames.indexOf(state) > -1)
        loinames[loiname.gid] = [mun, state];
    });

    return;

  }

  public static setLoiNames(loi:any, self:any) {
    
    loi.loinames.forEach(function(loiname:any) {  
      self.loiNames[loiname.gid] = loiname.loiname;
      self.loiNamesObject.push({key:loiname.gid,value:loiname.loiname});
    });

  }

  public static setLoiNamesSplit(loi:any, self:any) {
    
    loi.loinames.forEach(function(loiname:any) {  
      var value = loiname.loiname.split("_")[0];
      self.loiNames[loiname.gid] = value;
      self.loiNamesObject.push({key:loiname.gid,value:value});
    });

  }

  public static dataWranglingRates(dataJson:any) {
    
    var all:any[] = [];

    dataJson["periods"].forEach(function(period:any) {
      period.features.forEach(function(feature:any) {       
        var year = period.endDate.year;          
        var area = feature.areas.filter((area:any) => area.type == 1).map(function(e:any) { return e.area; })[0];
        var filteredArea = feature.areas.filter((area:any) => area.type == 2).map(function(e:any) { return e.area; })[0];
        all.push({ 
          endDate: year,
          loi: feature.loi,
          loiName: feature.loiname,
          area: area,
          filteredArea: filteredArea
        });
      });
    });
        
    return all;
  }

  public static dataWranglingIncrements(dataJson:any) {

    var all:any[] = [];

    dataJson["periods"].forEach(function(period:any) {
      period.features.forEach(function(feature:any) {       
        var year = period.endDate.year;          
        var area = feature.areas.filter((area:any) => area.type == 2).map(function(e:any) { return e.area; })[0];
        var filteredArea = feature.areas.filter((area:any) => area.type == 1).map(function(e:any) { return e.area; })[0];
        if(Constants.DASHBOARD_CERRADO_DUPLICATED_YEARS.indexOf(year) > -1) {
          all.push({ 
            endDate: year,
            loi: feature.loi,
            loiName: feature.loiname,
            area: area*0.5,
            filteredArea: filteredArea*0.5
          });
          all.push({
            endDate: year-1,
            loi: feature.loi,
            loiName: feature.loiname,
            area: area*0.5,
            filteredArea: filteredArea*0.5
          });
        } else  if(Constants.DASHBOARD_CERRADO_MAINTAINABLE_YEARS.indexOf(year) > -1) {
                  all.push({ 
                            endDate: year, 
                            loi: feature.loi, 
                            loiName: feature.loiname, 
                            area: area,
                            filteredArea: filteredArea
                          });
                }
      });
    });

    return all;

  }
    
  public static getloiNamesByLoi(arr:any, loi:any):Array<number> {      
    
    return arr.filter(
      (filteredloi:any) => { 
        return filteredloi.loi === loi
      }
    )
    .map(
      (e:any) => { 
        return {"key":e["gid"], "value":e["loiname"]};
      }
    );

  };

  public static style(feature:any) {
      
      return {
          fillColor: Terrabrasilis.getColor(feature.properties.density),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
      };
  
  };

  // format Number
  public static formatNumber(num:number) {
    
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }        

    return (num).toFixed(1).replace(/\.0$/, '');

  };

  public static get MAP_LEGEND_GRADES(): number {
      return 8;
  };    

  public static renderGraph(id:any, listCharts:any, transition:any, loiNames:any, type:any):void {
    
    var width = $('#'+id).width(); // get width from parent div
    var height = $('#'+id).height(); // get height from parent div
  
    var result = listCharts.get(id); // get result from list charts
    
    result.width(width*.95) // update width
          .height(height*.95) // update height
          .transitionDuration(transition); // update transitions
    
    if (id == "bar-chart" && type!='rates') {
      result.legend(dc.legend().x(2*width/3).y(5).itemHeight(13).gap(4)/*.horizontal(1).legendWidth(width/4).itemWidth(130)*/.legendText(function(d:any, i:any) { return d.name; }))
              .x(d3.scaleBand().rangeRound([0, width]).paddingInner(0.05))
              .xUnits(dc.units.ordinal);  
              $("#barchart-legend").removeClass('deactivate');
              $("#barchart-legend").addClass('active');                
    } else if (id == "series-chart") {
              result.legend(dc.legend().x(0.65*width).y(10).itemHeight(13).gap(5).legendText(function(d:any, i:any) { 
                return loiNames[d.name];
              }));
              $("#serieschart-legend").removeClass('deactivate');
              $("#serieschart-legend").addClass('active');                
            }
            else if (id == "row-chart") {
              $('.search-loi').width(0.8*width);
              
            }

    (function(j, result){
      setTimeout(() => {
        result.render();  
        Terrabrasilis.disableLoading(id);               
        Terrabrasilis.disableLoading("#loi-chart");      
      },100 * j);
    })(2, result);    

  }

  public static renderMap():void {
    Terrabrasilis.enableInvalidateSize();
    
  }

  public static render(item:any, listCharts:any, transition:any, loiNames:any, type:any):void {
    if (item != "loi-chart")        
      this.renderGraph(item, listCharts, transition, loiNames, type);
    else
      this.renderMap();
  }
    
}