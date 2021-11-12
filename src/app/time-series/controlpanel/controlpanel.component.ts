import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'
import { TerrabrasilisApiComponent } from '../../tool/terrabrasilis-api/terrabrasilis-api.component'
import { MatDialog } from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'
import { TsComponentsDataShareService } from '../../services/ts-components-data-share.service'
import { Subscription } from 'rxjs'
import { TranslateService } from '@ngx-translate/core';

declare var $: any

@Component({
  selector: 'app-controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrls: ['./controlpanel.component.css']
})
export class ControlpanelComponent implements OnInit, OnDestroy {
  aGeoJSONGeomtry: any
  isPolygon: boolean
  latitude: number
  longitude: number
  //polygon: Array<any>
  polygon: string
  chartLoadingSubscription: Subscription
  currentDate = new Date();
   
  constructor (
    private shareData: TsComponentsDataShareService,
    private dialog: MatDialog,
    private dom: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private _translate: TranslateService = null
  ) {}

  private terrabrasilisApi: TerrabrasilisApiComponent = new TerrabrasilisApiComponent(
    this.dialog,
    this.dom,
    this.cdRef,
    null,
    null,
    null    
    )

  ngOnInit () {
    this.enableMapListener()
    this.timeseries()

    this.chartLoadingSubscription = this.shareData.chartLoading.subscribe(
      (endLoading: boolean) => {
        if (endLoading === true) this.terrabrasilisApi.disableLoading()
      }
    )
  }

  ngOnDestroy () {
    this.disableMapListener()
    this.chartLoadingSubscription.unsubscribe()
  }

  /**
   * Call after each create event from the map
   * @param event The event with the Feature created.
   */
  onCreate (event: any) {
    this.aGeoJSONGeomtry = event.layer.toGeoJSON()
    if (this.aGeoJSONGeomtry.geometry.type == 'Point') {
      this.isPolygon = false
      this.longitude = this.aGeoJSONGeomtry.geometry.coordinates[0]
      this.latitude = this.aGeoJSONGeomtry.geometry.coordinates[1]
    } else {
      this.isPolygon = true
      this.polygon =  localStorage.getItem('jsonCoords') //this.aGeoJSONGeomtry.geometry.coordinates
      console.log("polygon", this.polygon)
    }
    this.cdRef.detectChanges()
  }

  /**
   * Call after each edit event from the map
   * @param event The event with the Feature edited.
   */
  onEdit (event: any) {
    this.aGeoJSONGeomtry = event.layer.toGeoJSON()
    if (this.aGeoJSONGeomtry.geometry.type == 'Point') {
      this.isPolygon = false
      this.longitude = this.aGeoJSONGeomtry.geometry.coordinates[0]
      this.latitude = this.aGeoJSONGeomtry.geometry.coordinates[1]
    } else {
      this.isPolygon = true
      this.polygon = localStorage.getItem('jsonCoords') //this.aGeoJSONGeomtry.geometry.coordinates
    }
    this.cdRef.detectChanges()
  }

  /**
   * Call after each delete event from the map
   * @param event The event with the Feature deleted.
   */
  onDelete (event: any) {
    this.aGeoJSONGeomtry = event.layer.toGeoJSON()
    if (this.aGeoJSONGeomtry.geometry.type == 'Point') {
      this.isPolygon = false
      this.longitude = 0
      this.latitude = 0
    } else {
      this.isPolygon = true
      this.polygon = "" //[]
    }
    this.cdRef.detectChanges()
  }

  enableMapListener () {
    this.terrabrasilisApi.attachGeometryDrawingListener(this)
  }

  disableMapListener () {
    this.terrabrasilisApi.detachGeometryDrawingListener()
  }

  timeseries(){
    //----- define values of the input

    //----- change the input mode, if point or polygon
    $('[name=mode-options]').change(function () {
      // hide inputs, divs ... for each mode-options
      $('#lat').toggle(this.value !== 'polygon')
      $('#long').toggle(this.value !== 'polygon')
      $('#showLatLong').toggle(this.value !== 'polygon')
      $('#band').toggle(this.value !== 'polygon')
      $('#band_shp').toggle(this.value !== 'point')
      $('#butOpenJSON').toggle(this.value !== 'point')
      $('#openJSON').toggle(this.value !== 'point')

     })
   
  }

  messageAlert(){
    let alertMessage = this._translate.instant('timeseries.infopolygon');
    window.alert(alertMessage)
  }

  sendDataToChart(){

   let crtlData = {
      service_selected: 'WTSS-INPE',
      coverage_selected: 'MOD13Q1',
      band_selected: $('#band').val(),
      band_selected_shp: $('#band_shp').val(),
      start_date: $('#from').val(),
      end_date: $('#to').val(),
      latitude: this.latitude,
      longitude: this.longitude,
      isPolygon: this.isPolygon,
      polygon: this.aGeoJSONGeomtry //this.polygon,
    }
    
    // RWTSS has dates from 2000-02-18 to 2019-09-30 by url e-sensing
    let fixedStartDate = "2000-02-18"
    let fixedEndDate = "2019-09-30"
    
    if (this.isPolygon === true && this.polygon.length === 0){
        this.messageAlert()
    } else {
      if (new Date(crtlData.start_date) >= new Date(fixedStartDate) && new Date(crtlData.end_date) <= new Date(fixedEndDate)){
        //console.log("date_start <= fixedStartDate - ok: ", crtlData.start_date, fixedStartDate)
        //console.log("date_end <= fixedEndDate - ok: ", crtlData.end_date, fixedEndDate)
        this.terrabrasilisApi.enableLoading()
        this.shareData.changeData(crtlData)
      } else if (new Date(crtlData.start_date) < new Date(fixedStartDate) && new Date(crtlData.end_date) <= new Date(fixedEndDate)){
        //console.log("date_start < fixedStartDate - no: ", crtlData.start_date, fixedStartDate)
        //console.log("date_end <= fixedEndDate - ok: ", crtlData.end_date, fixedEndDate)
        crtlData.start_date=fixedStartDate
        this.terrabrasilisApi.enableLoading()
        this.shareData.changeData(crtlData)
      } else if (new Date(crtlData.start_date) >= new Date(fixedStartDate) && new Date(crtlData.end_date) > new Date(fixedEndDate)){
        //console.log("date_start >= fixedStartDate - ok: ", crtlData.start_date, fixedStartDate)
        //console.log("date_end > fixedEndDate - no: ", crtlData.end_date, fixedEndDate)
        crtlData.end_date=fixedEndDate
        this.terrabrasilisApi.enableLoading()
        this.shareData.changeData(crtlData)
      } else {
        //console.log("date_start < fixedStartDate - no: ", crtlData.start_date, fixedStartDate)
        //console.log("date_end > fixedEndDate - no: ", crtlData.end_date, fixedEndDate)
        crtlData.start_date=fixedStartDate
        crtlData.end_date=fixedEndDate
        this.terrabrasilisApi.enableLoading()
        this.shareData.changeData(crtlData)
      }
    }
  
  }


}
