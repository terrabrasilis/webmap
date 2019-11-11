import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// import terrabrasilis api from node_modules
//import { TerrabrasilisApiComponent } from '../tool/terrabrasilis-api/terrabrasilis-api.component';
import * as d3 from 'd3';
import * as c3 from 'c3';

import * as jQuery from 'jquery'; // para DataTable
import 'datatables.net';
import 'datatables.net-dt';

import '../../../node_modules/c3/c3.css';
import '../../../node_modules/datatables.net-dt/css/jquery.dataTables.css';

//https://stackoverflow.com/questions/46250941/how-add-c3-charts-to-angular-2-project/46251339

declare var $: any;

@Component({
  selector: 'app-timeseries',
  templateUrl: './timeseries.component.html',
  styleUrls: ['./timeseries.component.css'],
})

export class TimeseriesComponent implements OnInit {

  // See https://github.com/ammaciel/ocpusits/blob/master/inst/www/app-timeseries.js

  // @Input() longitude: number;
  // @Input() latitude: number;

  // pass a value to a input=text form
  latitude: number = -13.224772;
  longitude: number = -56.24564;
  long: number = this.longitude;
  lat: number = this.latitude;
 
  constructor(private dialogRef: MatDialogRef<TimeseriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    //console.log("Latitude: " + this.lat + ", Longitude: " + this.long);
    console.log("Latitude: " + this.lat + ", Longitude: " + this.long)
    this.timeseries();
  }

