import {  Component, 
          OnInit, 
          ChangeDetectorRef } from '@angular/core';

import {  HttpHeaders } from '@angular/common/http';

import {  ISubscription } from "rxjs/Subscription";
import {  Observable  } from 'rxjs/Observable';
import {  forkJoin  } from "rxjs/observable/forkJoin";

import {  DialogComponent } from "../../../dialog/dialog.component";
import {  MatDialog } from "@angular/material";

import { ActivatedRoute, Router } from '@angular/router';

import { DeforestationOptionsUtils } from '../../../util/deforestation-options-utils';
import { Constants } from '../../../util/constants';

import { DashboardApiProviderService } from '../../../services/dashboard-api-provider.service';

import * as Terrabrasilis from "terrabrasilis-api";
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter2';
import * as dc from 'dc';
import * as FileSaver from 'file-saver';

/* Translate */
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../../services/local-storage.service';

import { ContactComponent } from '../../../contact/contact.component';
import { AboutComponent } from '../../../about/about.component';

declare var $ : any;

export interface Class {
  value: string;
  viewValue: string;
}

export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
  selector: 'app-deforestation-options',
  templateUrl: './deforestation-options.component.html',
  styleUrls: ['./deforestation-options.component.css'],  
  encapsulation: 3  
})

export class DeforestationOptionsComponent implements OnInit  {

  imgPath:string=( process.env.ENV === 'production' )?('/app/'):('');
  
  // variables definition
  biome: string;
  type: string;
  project: string;
  selectedClass: string;
  selectedLoi: string;
  classes: Class[];
  lois: Class[];
  maxLoi: any;

  trashIcon: string; 
  
  loadGrid: any; 
  geojsonLayers:any;
  listCharts:any;
  rowChart:any;
  barChart:any;
  area:any;
  filteredArea:any;
  seriesChart:any;
  tagId:any;
  minDate: any;
  maxDate: any;
  labelRegularArea: any;
  labelFilteredArea: any;
  tableYear: any;
  tableRegular: any;
  tableLess: any;
  tableTotal: any;
  initTab: any;

  private biomeSubscription: ISubscription;
  private typeSubscription: ISubscription;
  
  private dataObservable: Observable<any>;
  private mapObservable: Observable<any>;
  private dataLoinamesObservable: Observable<any>;
  
  private dataJson: any;
  private dataLoinamesJson: any;
  private mapJson: any;
  
  // use for make tables
  private tableArea: any;
  private tableDateDim: any;
  private ctrlTableTimeOut: any;
  private loiNameDim: any;
  private tableTotalAreaByLoiName: any;
  private areaByDate: any;
  private filteredAreaByDate: any;
  private areaByLoiName: any;

  // dashboard title
  private loiname: any;

  private loiNames: Map<number, string>;
  private loiNamesObject: Array<Object>;

  public httpOptions: any;

  public barPadding: any;
  public BAR_PADDING: any;

  private labelArea: string;
  private labelRates: string;
  private languageKey: string = "translate";  


  constructor(private route: ActivatedRoute,    
              private router: Router,
              public dialog: MatDialog,
              private dashboardApiProviderService: DashboardApiProviderService,
              private _translate: TranslateService,
              private localStorageService: LocalStorageService,
              private cdRef: ChangeDetectorRef
            ) {
    
    // create subscription for biome data
    this.biomeSubscription = this.route.params.subscribe(params => this.biome = params["biome"].replace("-", " "));
    this.typeSubscription = this.route.params.subscribe(params => this.type = params["type"].replace("-", " "));

    this.httpOptions = { headers: new  HttpHeaders(
      { 'App-Identifier': 'prodes_'+this.biome}
    )};

    this.lois = [ 
      {value: "uf", viewValue: 'States'}, 
      {value: "mun", viewValue: 'Municipalities'}, 
      {value: "consunit", viewValue: 'Conservation Units'}, 
      {value: "indi", viewValue: 'Indigeneous Areas'}
    ];

    this.classes = [    
      {value: 'deforestation', viewValue: 'Deforestation'}
    ];

    this.selectedLoi = this.lois[0].value;
    this.selectedClass = this.classes[0].value;
    this.BAR_PADDING = .1;
    this.barPadding = undefined;

    if (this.type == "rates")
      this.selectedClass = this.selectedClass+"_rates";      
      
    // remove loading tag
    $(".loading-overlay, .loading-overlay-content").remove();

    this.maxLoi = 13;

    this.loiname = "*";
    
  }

  ngOnInit() {
        
    // define the height for div content using the div identifier: "myTabContent"
    let h = $(document).height() - ($('#sub-bar-options').height() + 64 + 45 + 30 + 30);// (sub-bar + header + footer + padding top + padding bottom)
    $('#myTabContent').height( h );

    if (!this.checkBiome())
      this.dialog.open(DialogComponent, {
        data: {message: "This is not a valid URL!"}, width : '450px'
      }); 
    
    // draw grid
    this.drawGrid();

    // change tab event
    var self = this;
    $(".mr-auto a.nav-link").click(function() {      
      var idx = self.lois.findIndex(function(el) {
        return el.value == self.selectedLoi;
      });
      // match tab index with loi
      var id:any = $(this).find("span").attr("id")
      if (!(idx == Number(id))) {        
        self.selectedLoi = self.lois[Number(id)].value;
        self.getMap();
      }
      $('li.nav-item.active').removeClass('active');      
      $(this).closest('li').addClass('active');      
    });

    if (this.type == "rates") 
      $("a.rates").closest('li').addClass("enable_menu");      
    else
      $("a."+this.biome).closest('li').addClass("enable_menu");
    
    // get data 
    this.getData(this.selectedClass);
    
  }

