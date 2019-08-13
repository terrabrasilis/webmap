import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Vision } from '../entity/vision';
import { Layer} from '../entity/layer';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LayerInfoProviderService {

  private baselayers: Array<Layer> = new Array();
  private overlayers: Array<Vision> = new Array();

  constructor(public http: HttpClient) {}

  public getLayerInfo(infoUrl: string): Observable<any> {
      return of(this.http.get(infoUrl));
  }

  public getLegend(legendUrl: string): Observable<Blob> {
      return this.http.get(legendUrl, { responseType: 'blob' });
  }

  public getLayers(baselayer: boolean, type:string): Observable<any> {        
    let layers = null;
    if (baselayer) {
      layers = of(this.getBaselayers());
    } else {
      layers = of(this.getOverlayers(type));
    }   
    return layers;
  }  

  private getBaselayers(): Layer[] {
    // this.baselayers = new Array (
    //   new Layer("OSM", "osm", "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", null, null, false, null, true,
    //       "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>", null, "", null, null, null),
    //   new Layer("OSM Black", "osm_black", "http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png", null, null, false, null, true, 
    //       "Map data &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>", null, "", null, null, null),
    //   new Layer("OSM Topo", "osm_topo", "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", null, null, false, null, true, 
    //       "Map data: &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>, <a href=\"http://viewfinderpanoramas.org\">SRTM</a> | Map style: &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a> (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>", null, "", null, null, null),    
    //   new Layer("Google Satelite", "google_satelite", "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", null, null, false, [
    //       new LayerSubDomains("mt0"),
    //       new LayerSubDomains("mt1"),
    //       new LayerSubDomains("mt2"),
    //       new LayerSubDomains("mt3")
    //   ], true, null, null, "", null, null, null), 
    //   new Layer("Google Hybrid", "google_hybrid","http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", null, null, true, [
    //       new LayerSubDomains("mt0"),
    //       new LayerSubDomains("mt1"),
    //       new LayerSubDomains("mt2"),
    //       new LayerSubDomains("mt3")
    //   ], true, null, null, "", null, null, null), 
    //   new Layer("Google Streets", "google_streets","http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", null, null, false, [
    //       new LayerSubDomains("mt0"),
    //       new LayerSubDomains("mt1"),
    //       new LayerSubDomains("mt2"),
    //       new LayerSubDomains("mt3")
    //   ], true, null, null, "", null, null, null), 
    //   new Layer("Google Terrain", "google_terrain","http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", null, null, false, [
    //       new LayerSubDomains("mt0"),
    //       new LayerSubDomains("mt1"),
    //       new LayerSubDomains("mt2"),
    //       new LayerSubDomains("mt3")
    //   ], true, null, null, "", null, null, null),    
    //   new Layer("Blank", "blank", "", null, null, false, null, true, "", null, "", null, null, null),
    // );
    // return this.baselayers; 
    return null;
  }

  private getOverlayers(type:string): Vision[] {
    // let prodesAmz = new Array();
    // let prodesCerrado = new Array();
    // let deterAmz = new Array();
    // let deterCerrado = new Array();

    // // let host = "http://terrabrasilis.info/fip-service/gwc/service/wms";
    // // let prodesWorkspace = "fip-project-prodes";
    // // let fipWorkspace = "fip-cerrado";
    
    // let host = "http://terrabrasilis.dpi.inpe.br/geoserver/gwc/service/wms"; 
    // // let host = "http://terrabrasilis2.dpi.inpe.br:10080/geoserver/gwc/service/wms"; 
    
    // let prodesAmzWorkspace = "prodes-amz";
    // let prodesCerradoWorkspace = "prodes-cerrado";
    // let deterAmzWorkspace = "deter-amz";
    // let deterCerradoWorkspace = "deter-cerrado";

    // prodesAmz.push(      
    //   new Layer("AMZ Yearly Deforestation", "yearly_deforestation_2013_2018", host, "#BC0000", prodesAmzWorkspace, true, [], false, null, 0.9, null, null, null, "Prodes Amz",0),
    //   new Layer("Deforestation Mask", "accumulated_deforestation_1988_2012", host, "#FFFF00", prodesAmzWorkspace, true, [], false, null, 0.9, null, null, null, "Prodes Amz",1),
    //   new Layer("Hydrography", "hydrography", host, "#0000FF", prodesAmzWorkspace, true, [], false, null, 0.9, null, null, null, "Prodes Amz",2),
    //   new Layer("Forest - 2016/2017", "forest", host, "#325A00", prodesAmzWorkspace, false, [], false, null, 0.9, null, null, null, "Prodes Amz",3),
    //   new Layer("No Forest", "no_forest", host, "#AA00FF", prodesAmzWorkspace, false, [], false, null, 0.9, null, null, null, "Prodes Amz",4),
    //   new Layer("Cloud - 2016/2017", "cloud", host, "#00FFFF", prodesAmzWorkspace, false, [], false, null, 0.9, null, null, null, "Prodes Amz",5),
    //   new Layer("Legal Amazon", "brazilian_legal_amazon", host, "#000000", prodesAmzWorkspace, true, [], false, null, 0.9, null, null, null, "Prodes Amz",6)
    // );

    // prodesCerrado.push(      
    //   new Layer("States", "estados", host, "#325A00", prodesCerradoWorkspace, true, [], false, null, 0.9,"http://terrabrasilis.info/files/fipcerrado/estados_cerrado.zip", null, null, "Prodes Cerrado",0),
    //   new Layer("Cerrado Yearly Deforestation", "prodes_cerrado_2000_2017_uf_mun", host, "#FFFF00", prodesCerradoWorkspace, true, [], false, null, 0.9,"http://terrabrasilis.info/files/fipcerrado/prodes_cerrado_2000_2017_v20180625.zip", "http://terrabrasilis.dpi.inpe.br/geonetwork/srv/por/catalog.search#/metadata/6b621182-93d6-4a83-b5db-ae53a621276d", "http://terrabrasilis.dpi.inpe.br/dashboard/deforestation/biomes/cerrado/increments", "Prodes Cerrado",1),
    //   new Layer("Biome Border", "limite_cerrado", host, "#325A00", prodesCerradoWorkspace, true, [], false, null, 0.9,"http://terrabrasilis.info/files/fipcerrado/limite_cerrado.zip", null, null, "Prodes Cerrado",2),
    //   new Layer("Counties", "municipios_2017", host, "#BC0000", prodesCerradoWorkspace, false, [], false, null, 0.9,"http://terrabrasilis.info/files/fipcerrado/municipio_cerrado.zip", null, null, "Prodes Cerrado",3),
    //   new Layer("Mosaic", "cerrado_mosaics", host, "#BC0000", prodesCerradoWorkspace, false, [], false, null, 0.9, null, null, null, "Prodes Cerrado",4)
    // );

    // deterCerrado.push(
    //   new Layer("States", "estados", host, "#325A00", prodesCerradoWorkspace, true, [], false, null, 0.9,"http://terrabrasilis.info/files/fipcerrado/estados_cerrado.zip", null, null, "Prodes Cerrado",0),
    //   new Layer("Biome Border", "limite_cerrado", host, "#325A00", prodesCerradoWorkspace, true, [], false, null, 0.9,"http://terrabrasilis.info/files/fipcerrado/limite_cerrado.zip", null, null, "Prodes Cerrado",1),
    //   new Layer("Deforestation Alerts", "cerrado_deforestation_alerts", host, "#BC0000", deterCerradoWorkspace, true, [], false, null, 0.9, "http://terrabrasilis.info/files/deter_cerrado/deter_cerrado_all.zip", "http://terrabrasilis.dpi.inpe.br/geonetwork/srv/por/catalog.search#/metadata/e6e15388-4ca9-49b9-aec9-03891339a35e", "http://terrabrasilis.dpi.inpe.br/dashboard/alerts/biomes/cerrado/daily", "Deter Cerrado",2),
    //   new Layer("Counties", "municipios_2017", host, "#BC0000", prodesCerradoWorkspace, false, [], false, null, 0.9,"http://terrabrasilis.info/files/fipcerrado/municipio_cerrado.zip", null, null, "Prodes Cerrado",3)
    // );

    // deterAmz.push(
    //   new Layer("Deforestation Alerts", "deter_public", host, "#BC0000", deterAmzWorkspace, true, [], false, null, 0.9, null, "http://geometadata.dpi.inpe.br/cgi-bin/csw.py?service=CSW&version=2.0.2&request=GetRepositoryItem&id=DETER_B", null, "Deter AMZ",0),
    //   new Layer("Legal Amazon", "brazilian_legal_amazon", host, "#000000", prodesAmzWorkspace, true, [], false, null, 0.9, null, null, null, "Prodes Amz",1)
    // );

    // switch(type) {
    //   case "alerts": {
    //     this.overlayers.unshift(new Project(true,"Deter Amz", deterAmz,this.overlayers.length));
    //     this.overlayers.unshift(new Project(false,"Deter Cerrado", deterCerrado,this.overlayers.length));
    //     break; 
    //   } 
    //   case "desforestation": {
    //     this.overlayers.unshift(new Project(true,"Prodes Amz", prodesAmz,this.overlayers.length));
    //     this.overlayers.unshift(new Project(false,"Prodes Cerrado", prodesCerrado,this.overlayers.length));
    //     break; 
    //   } 
    //   default: {
    //      this.overlayers = new Array();
    //      break;              
    //   }
    // }

    return this.overlayers;
  }
}
