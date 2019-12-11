import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'
import { TerrabrasilisApiComponent } from '../../tool/terrabrasilis-api/terrabrasilis-api.component'
import { MatDialog } from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'
import { TsComponentsDataShareService } from '../../services/ts-components-data-share.service'
import { Subscription } from 'rxjs'

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
   
  constructor (
    private shareData: TsComponentsDataShareService,
    private dialog: MatDialog,
    private dom: DomSanitizer,
    private cdRef: ChangeDetectorRef
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

    $('#filter').change(function () {
      switch ($(this).val()) {
        case 'No-filter':
          $('#wh-lambda').prop('disabled', true)
          $('#wh-differences').prop('disabled', true)
          $('#sg-order').prop('disabled', true)
          $('#sg-scale').prop('disabled', true)
          break
        case 'Whittaker':
          $('#wh-lambda').prop('disabled', false)
          $('#wh-differences').prop('disabled', false)
          $('#sg-order').prop('disabled', true)
          $('#sg-scale').prop('disabled', true)
          break
        case 'Savitsky-Golay':
          $('#wh-lambda').prop('disabled', true)
          $('#wh-differences').prop('disabled', true)
          $('#sg-order').prop('disabled', false)
          $('#sg-scale').prop('disabled', false)
          break
      }
    })

    //----- change the input mode, if point or polygon
    $('[name=mode-options]').change(function () {
      // hide inputs, divs ... for each mode-options
      $('#lat').toggle(this.value !== 'polygon')
      $('#long').toggle(this.value !== 'polygon')
      $('#showLatLong').toggle(this.value !== 'polygon')
      $('#band').toggle(this.value !== 'polygon')
      $('#band_shp').toggle(this.value !== 'point')
      $('#title-chart-filter').toggle(this.value !== 'polygon')
      $('#filter').toggle(this.value !== 'polygon')
      $('#filter-group').toggle(this.value !== 'polygon')
      $('#filter-whit').toggle(this.value !== 'polygon')
      $('#filter-sg').toggle(this.value !== 'polygon')
      $('#submitbuttonfilter').toggle(this.value !== 'polygon')
      $('#butOpenJSON').toggle(this.value !== 'point')
      $('#openJSON').toggle(this.value !== 'point')

      // this.enableButton();

      if (!this.isPolygon) {
        //if ($('#get-point').is(':checked')) {
        // https://stackoverflow.com/questions/9240854/jquery-function-executed-more-than-once
        $('#submitbutton')
          // .unbind('click')
          .click(function (e: any) {
            console.log('Test ...');
            e.preventDefault();
            //timeSeriesRaw();
            this.sendDataToChart()
          })
      } else {
        $('#submitbutton')
          // .unbind('click')
          .click(function (e: any) {
            e.preventDefault();
            this.sendDataToChart()
          })
      }
    })

    //button handler
    $('#submitbuttonfilter').on('click', function (e: any) {
      e.preventDefault()
      this.sendDataToChart()
    })
  }

  sendDataToChart(){

    this.terrabrasilisApi.enableLoading()

    let crtlData = {
      service_selected: 'WTSS-INPE',
      coverage_selected: 'MOD13Q1',
      band_selected: $('#band').val(),
      band_selected_shp: $('#band_shp').val(),
      pre_filter_selected: '0 - none',
      start_date: $('#from').val(),
      end_date: $('#to').val(),
      filter_selected: $('#filter option:selected').val(),
      wh_lambda_selected: $('#wh-lambda').val(),
      wh_diff_selected: $('#wh-differences').val(),
      sg_order_selected: $('#sg-order').val(),
      sg_scale_selected: $('#sg-scale').val(),
      latitude: this.latitude,
      longitude: this.longitude,
      isPolygon: this.isPolygon,
      polygon: this.aGeoJSONGeomtry, //this.polygon,
      enableFilter: false
    }

    this.shareData.changeData(crtlData)
  }

  // enableButton(){
  //   $("input[type='text']", "input[type='number']").on("keyup", function(){
  //     if(($('#lat').val() !== '' && $('#long').val() !== '') || $('#openJSON').val() !== ''){
  //       $('#submitbutton').removeAttr("disabled");
  //       this.sendDataToChart();
  //     } else {
  //       $('#submitbutton').attr("disabled", "disabled");
  //         }  
  //   });
  // }
}