  ngOnDestroy() {
    
    // cancel subscription for biome data
    this.biomeSubscription.unsubscribe();
    this.typeSubscription.unsubscribe();
    
  }

  filterByLoi(key:number) {
    this.applyCountyFilter(key);
    dc.redrawAll();
  }

  updateLegend():void {

    var self = this;
    $("#barchart-legend").click(function() {
      if($("#barchart-legend").hasClass('active')) {
        $("#barchart-legend").removeClass('active');
        $("#barchart-legend").addClass('deactivate');
        $(".dc-legend").first().hide();
      } else {
        $("#barchart-legend").removeClass('deactivate');
        $("#barchart-legend").addClass('active');      
        $(".dc-legend").first().show();
      }
    });

    $("#serieschart-legend").click(function() {
      if($("#serieschart-legend").hasClass('active')) {
        $("#serieschart-legend").removeClass('active');
        $("#serieschart-legend").addClass('deactivate');
        if(self.type == 'rates')
          $(".dc-legend").hide();
        else
          $(".dc-legend:eq(1)").hide();
      } else {
        $("#serieschart-legend").removeClass('deactivate');
        $("#serieschart-legend").addClass('active');      
        if(self.type == 'rates')
          $(".dc-legend").show();
        else
          $(".dc-legend:eq(1)").show();
      }
    });
  }

  applyCountyFilter(key:number){
    let self=this;
    if(!key) {
      this.rowChart.data(function (group:any) {
        let fakeGroup:any=[];
        fakeGroup.push({key:'no value',value:0});
        return (group.all().length>0)?(group.top(self.maxLoi)):(fakeGroup);
      });
    }else{
      
      this.rowChart.data(function (group:any) {
        let filteredGroup:any=[], index:number=-1, allItems:any=group.top(Infinity);
        
        allItems.findIndex(function(item:any,i:number){
          if(item.key==key){
            index=i;
            filteredGroup.push({key:item.key,value:item.value});
          }          
        });

        if (index == -1) {
          let fakeGroup:any=[];
          fakeGroup.push({key:'no value',value:0});
          return (group.all().length>0)?(group.top(self.maxLoi)):(fakeGroup);            
        }

        let ctl:number=1, max:any=[], min:any=[];
        
        while (max.length <= self.maxLoi && min.length <= self.maxLoi && (max.length+min.length+1) <= self.maxLoi) {
          
          let item:any=allItems[index+ctl];
          if(item) min.push({key:item.key,value:item.value});

          item=allItems[index-ctl];
          if(item) max.push({key:item.key,value:item.value});

          ctl++;

          if (max.length == allItems.length || min.length == allItems.length || max.length+min.length+1 == allItems.length)
            break;

        }
        
        filteredGroup=filteredGroup.concat(max);
        min.reverse();
        filteredGroup=min.concat(filteredGroup);
        filteredGroup.reverse();
        
        return filteredGroup;
      });

      // -----------------------------------------------------------------
      // enable this line if you want to clean municipalities of the previous selections.
      //this.rowChart.filterAll();
      // -----------------------------------------------------------------
      this.rowChart.filter(key);
      dc.redrawAll();
    }
  }

  /**
   * Used by search service.
   */
  getLoiNames(): Array<Object> {
    let self = this;
    var keys = self.rowChart.group().top(Infinity).map(function(element:any) {
      return element.key;
    });

    var aux = this.loiNamesObject.filter(
                                  (element:any) => {
                                    return keys.indexOf(element.key) > -1;
                                  }                                  
                                );

    return aux;
  }

  /**
   * Used to generate the CSV and push as stream to download by browser.
   */
  downloadCSV():void {
    // call function inside this
    let self = this;
    let allData=this.tableDateDim.top(Infinity);
    let csv:any=[];
    allData.forEach(function(d:any) {
      csv.push({
        year:d.endDate,
        //areaTotal:d.area+d.filteredArea,
        area:d.area,
        //filteredArea:d.filteredArea,
        loi:self.loiNames[d.loiName]
      });
    });
    let blob = new Blob([self.csvFormat(csv)], {type: "text/csv;charset=utf-8"}),
    dt = new Date(),
    fileName=dt.getDate() + "_" + dt.getMonth() + "_" + dt.getFullYear() + "_" + dt.getTime();
    FileSaver.saveAs(blob, 'terrabrasilis_'+this.biome+'_'+fileName+'.csv');
  }

  csvFormat(json:any):any {
    return d3.csvFormat(json);
  }

  // check biome in the url 
  checkBiome():boolean {

    let value = Constants.DASHBOARD_BIOMES_NAMES.indexOf(this.biome.toLowerCase().replace(" ", "-")) > -1;
    
    if (!value)
      this.biome = null;    

    return value;

  }

