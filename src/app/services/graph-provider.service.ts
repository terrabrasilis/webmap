import { Injectable } from '@angular/core';

import * as d3 from 'd3';
import * as crossfilter from 'crossfilter2';
import * as dc from 'dc';

@Injectable()
export class GraphProviderService {

  constructor() {}  

  geoChoroplethChart(chart:any, width:any, height:any, dimension:any, group:any, colors:any, colorDomain:any, title:any, geojson:any, name:any, keyAccessor:any):void {
    
    if(!$(chart).length) {return;}
    chart.width(width)
    .height(height)
    .dimension(dimension)
    .group(group)
    .colors(colors)
    .colorDomain(colorDomain)
    //.colorCalculator(function (d:any) { return d ? dc.colors(d) : '#ccc'; })
    .projection(d3.geoMercator().center([-30, -15]).scale(800))  //d3.geoMercator().center([-52, -15]).scale(650)
    .title(title)
    .overlayGeoJson(geojson, name, keyAccessor);
    /*var labelG = d3.select("svg")
    .append("svg:g") 
    .attr("id", "labelG") 
    .attr("class", "Title");
    var project = d3.geoMercator(); 
    labelG.selectAll("text") 
    .data(geojson) 
    .enter().append("svg:text") 
    .text(function(d:any){return d.properties.name;}) 
    .attr("x", function(d:any){return project(d.geometry.coordinates)[0];}) 
    .attr("y", function(d:any){return project(d.geometry.coordinates)[1];}) 
    .attr("dx", "-1em"); */
    
  }
  
  barChart(chart:any, width:any, height:any, margin:any, dimension:any, group:any, barPadding:any, outterPadding:any, transitionDuration:any, x:any, elasticY:any, xAxisLabel:any, yAxisLabel:any, ticks:any):void {

    if(!$(chart).length) {return;}
    chart.width(width)
      .height(height)
      .margins(margin)
      .dimension(dimension)
      .group(group)
      .barPadding(barPadding)
      .outerPadding(outterPadding)
      //.transitionDuration(transitionDuration)
      //.x(d3.scaleTime().domain(x))      
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .brushOn(false)
      //.elasticY(elasticY)
      .xAxisLabel(xAxisLabel)
      .yAxisLabel(yAxisLabel)
      //.yAxis().ticks(ticks);

  }

  dataTable(config:any):void {

    if(!$(config.tag).length) {return;}
    
    dc.dataTable(config.tag)
      .dimension(config.dimension)
      .group(config.group)
      .sortBy(config.sortBy)
      .showGroups(config.showGroups)
      .columns(config.columns)
      .order(d3.ascending);
  
  }

  seriesChart(config:any) {

    if(!$(config.tag).length) {return;}

    let auxYears:any[]=[],auxRates:any[]=[], xScale, chart:any;

		config.groupKeys.all().forEach(function(y:any){
      auxYears.push(+y.key);
			auxRates.push(y.value);
    });

   	xScale = d3.scaleLinear()
			.domain([auxYears[0]-1, auxYears[auxYears.length-1]+1])
			.range([auxRates[0],auxRates[auxRates.length-1]]);

    chart = dc.seriesChart(config.tag)
      .margins({top: 30, right: 200, bottom: 30, left: 60});
    //var config.margin.right
    console.log("chart.width(): "+(800-150));
    
    chart.legend(dc.legend().x(chart.width()-220));

    //chart.chart(dc.scatterPlot)
    //chart.chart(function(c) { return dc.lineChart(c).curve(d3.curveCardinal.tension(0.5)); })
    //chart.chart(function(c:any) { return dc.lineChart(c).renderArea(false).renderDataPoints(true); })
    var aspect = chart.width() / chart.height();

		chart
      .height(chart.height())
      .width(chart.width())
      .chart(function(c:any) { return dc.lineChart(c).curve(d3.curveCardinal.tension(0.5)).renderDataPoints({radius: 4}).evadeDomainFilter(true); })
			.x(xScale)
      .brushOn(false)
      .yAxisPadding('10%')
      .yAxisLabel('Axis label')
      .renderHorizontalGridLines(true)
			.renderVerticalGridLines(true)
			.title(function(d:any) {
				return d.key.state + "\n" +
				'Year:' + (new Date(d.key.date)).getFullYear() + "\n" +
				'Area:' + Math.abs(+(d.value.toFixed(2))) + " km²";
			})
			.elasticY(true)
      //.yAxisPadding(30)// It is should be 10% but this function not allow a string value. Why?
			.dimension(config.dimension)
			.group(this.snapToZero(config.group))
			.mouseZoomable(false)
			.seriesAccessor(function(d:any) {
				return d.key.state;
			})
			.keyAccessor(function(d:any) {
				return d.key.date;
			})
			.valueAccessor(function(d:any) {
				return +d.value;
			})
      .ordinalColors(config.colors)
      .data(function (group:any) {
        return group.top(10);
      });
      
      
    chart.xAxis().ticks(auxYears.length);
		chart.xAxis().tickFormat(function(d:any) {
			return (new Date(d)).getFullYear()+"";
		});
		chart.yAxis().tickFormat(function(d:any) {
			return ((d>1000)?( (d/1000)+"k" ):(d));
		});
		
		chart.on("renderlet.a",function (chart:any) {
			// rotate x-axis labels
			chart.selectAll('g.x text')
				.attr('transform', 'translate(-15,7) rotate(315)');
    });

    chart.on('renderlet', function (chart:any) {
      d3.selectAll('.line').style('fill', 'none');
    });
		
		// chart.addFilterHandler(function(filters:any[], filter:any):any[] {
		// 	filters.push(filter);
		// 	return filters;
		// });
  }

  /*
	 * Remove numeric values less than 1e-6
	 */
	snapToZero(dataGroup:any) {
		return {
			all:function () {
				return dataGroup.all().map(function(d:any) {
					return {key:d.key,value:( (Math.abs(d.value)<1e-6) ? 0 : d.value )};
				});
			},
			top: function(n:any) {
				return dataGroup.top(Infinity)
					.filter(function(d:any){
						return (Math.abs(d.value)>1e-6);
						})
					.slice(0, n);
			}
		};
	}
  
}