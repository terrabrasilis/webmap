import { Component, OnInit } from '@angular/core'
import { TsComponentsDataShareService } from '../../services/ts-components-data-share.service'

import turf_buffer from '@turf/buffer'
import turf_bbox_polygon from '@turf/bbox-polygon'
import turf_bbox from '@turf/bbox'
import turf_square_grid from '@turf/square-grid'
import turf_polygon from '@turf/unkink-polygon'
import turf_centroid from '@turf/centroid'
import * as d3 from 'd3'
import * as c3 from 'c3'
import '../../../../node_modules/c3/c3.css'
import { json } from 'd3';
import { inflate } from 'zlib'

@Component({
  selector: 'app-chartpanel',
  templateUrl: './chartpanel.component.html',
  styleUrls: ['./chartpanel.component.css']
})
export class ChartpanelComponent implements OnInit {
  enableChartPanel: boolean
  hasChart: boolean
  ctrlData: any
  mySession_point: any
  ocpu: any
  c3chart: any
  jsonCoords: any
  
  constructor (
    private shareData: TsComponentsDataShareService) {
    //set page to communicate to with "ocpusits" on server
    // ocpu.seturl("https://terrabrasilis.ocpu.io/terrabrasilis-timeseries/R");
    ocpu.seturl(
      'http://terrabrasilis.dpi.inpe.br:8004/ocpu/library/terrabrasilisTimeSeries/R'
      //'http://150.163.2.75:8004/ocpu/library/terrabrasilisTimeSeries/R'
      //'https://terrabrasilis.ocpu.io/terrabrasilis-timeseries/R'
      // 'http://terrabrasilis2.dpi.inpe.br:8004/ocpu/library/terrabrasilisTimeSeries/R'
    )
    this.mySession_point = {}
    this.enableChartPanel = true
    this.hasChart = false
  }
  
  ngOnInit () {
    this.shareData.currentData.subscribe(data => {
      this.ctrlData = data

      if (
        this.ctrlData.isPolygon == undefined &&
        this.ctrlData.enableFilter == undefined
      ) {
        // exit
        return
      } else {
        if (!this.ctrlData.isPolygon) {
          this.timeSeriesRaw(data)
        } else {
          this.jsonCoords = localStorage.getItem('jsonCoords');
          if(this.jsonCoords !== ''){
            this.timeSeriesShp(data)
          } else {
            alert("Please, draw a polygon with an area between 50 and 2000 ha.") // Put in data
            stop();
          }
        }
      }
    })
  }
  
  //----- define graphic properties D3.js C3
  prepareData (data: any) {
    let mySeries: any = []
    data.forEach(function (obj: any) {
      for (var i = 1; i < Object.keys(obj).length; i++) {
        mySeries.push({
          band: Object.keys(obj)[i],
          date: obj[Object.keys(obj)[0]],
          value: obj[Object.keys(obj)[i]]
        })
      }
    })
    return mySeries
  }