  drawGrid():void {

    // call function inside this
    var self = this;

    $(function () {
      
      // define options for gridstack (e.g., size, resizable handles, tolerance to remove, etc.)
      var options = {  
          width: 12,
          float: false,
          removable: '.removable',
          removeTimeout: 100,
          tolerance: "pointer",
          acceptWidgets: '.grid-stack-item',
          alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
          resizable: {
              handles: 'e, se, s, sw, w'
          }
      };
      
      // define two grids (main and side)
      $('#main-grid').gridstack(options);      
      
      // assign main and nav grid to gridstack 
      var mainGrid = $('#main-grid').data('gridstack');
      
      // params -> [tag, x: number, y: number, width: number, height: number]
      function append2Grid(grid:any, tag:any, x:any, y:any, width:any, height:any) {
        grid.addWidget(tag, x, y, width, height);
      }
      
      // build main grid
      function buildMainGrid() {
        if(self.type != 'rates') {
          append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-incr"> <span class="aggregateTemporal">Aggregated Temporal Data </span> <i class="material-icons pull-right">open_with</i> <button id="barchart-legend" class="btn btn-primary btn-success btn-sm btn-csv active" ng-click="barChartLegend()">Legend</button></div><div id="bar-chart"></div></div></div>', 0, 0, 7, 6);
          append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-incr"> <span class="absoluteData"> Absolute Data </span> <i class="material-icons pull-right">open_with</i> </div><div id="row-chart"></div></div></div>', 8, 0, 5, 6);
          append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-incr"> <span class="timeSeries"> Time Series </span> <i class="material-icons pull-right">open_with</i> <button id="serieschart-legend" class="btn btn-primary btn-success btn-sm btn-csv active" ng-click="seriesChartLegend()">Legend</button> </div><div id="series-chart"></div></div></div>', 0, 7, 7, 6);
          append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-incr"> <span class="tableLois"> Area per years and Local of Interests </span> <i class="material-icons pull-right">open_with</i><button id="download-csv" class="btn btn-primary btn-success btn-sm btn-csv" ng-click="downloadCSV()">Download CSV</button> </div><div id="table-chart"><table id="tb-area" class="table table-hover dc-data-table dc-chart"></table></div></div></div>', 8, 7, 5, 6);
          append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-incr"> <span class="aggregateSpatial"> Aggregated Spatial Data </span> <i class="material-icons pull-right">open_with</i> </div><div id="loi-chart"></div></div></div>', 0, 15, 12, 6);
          $('.grid-stack-item').draggable({cancel: "#bar-chart, #loi-chart, #series-chart, #row-chart, #download-csv, #table-chart" });
        } else {
          append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-rates"> <span class="aggregateTemporal">Aggregated Temporal Data </span> <button id="barchart-legend" class="btn btn-primary btn-success btn-sm btn-csv active" ng-click="barChartLegend()">Legend</button></div><div id="bar-chart"></div></div></div>', 0, 0, 12, 6);
          append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-rates"> <span class="timeSeries"> Time Series </span> <button id="serieschart-legend" class="btn btn-primary btn-success btn-sm btn-csv active" ng-click="seriesChartLegend()">Legend</button> </div><div id="series-chart"></div></div></div>', 0, 7, 12, 6);
          append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-rates"> <span class="tableLois"> Area per years and Local of Interests </span> <button id="download-csv" class="btn btn-primary btn-success btn-sm btn-csv" ng-click="downloadCSV()">Download CSV</button> </div><div id="table-chart"><table id="tb-area" class="table table-hover dc-data-table dc-chart"></table></div></div></div>', 0, 14, 12, 6);
          append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-rates"> <span class="absoluteData"> Absolute Data </span> </div><div id="row-chart"></div></div></div>', 0, 20, 12, 6);
          append2Grid(mainGrid, '<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="custom-drag-rates"> <span class="aggregateSpatial"> Aggregated Spatial Data </span> </div><div id="loi-chart"></div></div></div>', 0, 26, 12, 6);
          $(".grid-stack-item").resizable("disable");
          $(".grid-stack-item").draggable("disable");
          $('.aggregateSpatial').closest(".grid-stack-item").hide();
          $('.absoluteData').closest(".grid-stack-item").hide();
          $('div#main-grid').removeAttr("style");
        }

      }
            
      buildMainGrid();
      
      // restore view when necessary 
      this.loadGrid = function () {
      
        // remove all the items from the main grid and add each widgets again
        mainGrid.removeAll();      
        buildMainGrid();
        addEvents();
        self.makeGraphs();
        self.makeTables();
        return false;

      }.bind(this);
      
      // resizable and draggable gridstack
      $('#side-grid .grid-stack-item').resizable().draggable({
          revert: 'invalid',
          handle: '.grid-stack-item-content',
          scroll: true,
          appendTo: 'body'          
      });

      function addEvents() {
        // add on click to handle download CSV feature
        $("#download-csv").click(function() {
          self.downloadCSV();
        });

        self.updateLegend();
      }
      
      // add on click handle loadGrid call for restore view button 
      $('#load_grid').click(this.loadGrid);

      addEvents();

    });

  } 

  getData(selectedClass:any):void {

    // call of the required json for specific class
    switch(selectedClass) {
      case 'deforestation': {
        this.dataObservable = this.dashboardApiProviderService.getDeforestation(this.httpOptions);  
        break;         
      }
      case "deforestation_rates": {
        this.dataObservable = this.dashboardApiProviderService.getDeforestationRates(this.httpOptions);
        break; 
      }
    }
    
    // get all loinames
    this.dataLoinamesObservable = this.dashboardApiProviderService.getLoinames(this.httpOptions);
    
    // call function for map parameters    
    forkJoin([this.dataObservable, this.dataLoinamesObservable]).subscribe(data => {      
      this.dataJson = data[0];
      this.dataLoinamesJson = data[1];
      this.getMap();
    });
    
  }
  
