import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';

/**
 *  import terrabrasilis api from node_modules
 */
import * as Terrabrasilis from 'terrabrasilis-api';
import { DialogComponent } from '../../dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Layer } from '../../entity/layer';
import { Utils } from '../../util/utils';
import { LocalStorageService } from '../../services/local-storage.service';
import { get } from 'lodash'

@Component({
  selector: 'app-terrabrasilis-api',
  template: ``
})
export class TerrabrasilisApiComponent implements OnInit {
  /**
   * Terrabrasilis API module
   */
  private Terrabrasilis: any = Terrabrasilis;

  constructor(
    private dialog: MatDialog
    , private dom: DomSanitizer
    , private cdRef: ChangeDetectorRef
    , private localStorageService: LocalStorageService
    , private _snackBar: MatSnackBar = null
  ) { }

  ////////////////////////////////////////////////
  //// Angular life cycle hooks
  ////////////////////////////////////////////////
  ngOnInit() { }

  ////////////////////////////////////////////////
  //// MapBuilder
  ////////////////////////////////////////////////
  public map(points: any, baselayers: any, overlayers: any): void {
    Terrabrasilis.map(points.longitude, points.latitude)
      .addCustomizedBaseLayers(JSON.parse(JSON.stringify(baselayers)))
      .addCustomizedOverLayers(JSON.parse(JSON.stringify(overlayers)))
      // .addBaseLayers(JSON.parse(JSON.stringify(this.baselayers)))
      // .addOverLayers(JSON.parse(JSON.stringify(this.overlayers)))
      // .enableLegendAndToolToLayers()
      .enableZoomBox()
      .enableDrawFeatureTool()
      .enableLayersControlTool()
      .enableScaleControlTool()
      .enableDisplayMouseCoordinates()
      // .enableInvalidateSize()
      .hideStandardLayerControl()
      .enableGeocodingTool();
  }

  ////////////////////////////////////////////////
  //// Layers interactions
  ////////////////////////////////////////////////
  layerOpacity(layerObject: any, event: any) {
    this.Terrabrasilis.setOpacityToLayer(layerObject, (event.value));
  }

  ////////////////////////////////////////////////
  //// Sidebar header tools
  ////////////////////////////////////////////////
  fullScreen() {
    Terrabrasilis.fullScreen();
  }

  drawSimpleShape() {
    this.showDialog('Terrabrasilis web application.');
  }

  resetMap() {
    Terrabrasilis.resetMap();
  }

  undo() {
    Terrabrasilis.undo();
  }

  redo() {
    Terrabrasilis.redo();
  }

  getFeatureInfo(event: any) {
    Terrabrasilis.addGetLayerFeatureInfoEventToMap(event);
  }

  showCoordinates(event: any) {
    Terrabrasilis.addShowCoordinatesEventToMap(event);
  }

  ////////////////////////////////////////////////
  //// Components
  ////////////////////////////////////////////////
  download(layer: Layer) {
    let download = '';
    layer.downloads.forEach((d: any) => {
      download += '<div><h5 class="card-title">Obter shapefile para ' + layer.title + '.</h5>' +
        '            <p class="card-text">' + d.name + ': ' + d.description + '</p>' +
        '            <a href="' + d.link + '" class="btn btn-primary btn-success">Download</a><div>';
    });

    const html =
      '<div class="container">' +
      '    <div class="card">' +
      '        <div class="card-body">' + download +
      '        </div>' +
      '    </div>' +
      '</div>';
    this.showDialog(html);
  }

  getLegend(layer: any, urlOrCompleteSrcImgElement: boolean): Promise<any> {
    return this.localStorageService.getValue('translate').toPromise()
      .then((item: any) => {
        let language = get(JSON.parse(item), 'value', 'en')
        return Utils.getLegend(layer, urlOrCompleteSrcImgElement, language)
      });
  }


  getBasicLayerInfo(layerObject: any) {
    this.cdRef.detectChanges();

    console.log(layerObject);

    const match = /gwc\/service\/wms/;

    const source = layerObject.datasource != null ?
      (match.test(layerObject.datasource.host) == true ?
        layerObject.datasource.host.replace('gwc/service/wms', 'ows') : layerObject.datasource.host) :
      layerObject.thirdHost;

    const layerBasicInfo = {
      title: layerObject.title,
      layer: layerObject.name,
      workspace: layerObject.workspace,
      source
    };

    const infoTable = '<table class="table-responsive table "><tr class="table-active"><th colspan="3">' + layerBasicInfo.title + '</th></tr>'
      + ' <tr> <td><b>Layer</b></td><td colspan="2">' + layerBasicInfo.layer + '</td></tr>'
      + '<tr><td><b>Workspace</b></td><td colspan="2">' + layerBasicInfo.workspace + '</td></tr>'
      + '<tr><td><b>Source</b></td><td colspan="2">' + layerBasicInfo.source + '</td></tr></table>';

    this.showDialog(infoTable);
  }

  ////////////////////////////////////////////////
  //// General tools
  ////////////////////////////////////////////////
  enableLoading(dom?: string): void {
    Terrabrasilis.enableLoading(dom);
  }

  disableLoading(dom?: string): void {
    Terrabrasilis.disableLoading(dom);
  }

  reorderOverLayers(layers: any): void {
    Terrabrasilis.reorderOverLayers(layers);
  }

  getTerrabrasilisBaselayers(): any {
    return Terrabrasilis.getTerrabrasilisBaselayers();
  }

  deactiveLayer(layer: any): void {
    Terrabrasilis.deactiveLayer(layer);
  }

  activeLayer(layer: any): void {
    Terrabrasilis.activeLayer(layer);
  }

  isLayerActived(layer: any): boolean {
    return Terrabrasilis.isLayerActived(layer);
  }

  getLayerByName(layerName: string): any {
    return Terrabrasilis.getLayerByName(layerName);
  }

  addGetLayerFeatureInfoEventToMap(event: any): void {
    Terrabrasilis.addGetLayerFeatureInfoEventToMap(event);
  }

  addShowCoordinatesEventToMap(event: any): void {
    Terrabrasilis.addShowCoordinatesEventToMap(event);
  }

  moveLayerToBack(layer: any): void {
    Terrabrasilis.moveLayerToBack(layer);
  }

  moveLayerToFront(layer: any) {
    Terrabrasilis.moveLayerToFront(layer);
  }

  ////////////////////////////////////////////////
  //// General use dialog
  ////////////////////////////////////////////////
  showDialog(content: string): void {
    const dialogRef = this.dialog.open(DialogComponent, { width: '450px' });
    dialogRef.componentInstance.content = this.dom.bypassSecurityTrustHtml(content);
  }

  /**
   * Enable or disable TimeDimension tool for one layer.
   * @param layer A layer with time dimension available.
   */
  onOffTimeDimension(layer: Layer) {
    // verify if layer is raster or vector type and use it to set aggregate times value.
    Terrabrasilis.onOffTimeDimension(layer.name, layer.isAggregatable /*aggregateTimes*/);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  fitBounds(layer: Layer) {
    const self = this
    this.enableLoading();
    Terrabrasilis.fitBounds(layer).then(console.log)
      .catch(() => {
        self.openSnackBar('Ops, esta layer não tem os atributos necessários pra fazer o zoom', 'Aviso')
        self.disableLoading()
      })
      .finally(this.disableLoading);
  }

  ////////////////////////////////////////////////
  //// Private methods
  ////////////////////////////////////////////////
}