  timeseries() {
    /* *
    * publics
    * */
    // let long: number = null;
    // let lat: number = null;
     
    //------------------
    // OPENCPU with R
    //------------------

    // global variable used to save the session object
    let nrow: number = 1; // table
    let mySession_point: any = null;
    //set page to communicate to with "ocpusits" on server
    ocpu.seturl("http://ammaciel.ocpu.io/ocpusits/R")
    
    //----- define values of the input
    $('#services').change(function () {
      switch ($(this).val()) {
        case 'WTSS-INPE':
          $("#coverages").html("<option value='MOD13Q1'> MOD13Q1 </option>");
          $("#band").html("<option selected='selected' value='evi'> evi </option><option value='ndvi'> ndvi </option><option value='mir'> mir </option><option value='nir'> nir </option><option value='red'> red </option><option value='blue'> blue </option>");
          $("#band_shp").html("<option selected='selected' value='evi'> evi </option><option value='ndvi'> ndvi </option><option value='mir'> mir </option><option value='nir'> nir </option><option value='red'> red </option><option value='blue'> blue </option>");
          $("#pre_filter").find("option").each(function () {
            $(this).attr("disabled", "disabled");
          });
          break;
        case 'SATVEG':
          $("#coverages").html("<option value='terra'>Terra</option><option value='aqua'>Aqua</option><option value='comb'>Combination</option>");
          //$("#band").html("<option value='evi'> evi </option><option value='ndvi'> ndvi</option>");
          $("#pre_filter").html("<option value='0'> 0 - none </option><option selected='selected' value='1'> 1 - no data correction </option><option value='2'> 2 - cloud correction </option><option value='3'> 3 - no data and cloud correction </option>");
          $("#band").find("option").each(function () {
            $(this).attr("disabled", "disabled");
          });
          $("#from").find("input").each(function () {
            $(this).attr("disabled", "disabled");
          });
          $("#to").find("input").each(function () {
            $(this).attr("disabled", "disabled");
          });
          break;
        default:
          $("#coverages").html("<option value=''>-- Coverage --</option>");
      }
    });

    $("#filter").change(function () {
      switch ($(this).val()) {
        case 'No-filter':
          $("#wh-lambda").prop("disabled", true);
          $("#wh-differences").prop("disabled", true);
          $("#sg-order").prop("disabled", true);
          $("#sg-scale").prop("disabled", true);
          break;
        case 'Whittaker':
          $("#wh-lambda").prop("disabled", false);
          $("#wh-differences").prop("disabled", false);
          $("#sg-order").prop("disabled", true);
          $("#sg-scale").prop("disabled", true);
          break;
        case 'Savitsky-Golay':
          $("#wh-lambda").prop("disabled", true);
          $("#wh-differences").prop("disabled", true);
          $("#sg-order").prop("disabled", false);
          $("#sg-scale").prop("disabled", false);
          break;
      }
    });

    //----- define graphic properties D3.js C3
    function prepareData(data: any) {
      let mySeries: any = [];
      data.forEach(function (obj: any) {
        for (var i = 1; i < Object.keys(obj).length; i++) {
          mySeries.push({
            band: Object.keys(obj)[i],
            date: obj[Object.keys(obj)[0]],
            value: obj[Object.keys(obj)[i]]
          })
        }
      });
      return (mySeries);  
    }

    // plot map using D3.js C3
    function plotChart(mySeries: any) {
      //Draw chart
      let nestedData = d3.nest().key(function (d: any) { return d.date; }).entries(mySeries);
        let bands = d3.set();
        let formattedData = nestedData.map(function (entry: any) {
        let values = entry.values;
        let obj: any = {};
        values.forEach(function (value: any) {
          obj[value.band] = value.value;
          bands.add(value.band);
        })
        obj.date = entry.key;
        return obj;
      });
      
      let chart = c3.generate({
        bindto: '#plotdiv',
        data: {
          json: formattedData,
          keys: {
            x: 'date', // it's possible to specify 'x' when category axis
            value: bands.values(),
          }
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%Y-%m-%d', //'%Y-%m-%d',
            }
          }
        },
        subchart: {
          show: true
        },
        zoom: {
          enabled: false, // zoom with mouse scroll
          //disableDefaultBehavior: true,
        },
        //    type: 'spline',
      });
    }

    // plot map using D3.js C3
    // https://jsfiddle.net/qy4xh1km/
    // https://stackoverflow.com/questions/33164568/c3-js-fill-area-between-curves
    function plotChartShp(items: any) {
      //Draw chart
      let chart = c3.generate({
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
            mean: '#C92918',  //'#0066ff',
            //quantile_25: '#ff3300',
            //quantile_75: '#cc0000' 
          },
          //labels: true,
          names: {
            ymin_sd: 'standard deviation inferior',
            ymax_sd: 'standard deviation superior',
            mean: 'mean'
          },
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%Y-%m-%d' //'%Y-%m-%d'
            }
          },
        },
        subchart: {
          show: true
        },
        zoom: {
          enabled: false, // zoom with mouse scroll
          //disableDefaultBehavior: true,
        },
        //    type: 'area',
      });
    }

    //----- functions to table, remove and edit row
    let table: any = jQuery('#tableSample').DataTable();
    $('#tableSample').on( 'click', 'tr', function (){
      $(this).toggleClass('selected');
    });

    $('#deleteRow').click( function () {
        table.rows('.selected').remove().draw( false );
    });

    $('#clearTable').click( function () {
      table.clear().draw();
    } );
   
    //----- functions to capture a single point
    function timeSeriesRaw() {

      let long: number = $("#long").val();
      let lat: number = $("#lat").val();
      
      let service_selected = $("#services option:selected").val();
      console.log('service: ', service_selected);
      let coverage_selected = $("#coverages option:selected").val();
      console.log('coverage: ', coverage_selected);
      let band_selected = $("#band").val();
      console.log('bands: ', band_selected);
      let pre_filter_selected = $("#pre_filter").val();
      console.log('pre filter: ', pre_filter_selected);
      //disable the button to prevent multiple clicks
      $("#submitbutton").attr("disabled", "disabled");

      if (long == null || lat == null) {
        alert('Enter with longitude and latitude!');
        $("#submitbutton").removeAttr("disabled");
      } else {

        var req = ocpu.call("TSoperation", { // ocpu.rpc
          name_service: service_selected,
          coverage: coverage_selected,
          longitude: long, // $("#long").val(),
          latitude: lat, //$("#lat").val(),
          bands: band_selected,
          start_date: $("#from").val(),
          end_date: $("#to").val(),
          pre_filter: pre_filter_selected
        }, function (session: any) {
          mySession_point = session;
          console.log('DATA: ', mySession_point);

          session.getObject(function (data: any) {
            // console.log('DATA: ', data);
            var myData = data[0].time_series;
            console.log('MyData: ', myData);
            var series = prepareData(myData);
            plotChart(series);

            // add row in table only if success plot time series
            $(function () {
              let start_date1 = $("#from").val();
              let end_date1 = $("#to").val();
              table.row.add([ nrow , long, lat, start_date1, end_date1, "No label" ]).draw();
              nrow += 1;
            });
          });
        }).always(function () { //after request complete, re-enable the button
          $("#submitbutton").removeAttr("disabled");
          $("#submitbuttonfilter").removeAttr("disabled");
        }).fail(function () { //if R returns an error, alert the error message
          alert("Failed to plot time series!\nDefine service, coverage and LatLong input!");
          $("#submitbutton").removeAttr("disabled");
        });
      }
    }

    // filters
    function timeSeriesFilter(){
      var filter_selected = $("#filter option:selected").val();
      console.log('filter: ', filter_selected);
      var wh_lambda_selected = $("#wh-lambda").val();
      console.log('wh-lambda: ', wh_lambda_selected);
      var wh_diff_selected = $("#wh-differences").val();
      console.log('wh-differences: ', wh_diff_selected);
      var sg_order_selected = $("#sg-order").val();
      console.log('sg-order: ', sg_order_selected);
      var sg_scale_selected = $("#sg-scale").val();
      console.log('sg-scale: ', sg_scale_selected);

      //disable the button to prevent multiple clicks
      $("#submitbuttonfilter").attr("disabled", "disabled");

      var req = ocpu.call("TSfilter", { //rpc
        ts_data: mySession_point,
        type_filter: filter_selected,
        wh_lambda: wh_lambda_selected,
        wh_differences: wh_diff_selected,
        sg_order: sg_order_selected,
        sg_scale: sg_scale_selected,
      }, function (session: any) {
        //console.log('mySession_point: ', mySession_point);
        session.getObject(function (data: any) {
          var myData = data[0].time_series;
          //console.log('MyData filter: ', myData);
          var series = prepareData(myData);
          //console.log('series: ', series);

          var str = JSON.stringify(series).replace(/.whit/g, "_whit"); //convert to JSON string
          str = str.replace(/.sg/g, "_sg");
          var series2 = JSON.parse(str);    //convert back to array
          console.log('series filter: ', series2);

          plotChart(series2);
        });
      }).always(function () { //after request complete, re-enable the button
        $("#submitbuttonfilter").removeAttr("disabled");
      }).fail(function () { //if R returns an error, alert the error message
        alert("Failed to plot time series filtered!\nAcquire the time series first!");
      });
    }

    function timeSeriesShp() {
      var service_selected = $("#services option:selected").val();
      console.log('service: ', service_selected);
      var coverage_selected = $("#coverages option:selected").val();
      console.log('coverage: ', coverage_selected);
      var band_selected = $("#band_shp").val();
      console.log('bands: ', band_selected);
      var pre_filter_selected = $("#pre_filter").val();
      console.log('pre filter: ', pre_filter_selected);
      
      // test geojson https://utahemre.github.io/geojsontest.html
      let jsonCoords = $("#openJSON").val();
      console.log('json file: ', jsonCoords);
      
      //disable the button to prevent multiple clicks
      $("#submitbutton").attr("disabled", "disabled");

      if (typeof jsonCoords === null) {
        alert('Draw polygon!');
        $("#submitbutton").removeAttr("disabled");
      } else {

        var req = ocpu.call("TSoperationSHP", { // ocpu.rpc
          name_service: service_selected,
          coverage: coverage_selected,
          bands: band_selected,
          start_date: $("#from").val(),
          end_date: $("#to").val(),
          pre_filter: pre_filter_selected,
          shp_file: jsonCoords,
        }, function (session: any) {
          var mySession_shp = session;

          //console.log('mySession_shp: ', session);

          session.getObject(function (data: any) {
            // console.log('DATA: ', data[0]);
            plotChartShp(data[1]);

          // add row in table only if success plot time series
          $(function () {
            var start_date1 = $("#from").val();
            var end_date1 = $("#to").val();
   
            let obj = JSON.parse(jsonCoords);
            let lng = [];
            let lat = [];
            for (var i = 0; i < Object.keys(obj).length; i++) {
              lng[i] = obj[i].geometry.coordinates[0];
              lat[i] = obj[i].geometry.coordinates[1];
            }
            // add each line in a datatable
            for (var i = 0; i < lng.length; i++) {
              table.row.add([ nrow , lng[i], lat[i], start_date1, end_date1, "No label" ]).draw();
              nrow += 1;
            }
            
          });
        });
        }).always(function () { //after request complete, re-enable the button
          $("#submitbutton").removeAttr("disabled");
          $("#submitbuttonfilter").removeAttr("disabled");
        }).fail(function () { //if R returns an error, alert the error message
          alert("Failed to plot time series!\nDefine service, coverage and LatLong input!");
          $("#submitbutton").removeAttr("disabled");
        });
      }
    }

    //----- change the input mode, if point or polygon
    $('[name=mode-options]').change(function () {
      // hide inputs, divs ... for each mode-options
      $('#lat').toggle(this.value !== 'polygon');
      $('#long').toggle(this.value !== 'polygon');
      $('#showLatLong').toggle(this.value !== 'polygon');
      $('#band').toggle(this.value !== 'polygon');
      $('#band_shp').toggle(this.value !== 'point');
      $('#title-chart-filter').toggle(this.value !== 'polygon');
      $('#filter').toggle(this.value !== 'polygon');
      $('#filter-group').toggle(this.value !== 'polygon');
      $('#filter-whit').toggle(this.value !== 'polygon');
      $('#filter-sg').toggle(this.value !== 'polygon');
      $('#submitbuttonfilter').toggle(this.value !== 'polygon');
      $('#butOpenJSON').toggle(this.value !== 'point');
      $('#openJSON').toggle(this.value !== 'point');
      
      if ($('#get-point').is(':checked')) {

        // map.on('click', addMarker);
        // drawnItems.clearLayers();
        // turfLayer.clearLayers();
        // map.removeControl(drawControlFull);

        // https://stackoverflow.com/questions/9240854/jquery-function-executed-more-than-once
        $("#submitbutton").unbind('click').click(function (e: any) {
          console.log("Test ...")
          e.preventDefault();
          timeSeriesRaw();
          //$(this).off('click');  
        });
      }
      else if ($('#get-polygon').is(':checked')) {

        // map.off("click", addMarker)
        // map.removeLayer(newMarker);
        // map.addControl(drawControlFull);

        $("#submitbutton").unbind('click').click(function (e: any) {
          e.preventDefault();
          timeSeriesShp();
          //$(this).off('click');  
        });
      }
    });

    //button handler
    $("#submitbuttonfilter").on("click", function (e: any) {
      e.preventDefault();
      timeSeriesFilter();
    });
     

  //------------------
  // TABLE add samples
  //------------------

   // remove row of table
  $('#tableSample').on('click', 'button[type="button"]', function () { //'input[type="button"]'
    $(this).closest('tr').remove();
  });
  $('p button[type="button"]').click(function () {
    $('#tableSample').append('<tr><td></td><td><input type="button" value="Delete" /></td></tr>');
  });

  // SAVE table in file
  // source: https://stackoverflow.com/questions/40428850/how-to-export-data-from-table-to-csv-file-using-jquery
  $('#saveCSV').click(function() {
    let titles: any = [];
    let data: any = [];
    /*Get the table headers, this will be CSV headers
    The count of headers will be CSV string separator */
    $('.tableSample th').each(function() {
      titles.push($(this).text());
    });
    //titles = titles.slice(0,-1); // remove last column
    // Get the actual data, this will contain all the data, in 1 array
    $('.tableSample td').each(function() {
      data.push($(this).text());
    });
    // Convert our data to CSV string
    var CSVString = prepCSVRow(titles, titles.length, '');
    CSVString = prepCSVRow(data, titles.length, CSVString);
    // Make CSV downloadable
    let downloadLink = document.createElement("a");
    let blob = new Blob(["\ufeff", CSVString]);
    let url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "samples.csv";
    // Actually download CSV
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
  /*
  * Convert data array to CSV string
  * @param arr {Array} - the actual data
  * @param columnCount {Number} - the amount to split the data into columns
  * @param initial {String} - initial string to append to CSV string
  * return {String} - ready CSV string
  */
  function prepCSVRow(arr: any, columnCount: any, initial: any) {
    let row = ''; // this will hold data
    let delimeter = ','; // data slice separator, in excel it's `;`, in usual CSv it's `,`
    let newLine = '\r\n'; // newline separator for CSV row
    /*
    * Convert [1,2,3,4] into [[1,2], [3,4]] while count is 2
    * @param _arr {Array} - the actual array to split
    * @param _count {Number} - the amount to split
    * return {Array} - splitted array
    */
      function splitArray(_arr: any, _count: any) {
        let splitted : any = [];
        let result : any = [];
        _arr.forEach(function(item: any, idx: any) {
          if ((idx + 1) % _count === 0) {
            splitted.push(item);
            result.push(splitted);
            splitted = [];
          } else {
            splitted.push(item);
          }
        });
        return result;
      }
      let plainArr = splitArray(arr, columnCount);
    // don't know how to explain this
    // you just have to like follow the code
    // and you understand, it's pretty simple
    // it converts `['a', 'b', 'c']` to `a,b,c` string
    plainArr.forEach(function(arrItem: any) {
      arrItem.forEach(function(item: any, idx: any) {
        row += item + ((idx + 1) === arrItem.length ? '' : delimeter);
      });
      row += newLine;
    });
    return initial + row;
    }

  }

  closeDialog() {
    this.dialogRef.close();
  }


}