  getMap():void {

    // call of the required json for specific loi
    switch(this.selectedLoi) {
      case "uf": {
        this.mapObservable = this.dashboardApiProviderService.getUF(this.httpOptions);
        break; 
      }  
      case "mun": {
        this.mapObservable = this.dashboardApiProviderService.getMun(this.httpOptions);
        break; 
      }
      case "consunit": {
        this.mapObservable = this.dashboardApiProviderService.getConsUnit(this.httpOptions);
        break; 
      }
      case "indi": {
        this.mapObservable = this.dashboardApiProviderService.getIndi(this.httpOptions);
        break; 
      }
    }

    this.mapObservable.subscribe(data => {
      this.mapJson = data;
      this.makeGraphs();
      this.makeTables();
    });

  }

  makeTables(): void {
    
    // call function inside this
    let self = this;

    this.tableArea = dc.dataTable('#tb-area', 'tables');
    //let tableRelative = dc.dataTable('#tb-relative', 'tables');

    this.tableYear = 'Year';
    this.tableRegular = (this.type!='rates')?("Area (km²) > 1.00ha"):("Area (km²)");
    this.tableLess = "Area (km²) > 6.25ha";
    //this.tableTotal = "Total Area (km²)";

    this.tableArea
      .dimension(this.tableDateDim)
      .group(function (d:any) {
        
        let loiArea:Number=0;
        self.tableTotalAreaByLoiName.all()
                        .find(function(item:any){
                          if(item.key==d['loiName']){
                            loiArea=item.value;
                            return;
                          };
                        });
        return '<b>' + self.loiNames[d['loiName']] + '</b><span> - ' + DeforestationOptionsUtils.formatNumber(loiArea.valueOf()) + ' km²</span>';
      })
      .size(this.tableDateDim.top(Infinity).length)
//    .sortBy(function(d:any) { return d['loiName']; })
      .sortBy(function(d:any) { return [d['loiName'], +d['endDate']].join(); })      
      .showGroups(true)
      .columns([
        {
          label: "",
          format: function(d:any) {
            
            return +d['endDate'];
          }
        },
        {
          label: this.tableRegular,
          format: function(d:any) {

            return  +d["area"].toFixed(1);
          }
        }
      ])
      .order(d3.ascending)
      .on('renderlet', function (table:any) {
          table.selectAll('.dc-table-group').classed('info', true);
      });

      // add one graph
      this.listCharts.set('table-chart', this.tableArea);
      
  }

