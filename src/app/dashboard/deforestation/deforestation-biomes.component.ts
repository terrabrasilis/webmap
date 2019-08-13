import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionLike as ISubscription } from "rxjs";

import { Router } from '@angular/router';

import { Geojson } from '../../entity/geojson';
import { Constants } from '../../util/constants';

import { DashboardApiProviderService } from '../../services/dashboard-api-provider.service'; 

import * as d3 from "d3";

declare var _ : any;
declare var dc : any;

@Component({
  selector: 'app-deforestation-biomes',
  templateUrl: './deforestation-biomes.component.html',
  styleUrls: ['./deforestation-biomes.component.css']
})

export class DeforestationBiomesComponent implements OnInit {
    
  // biomes json variable
  public biomes: Geojson;

  // subscription to get api data
  private subscription: ISubscription; 

  // define variables for the biomes map
  public width: number; 
  public height: number;
  public overlayMultiplier: number;
  public overlayOffset: number;
  public d: number;
  public i: number;

  // define variables for d3 
  public g: any;
  public svg: any;
  public color: any;
  public path: any;
  public projection: any;

  constructor(private router: Router, private dashboardApiProviderService: DashboardApiProviderService) { 
    // initialize window size variables
    this.width = window.screen.width;    
    this.height = window.screen.height;    
    this.overlayMultiplier = 10;    
    this.overlayOffset = this.overlayMultiplier / 2 - 0.5;
  }  

  // go home
  goHome(){
    this.router.navigate([""]);
  }

  // add mouse over handlers
  mouseOverHandler(d:any, i:any):void {
    d3.select(d3.event.currentTarget).attr("opacity", 0.7);
  }
  
  // add mouse out handlers
  mouseOutHandler(d:any, i:any):void {
    d3.select(d3.event.currentTarget).attr("fill", this.color(i)).attr("opacity", 1);
  }
  
  // mouse click handlers
  clickHandler(d:any, i:any):void {        
    this.router.navigate(['dashboard/deforestation/biomes/'+this.biomes.features[i].properties.name.toLowerCase().replace(" ", "-")]);
  }
  
  ngOnInit() {
    // on initialization of the component
    this.getBiomes();
    
  } 

  getBiomes():void {
    // create subscription 
    /*this.subscription = this.dashboardApiProviderService.getBiomes()
                                    .subscribe((data: Geojson) => {      
                                      this.biomes = data
                                      this.prepareContainer();                                  
                                      this.reprojectData();                                  
                                      this.designContainer();                  
                                      this.renderMap();                                      
                                    });*/
  }

  ngOnDestroy() {
    // destroy subscription for biome data
    this.subscription.unsubscribe();
  }

  prepareContainer():void {
    // prepare a SVG container for the map
    this.svg = d3.select("#map_container")
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 600 400")
                .classed("map_container-responsive", true); 
  
    this.g = this.svg
                  .append("g");

    this.g
    .append("rect")
    .attr("width", this.width * this.overlayMultiplier)
    .attr("height", this.height * this.overlayMultiplier)
    .attr(
      "transform",
      "translate("+(-this.width * this.overlayOffset)+","+(-this.height * this.overlayOffset)+")"
    )
    .style("fill", "none")
    .style("pointer-events", "all");
  }

  reprojectData():void { 
    // define map projection
    this.projection = d3
    .geoMercator()
    .center([-52, -15])
    .scale(400);    
  }
    
  designContainer():void {    
    // define d3 map path and colors
    this.path = d3.geoPath().projection(this.projection);
    this.color = d3.scaleOrdinal().range(Constants.DASHBOARD_BIOMES_COLORS); 
  } 
  
  renderMap():void {
    // place the biome name in the map
    this.g.append("g").selectAll("path")
      .data(this.biomes.features)
      .enter()
      .append("path")
      .attr("d", this.path)
      .attr("fill", (d:any, i:any) => this.color(i)) 
      .attr("stroke", "#FFF")
      .attr("stroke-width", 0.5)
      .attr(
        "transform",
        "translate("+(-150)+","+(-110)+")"
      )
      .on("mouseover", (d:any, i:any) => this.mouseOverHandler(d, i))
      .on("mouseout", (d:any, i:any) => this.mouseOutHandler(d, i))
      .on("click", (d:any, i:any) => this.clickHandler(d, i));
  
    this.g
      .append("g")
      .selectAll("text")
      .data(this.biomes.features)
      .enter()
      .append("text")
      .attr("transform", (d:any) => {
        var str = `${this.path.centroid(d)}`;
        var lat = str.substr(0, str.indexOf(','));
        var long = str.substr(str.indexOf(',')+1, str.length);
        return "translate("+(Number(lat)-150)+","+(Number(long)-110)+")"})
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .text((d:any, i:any) => this.biomes.features[i].properties.name);
  }
  
}