  // plot map using D3.js C3
  plotChart (mySeries: any) {
    //Draw chart
    let nestedData = d3
      .nest()
      .key(function (d: any) {
        return d.date
      })
      .entries(mySeries)
    let bands = d3.set()
    let formattedData = nestedData.map(function (entry: any) {
      let values = entry.values
      let obj: any = {}
      values.forEach(function (value: any) {
        obj[value.band] = value.value
        bands.add(value.band)
      })
      obj.date = entry.key
      return obj
    })

    this.c3chart = c3.generate({
      bindto: '#plotdiv',
      data: {
        json: formattedData,
        keys: {
          x: 'date', // it's possible to specify 'x' when category axis
          value: bands.values()
        }
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d' //'%Y-%m-%d',
          }
        }
      },
      subchart: {
        show: true
      },
      zoom: {
        enabled: false // zoom with mouse scroll
        //disableDefaultBehavior: true,
      }
      //    type: 'spline',
    })
  }

  // plot map using D3.js C3
  // https://jsfiddle.net/qy4xh1km/
  // https://stackoverflow.com/questions/33164568/c3-js-fill-area-between-curves
  plotChartShp (items: any) {
    //Draw chart
    this.c3chart = c3.generate({
      bindto: '#plotdiv',
      data: {
        json: items,
        keys: {
          x: 'Index',
          value: ['ymin_sd', 'ymax_sd', 'mean'] //, 'quantile_25', 'quantile_75']
        },
        colors: {
          ymin_sd: '#699402', //'#33cc99',
          ymax_sd: '#0946B2', //'#33cc33',
          mean: '#C92918' //'#0066ff',
          //quantile_25: '#ff3300',
          //quantile_75: '#cc0000'
        },
        //labels: true,
        names: {
          ymin_sd: 'standard deviation inferior',
          ymax_sd: 'standard deviation superior',
          mean: 'mean'
        }
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d' //'%Y-%m-%d'
          }
        }
      },
      subchart: {
        show: true
      },
      zoom: {
        enabled: false // zoom with mouse scroll
        //disableDefaultBehavior: true,
      }
      //    type: 'area',
    })
  }

  //----- functions to capture a single point
  timeSeriesRaw (dataOptions: any) {
    let self = this

    let req = ocpu.call(
      'TSoperation',
      {
        // ocpu.rpc
        name_service: dataOptions.service_selected,
        coverage: dataOptions.coverage_selected,
        longitude: dataOptions.longitude,
        latitude: dataOptions.latitude,
        bands: dataOptions.band_selected,
        start_date: dataOptions.start_date,
        end_date: dataOptions.end_date
      },
      function (session: any) {
        self.mySession_point = session

        session.getObject(function (data: any) {
          var myData = data[0].time_series
          // console.log('MyData: ', myData)
          var series = self.prepareData(myData)
          self.plotChart(series)

          // end of loading propagation
          self.shareData.changeLoading(true)
          self.hasChart = true
          // add row in table only if success plot time series
          dataOptions['has_chart'] = true
          self.shareData.changeTable(dataOptions)
        })
      }
    )
  }

   timeSeriesShp (dataOptions: any) {
    let self = this
 
    let req = ocpu.call(
      'TSoperationSHP',
      {
        // ocpu.rpc
        name_service: dataOptions.service_selected,
        coverage: dataOptions.coverage_selected,
        bands: dataOptions.band_selected_shp,
        start_date: dataOptions.start_date,
        end_date: dataOptions.end_date,
        geojson_points: this.jsonCoords
      },
      function (session: any) {
        session.getObject(function (data: any) {
          // console.log('DATA: ', data[0]);
          self.plotChartShp(data[1])

          // end of loading propagation
          self.shareData.changeLoading(true)
          self.hasChart = true
          // add row in table only if success plot time series

          $(function () {
            let obj = JSON.parse(self.jsonCoords)
            //  console.log('obj: ', obj);
            let lng: any = []
            let lat: any = []
            for (let i = 0; i < Object.keys(obj).length; i++) {
              lng[i] = obj[i].geometry.coordinates[0]
              lat[i] = obj[i].geometry.coordinates[1]
            //}
            // add each line in a datatable
           // for (let i = 0; i < lng.length; i++) {
              dataOptions.longitude = lng[i]
              dataOptions.latitude = lat[i]
              console.log('lat: ', lat[i], 'long: ', lng[i])

              dataOptions['has_chart'] = true
              self.shareData.changeTable(dataOptions)
              console.log('dataOptions: ', dataOptions)
              //console.log()
            }
          })
        })
      }
    )
  }

  swapChartAndTable () {
    this.enableChartPanel = !this.enableChartPanel
    $('#chart-panel').toggleClass('disable')
    $('#table-panel').toggleClass('disable')
    $('#swapchartbtn').text(this.enableChartPanel ? 'Tabela' : 'Gráfico')
    if (this.enableChartPanel) {
      // force resize the chart after redraw when the div is hidden.
      this.c3chart.show()
      this.c3chart.internal.initSubchartBrush()
    }
  }
}