  makeGraphs():void {
    
    // call function inside this
    let self=this;
    var allFeatures:any[];
    
    // data wrangling - flatten nested data
    if (this.type == "increments")
      allFeatures = DeforestationOptionsUtils.dataWranglingIncrements(this.dataJson, this.biome);
    else
      allFeatures = DeforestationOptionsUtils.dataWranglingRates(this.dataJson);

    // get loiNames
    self.loiNames = new Map<number, string>();
    self.loiNamesObject = new Array();

    this.dataLoinamesJson.lois
                          .filter(
                            (filteredLoi:any) => {
                              return filteredLoi.name === this.selectedLoi
                          })
                          .map(
                            (loi:any) => { 
                              if (loi.gid == 2)
                                  DeforestationOptionsUtils.setLoiNamesSplit(loi, self);
                              else
                                  DeforestationOptionsUtils.setLoiNames(loi, self);
                          });
    
    // filter and change loinames
    var filteredFeatures = allFeatures.filter(
      (filteredData:any) => {
        return filteredData.loiName in self.loiNames;
      }
    ).map(
      function(e:any) {
        return {
          endDate: e.endDate,
          loiName: e.loiName,
          area: e.area,
          filteredArea: e.filteredArea
        };
      }
    );
    
    // create a crossfilter instance [endDate, loiName, area, filteredArea]
    var ndx = crossfilter(filteredFeatures);
    
    // define dimensions
    var dateDim = ndx.dimension(
      function(d:any) { 
        return +d["endDate"];
      }
    );

    this.loiNameDim = ndx.dimension(
      function(d:any) { 
        return d["loiName"];
      }
    );

    var areaDim = ndx.dimension(
      function(d:any) { 
        return +d["area"]; 
      }
    );

    this.tableDateDim = ndx.dimension(
      function(d:any) { 
        return +d['endDate'];
      }
    );
    
    var loiNameYearDim = ndx.dimension( function(d:any):any {
      return [d["loiName"], +d["endDate"]];
    });

    // calculate metrics
    this.areaByDate = dateDim.group().reduceSum(
      function(d:any) {
        return +d["area"];
      }
    );

    this.filteredAreaByDate = dateDim.group().reduceSum(
      function(d:any) {
        return +d["filteredArea"];
      }
    );
    
    this.areaByLoiName = this.loiNameDim.group().reduceSum(
      function(d:any) {
        return +d["area"];
      }
    );

    this.tableTotalAreaByLoiName = this.loiNameDim.group().reduceSum(
      function(d:any) {
        return (+d["area"]);
      }
    );

    var areaByloiNameYear = loiNameYearDim.group().reduceSum(function(d:any) {
      return +d["area"];
    });

    var yearGroup = dateDim.group().reduceSum(function(d:any) {
      return +d["endDate"];
    });
    
    // define values (to be used in charts)
    this.minDate = dateDim.bottom(1)[0]["endDate"];
    this.maxDate = dateDim.top(1)[0]["endDate"]; 
    
    // define list of charts
    this.listCharts = new Map();
    var transition = 150;
    
    // define dc charts
    this.barChart = dc.compositeChart("#bar-chart");
    this.area = dc.barChart(this.barChart);
    this.filteredArea = dc.barChart(this.barChart);

    this.seriesChart = dc.seriesChart("#series-chart");
    
    this.rowChart = dc.rowChart("#row-chart");

    let redrawMap:any={
      ctrlTimeout:0,
      call:function(mapJson:any, areaByLoiName:any, filteredLoiName:any) {
      
        function diff(arr1:any, arr2:any) {
          var ret = [];        
          for(var i = 0; i < arr1.top(Infinity).length; i += 1) {
              if(arr2.indexOf(arr1.top(Infinity)[i].key) > -1){
                  ret.push(arr1.top(Infinity)[i]);
              }
          }    
          if (!ret.length)          
            ret = areaByLoiName.top(Infinity);    
          return ret;
        };

        var auxAreaByLoiName:any = diff(areaByLoiName, filteredLoiName);

        var max:any = auxAreaByLoiName[0].value;

        var nro:number = Constants.MAP_LEGEND_GRADES;
        
        Terrabrasilis.setLegend(max, nro);
        Terrabrasilis.setColor(Constants.MAP_LEGEND_COLORS);

        var auxMapJson:any = Object.assign({}, mapJson);     
        auxMapJson["features"] = [];
          
        if (auxAreaByLoiName.length == areaByLoiName.top(Infinity).length) {
          mapJson["features"].forEach(function(feature:any) {
            
            var auxIndex = auxAreaByLoiName.findIndex(
                          (obj:any) => { return (self.loiNames[obj.key] == feature["properties"].name) }
                        );
            
            // if loiname exists
            if (auxIndex > -1) {
              feature["properties"].density = auxAreaByLoiName[auxIndex].value;
              auxMapJson["features"].push(feature);
            }

          });
        } else {
          auxAreaByLoiName.forEach(function(element:any, index:any, object:any) {
            
            var auxIndex = mapJson["features"].findIndex(
                          (obj:any) => { return (self.loiNames[element.key] == obj["properties"].name)}
                        );
            
            // if loiname exists
            if (auxIndex > -1) {   
              var currentIdx = auxMapJson["features"].push(mapJson["features"][auxIndex]) - 1;
              auxMapJson["features"][currentIdx]["properties"].density = element.value;            
            }

          });
        }

        if (Terrabrasilis.hasDefinedMap())  // map is already initialized
          Terrabrasilis.disableMap();          
        
        var geojsonLayers:any = [{
          "type": "Multipolygon",     
          "name": "loi",
          "active": true,
          "style": DeforestationOptionsUtils.style,
          "features": auxMapJson["features"]
        }];
    
        // mount a simple map 
        //-50, -13
        Terrabrasilis.map(0, 0, 5, 'loi-chart') 
                    .addBaseLayers()
                    .addGeoJsonLayers(geojsonLayers);
        
        Terrabrasilis.disableLoading("#loi-chart");

      }
    };

    // add one graph
    this.listCharts.set('loi-chart', "terrabrasilis-api");

    this._translate.get('dashboard.graph.label.area').subscribe((text) => {
      this.labelArea = text;
    });

    function snapToZero(sourceGroup:any) {
      return {
        all:function () {
          return sourceGroup.all().map(function(d:any) {
            return {key:d.key,value:( (Math.abs(d.value)<1e-6) ? 0 : d.value )};
          });
        },
        top: function(n:any) {
          return sourceGroup.top(Infinity)
            .filter(function(d:any){
              return (Math.abs(d.value)>1e-6);
              })
            .slice(0, n);
        }
      };
    }

    this.area
      .clipPadding(0)
      .barPadding(0.3)
      //.group(snapToZero(this.areaByDate), ">1.00ha")
      .group(snapToZero(this.areaByDate), ">1.00ha")
      .colors("#bde397")
      .valueAccessor(
        function (d:any) {
          return d["value"];
        }
      )
      .label(function(d:any) {
        return DeforestationOptionsUtils.formatNumber(d.data.value);
      })
      .title(
        function (d:any) {
          // var value:any;
          // isNaN(d["value"])?(value = 0):(value = Math.round(d["value"]));
          let a=(self.type=='rates')?(""):(">1.00ha");
          return d.key + "\n"
          + d.value.toFixed(2) + " km²\n"
          + a;
        }
      )
      .addFilterHandler(function(filters:any, filter:any) {
        filters.push(filter);
        if(!self.filteredArea.hasFilter() || self.filteredArea.filters().indexOf(filter)<0){
          self.filteredArea.filter(filter);
        }
        return filters;
      })
      .removeFilterHandler(function(filters:any, filter:any) {
        var pos=filters.indexOf(filter);
        filters.splice(pos,1);
        self.filteredArea.filter(null);
        filters.forEach((f:any) => {
          self.filteredArea.filter(f);
        });
        return filters;
      });      

    this.filteredArea
      .clipPadding(0)
      .barPadding(0.3)
      .group(snapToZero(this.filteredAreaByDate), ">6.25ha")
      .colors("#ffd76d")
      .valueAccessor(function (d:any) {
        return d.value;
      }) 
      .label(function(d:any) {
        return DeforestationOptionsUtils.formatNumber(d.data.value);
      })
      .title(
        function (d:any) {
          var value;
          isNaN(d["value"])?(value = 0):(value = Math.round(d["value"]));
          return d.key + "\n" 
          + d.value.toFixed(2) + " km²\n"
          + ">6.25ha";
        }
      )
      .addFilterHandler(function(filters:any, filter:any) {
        filters.push(filter);
        if(!self.area.hasFilter() || self.area.filters().indexOf(filter)<0){
          self.area.filter(filter);
        }
        return filters;
      })
      .removeFilterHandler(function(filters:any, filter:any) {
        var pos = filters.indexOf(filter);
        filters.splice(pos,1);
        self.area.filter(null);
        filters.forEach((f:any) => {
          self.area.filter(f);
        });
        return filters;
      });
      
    var barChartWidth = $('#bar-chart')[0].offsetWidth;
    var barChartHeight = $('#bar-chart')[0].offsetHeight;
    
    this.barChart.width(barChartWidth)
            .height(barChartHeight)
            .shareTitle(false)
            .transitionDuration(transition)
            .margins({top: 10, right: 10, bottom: 50, left: 50})
            .dimension(dateDim)
            .group(snapToZero(this.areaByDate))
            .elasticY(true)
            .yAxisPadding('10%')
            //.xAxisLabel("Brazilian "+ this.biome.charAt(0).toUpperCase() + this.biome.slice(1)+" Monitoring Period: "+this.minDate+" - "+this.maxDate)
            .yAxisLabel(this.labelArea)
            .x(d3.scaleBand().rangeRound([0, barChartWidth]))
            .brushOn(false)
            .controlsUseVisibility(false)
            .addFilterHandler(function(filters:any, filter:any) {return [filter];})
            .xUnits(dc.units.ordinal)
            .renderHorizontalGridLines(true)
            .renderVerticalGridLines(true)
            ._rangeBandPadding(0.2)
            .compose([this.area, this.filteredArea])
            .on("pretransition", (chart:any) => {
              Terrabrasilis.enableLoading("#bar-chart");
              var bars = chart.selectAll("rect.bar");
              if (self.area.hasFilter() || self.filteredArea.hasFilter()) {
                bars.classed(dc.constants.DESELECTED_CLASS, true);
                bars._groups[0].forEach( (bar:any) => {
                  if(self.area.filters().indexOf(bar.__data__.x) >= 0 || self.filteredArea.filters().indexOf(bar.__data__.x) >= 0){
                    bar.setAttribute('class', 'bar selected');
                  }
                });
              } else {
                  bars.classed(dc.constants.SELECTED_CLASS, true);
              }
              
            });

    if(this.type != "rates") {
      this.barChart.legend( dc.legend().x(2*barChartWidth/3).y(5).itemHeight(13).gap(5).legendText(function(d:any, i:any) { return d.name; }) );
    }
    
    this.barChart.on('renderlet', function (chart:any) {
      
      var br:any = d3.selectAll(chart.select('g.sub._1').selectAll('rect.bar'));
      
      var y:any=[];
      
      br._groups[0]._groups[0].forEach((bar:any) => {         
          y.push(+bar.y.animVal.value);
      });

      var txt:any = d3.selectAll(chart.select('g.sub._1').selectAll('text'));
      
      txt._groups[0]._groups[0].forEach((el:any, idx:any) => {
        el.setAttribute("y", y[idx]+11);
      });

      Terrabrasilis.disableLoading("#bar-chart");

    });

    this.barChart.on("renderlet.a",function (chart:any) {
      // rotate x-axis labels
      chart.selectAll('g.x text')
        .attr('transform', 'translate(-10,10) rotate(315)');
    });

    // add one graph
    this.listCharts.set('bar-chart', this.barChart);

    var seriesChartWidth = $('#series-chart')[0].offsetWidth;
    var seriesChartHeight = $('#series-chart')[0].offsetHeight;
    
    var auxYears:any=[],auxRates:any=[];
    yearGroup.all().forEach(function(y){
      auxYears.push(+y.key);
      auxRates.push(y.value);
    });
    
    var xScale = d3.scaleLinear()
      .domain([auxYears[0] -1,auxYears[auxYears.length-1]+1])
      .range([auxRates[0],auxRates[auxRates.length-1]]);

    this.seriesChart.chart(function(c:any) {
                  return dc.lineChart(c)
                    .curve(d3.curveCardinal.tension(0.5))
                    .renderDataPoints({radius: 4})
                    .evadeDomainFilter(true);
                })
                .width(seriesChartWidth)
                .height(seriesChartHeight)
                .margins({top: 10, right: 15, bottom: 30, left: 50})
                .dimension(loiNameYearDim)
                .group(snapToZero(areaByloiNameYear))
                .seriesAccessor(function(d:any) { 
                    return d.key[0]; // connect with legend
                }) 
                .keyAccessor(function(d:any) { 
                  return d.key[1]; // connect with x axis
                }) 
                .valueAccessor(function(d:any) {
                  return d.value; // connect with y axis
                })
                .title(function(d:any) {
                  return  self.loiNames[d.key[0]] + "\n" +
                          d.key[1] + "\n" +
                          d.value.toFixed(2) + " km²";
                })
                .yAxisPadding('15%')
                .elasticY(true)
                .elasticX(false)
                //.xAxisLabel("Brazilian "+this.biome.charAt(0).toUpperCase() + this.biome.slice(1).replace("_", " ")+" Monitoring Period: "+this.minDate+" - "+this.maxDate)
                .yAxisLabel(this.labelArea)
                .x(xScale)
                .mouseZoomable(false)
                .renderHorizontalGridLines(true)
                .renderVerticalGridLines(true)
                .legend(dc.legend().x(0.65*seriesChartWidth).y(10).itemHeight(13).gap(5).legendText(function(d:any, i:any) { 
                  return self.loiNames[d.name];
                }))
                .brushOn(false);

    this.seriesChart.data(function (group:any) {
                  Terrabrasilis.enableLoading("#series-chart");
                  var aux:any = []; 
                  // filter by years from composite bar chart
                  if (!self.area.hasFilter()) {                    
                    self.areaByDate.top(Infinity).forEach(function(element:any) {
                      aux = aux.concat(group.top(Infinity)
                                .filter(function(loiname:any){ 
                                  return loiname.key[1] == element.key
                                })
                                .map(function(loiname:any){ 
                                  return loiname;
                                })
                            )
                    });
                  } else {
                    self.area.filters().forEach(function(element:any) {
                      aux = aux.concat(group.top(Infinity)
                                .filter(function(loiname:any){ 
                                  return loiname.key[1] == element
                                })
                                .map(function(loiname:any){ 
                                  return loiname;
                                })
                            )
                    })
                  }
                  
                  var result:any = []
                  if (!self.rowChart.hasFilter()) {                    
                    self.areaByLoiName.top(self.maxLoi).forEach(function(element:any) { 
                      result = result.concat(aux
                                .filter(function(loiname:any){ 
                                  return loiname.key[0] == element.key
                                })
                                .map(function(loiname:any){ 
                                  return loiname;
                                })
                            )
                    })
                  } else {
                    self.rowChart.filters().forEach(function(element:any) { 
                      result = result.concat(aux//group.top(Infinity)
                                .filter(function(loiname:any){ 
                                  return loiname.key[0] == element
                                })
                                .map(function(loiname:any){ 
                                  return loiname;
                                })
                            )
                    })
                  }
                  
                  return result;
                });
    
    // erase black filling
    this.seriesChart.on('renderlet', function (chart:any) {
      d3.selectAll('.line').style('fill', 'none');
      Terrabrasilis.disableLoading("#series-chart");
    });

    this.seriesChart.xAxis().ticks(auxYears.length);
    
    this.seriesChart.xAxis().tickFormat(function(d:any) {
      return d+"";
    });
    
    this.seriesChart.addFilterHandler(function(filters:any, filter:any) {
      filters.push(filter);
      return filters;
    });

    this.seriesChart.on("renderlet.a",function (chart:any) {
      // rotate x-axis labels
      chart.selectAll('g.x text')
        .attr('transform', 'translate(-10,10) rotate(315)');
    });
    
    // add one graph
    this.listCharts.set('series-chart', this.seriesChart);
    
    // add one graph
    var rowChartWidth = $('#row-chart')[0].offsetWidth;
    var rowChartHeight = $('#row-chart')[0].offsetHeight;
            
    this.rowChart.width(rowChartWidth)
            .height(rowChartHeight)
            .margins({top: 10, right: 10, bottom: 20, left: 15})
            .elasticX(true)
            .dimension(this.loiNameDim)
            .group(this.areaByLoiName)            
            .controlsUseVisibility(true)
            .title(function(d:any) {
              return self.loiNames[d.key] + ' : ' + d.value.toFixed(2) + " km²";
            })
            .label(function(d:any) {
              
              // ordered array
              var array = self.areaByLoiName.top(Infinity);
              var order = array.sort(function(a:any, b:any) {
                            return b.value - a.value;
                          });

              // get index 
            var index = order.findIndex(function(loiname:any) {
                return loiname.key == d.key
              });

              var sum:any = array.map((ele:any) => { return ele.value; }).reduce(function(acc:any, ele:any) { return acc + ele; }, 0);

              return (index+1)+"° - "+self.loiNames[d.key] + ' : ' + DeforestationOptionsUtils.formatNumber(d.value) + " km² - ("+((100*(+d.value/sum)).toFixed(2))+"%)";
              
            })
            .ordering(function(d:any) { return -d.value })
            .colors(['#bde397'])
            .labelOffsetY(10)
            .xAxis()
            .ticks(4);
    
    this.rowChart.xAxis().tickFormat(function(d:any) {return d+"km2";});
    
    this.rowChart.data(function (group:any) {       
      Terrabrasilis.enableLoading("#row-chart");
      Terrabrasilis.enableLoading("#loi-chart");
      return group.top(self.maxLoi);
    });

    this.rowChart.on('renderlet', function (chart:any) {
      
      if(!chart.hasFilter())
        self.loiname="*";
      else {
        self.loiname = "[";
        chart.filters().forEach(function(element:any) { 
          self.loiname = self.loiname.concat(chart.group().top(Infinity)
                    .filter(function(ln:any){ 
                      return ln.key == element
                    })
                    .map(function(ln:any){ 
                      return self.loiNames[ln.key];
                    })
                  , ",")
        })
        self.loiname = self.loiname.slice(0, -1) + "]";
      }

      Terrabrasilis.disableLoading("#row-chart");

    });

    this.rowChart.filterPrinter(function(filters:any) {
        var t:any[]=[];
        filters.forEach(function(f:any) {
          t.push(self.loiNames[f]);
        });
        return (filters.length)?(t):(['no filters']);
    });

    // render chart   
    this.listCharts.set('row-chart', this.rowChart);

    $('#reset_filter').click(function() {    
      $("#barchart-legend").removeClass('deactivate');
      $("#barchart-legend").addClass('active');
      $("#serieschart-legend").removeClass('deactivate');
      $("#serieschart-legend").addClass('active');
      self.barChart.filterAll();
      self.rowChart.filterAll();      
      self.seriesChart.filterAll();
      dc.redrawAll();
    });

    (function(j, dc){
      setTimeout(() => {
        dc.renderAll();
      },100 * j);
    })(1, dc);

    dc.renderlet(function() {

      // cancel old call that no run yet
      clearTimeout(redrawMap.ctrlTimeout);
       (function(j, redrawMap, scope){
         redrawMap.ctrlTimeout=setTimeout(() => {
           redrawMap.call(scope.mapJson, scope.areaByLoiName, scope.rowChart.filters());
         },100 * j);
       })(10, redrawMap, self);

      // cancel old call to render table
      clearTimeout(self.ctrlTableTimeOut);
      (function(j, scope){
        scope.ctrlTableTimeOut=setTimeout(() => {
          scope.tableArea.render();
        },100 * j);
      })(10, self);

      // dc legend
      if($("#barchart-legend").hasClass('active'))
        $(".dc-legend").first().show();        
      else
        $(".dc-legend").first().hide();
      
      if($("#serieschart-legend").hasClass('active')) {
        if(self.type == 'rates')
          $(".dc-legend").show();
        else
          $(".dc-legend:eq(1)").show();
      }  
      else {
        if(self.type == 'rates')
          $(".dc-legend").hide();
        else
          $(".dc-legend:eq(1)").hide();
      }
    });

    // initial window settings
    var h = $(window).height(), w = $(window).width();

    // when window resize
    $(window).resize(function() {

      // update window size
      var nh = $(window).height(), nw = $(window).width();
      // compare previous and new window size
      if (!(nh == h && nw == w)) {
        h = nh;
        w = nw;
        var arrKeys = Array.from(self.listCharts.keys());
        for (let item of arrKeys) {
          DeforestationOptionsUtils.render(item, self.listCharts, transition, self.loiNames, self.type); // when window resize render each graph again
        }
      }

      self.tagId = $(".ui-resizable-resizing > .grid-stack-item-content > div:nth-child(2)").attr("id");

    });
    
    $('#main-grid').on('resizestop', function (event:any, ui:any) {
      DeforestationOptionsUtils.render(self.tagId, self.listCharts, transition, self.loiNames, self.type);      
    });

    this.updateGridstackLanguage();

    // check whether rates
    if(this.type == "rates") {
      $('[id="1"]').closest('li').hide();
      $('[id="2"]').closest('li').hide();
      $('[id="3"]').closest('li').hide();
      $('#barchart-legend').hide();
    } else {
      $('[id="1"]').closest('li').show();
      $('[id="2"]').closest('li').show();
      $('[id="3"]').closest('li').show();      
    }
      
  }

  changeLanguage(value:string) {
    
    this.localStorageService.setValue(this.languageKey, value);
    this._translate.use(value);  
    this.updateGridstackLanguage();
    
  }

  updateGridstackLanguage():void {

      

    forkJoin([(this.type == "rates")?(this._translate.get('dashboard.graph.aggregateTemporalRates')):(this._translate.get('dashboard.graph.aggregateTemporalIncrements')),
              this._translate.get('dashboard.graph.aggregateSpatial', { maxDate: this.maxDate }),
              (this.type == "rates")?(this._translate.get('dashboard.graph.timeSeriesRates')):(this._translate.get('dashboard.graph.timeSeriesIncrements')),
              this._translate.get('dashboard.graph.absoluteData', { maxDate: this.maxDate }),
              this._translate.get('dashboard.graph.tableLois.title', { maxDate: this.maxDate }),
              this._translate.get('dashboard.graph.label.area'),
              this._translate.get('dashboard.graph.label.taxa'),
              //this._translate.get('dashboard.graph.label.monitoring', {biome: this.biome.charAt(0).toUpperCase()+this.biome.slice(1).replace("_", " "), minDate: this.minDate, maxDate: this.maxDate}),
              this._translate.get('dashboard.graph.label.regularArea'),
              this._translate.get('dashboard.graph.label.filteredArea'),
              this._translate.get('dashboard.loi.uf'),
              this._translate.get('dashboard.loi.mun'),
              this._translate.get('dashboard.loi.consunit'),              
              this._translate.get('dashboard.loi.indi'),
              this._translate.get('dashboard.options.legend'),
              this._translate.get('dashboard.graph.'+this.biome),
              this._translate.get('dashboard.loi.'+this.selectedLoi)
            ]).subscribe((data) => {
                $('.aggregateTemporal').text(data[0]+" - "+data[14]);
                $('.aggregateSpatial').text(data[1]);
                $('.timeSeries').text(data[2]+" - "+data[15]);
                $('.absoluteData').text(data[3]+" - "+data[15]);
                $('.tableLois').text(data[4]+" - "+data[15]);
                this.labelArea = data[5];
                this.labelRates = data[6];
                this.labelRegularArea = data[7];
                this.labelFilteredArea = data[8];
                this.barChart.yAxisLabel((this.type == "rates")?(this.labelRates):(this.labelArea));
                this.barChart.render();
                this.seriesChart.yAxisLabel((this.type == "rates")?(this.labelRates):(this.labelArea));
                this.seriesChart.render();
                Terrabrasilis.disableLoading("#loi-chart");
                $("#barchart-legend").removeClass('deactivate');
                $("#barchart-legend").addClass('active');
                $("#serieschart-legend").removeClass('deactivate');
                $("#serieschart-legend").addClass('active');
                $('#0').text(data[9]);
                $('#1').text(data[10]);
                $('#2').text(data[11]);
                $('#3').text(data[12]);
                $('#barchart-legend, #serieschart-legend').text(data[13]);
              });
    
    }
  
    showContact() {
      this.cdRef.detectChanges();
      this.dialog.open(ContactComponent, { width : '450px' });
    }

    showAbout() {
      this.cdRef.detectChanges();
      this.dialog.open(AboutComponent, {
          width : '980px',
          minWidth: '700px',
          height: '630px',
          minHeight: '410px'
      });
    }
}