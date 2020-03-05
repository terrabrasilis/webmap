import {
  Component,
  OnInit,
  Optional,
  Inject,
  ChangeDetectorRef
} from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { DialogComponent } from "../../dialog/dialog.component";
import { TerrabrasilisApiComponent } from "../terrabrasilis-api/terrabrasilis-api.component";
import { Layer } from "../../entity/layer";
import { head, last } from "lodash";

import { Store, select } from "@ngrx/store";
import * as fromLayerFilterReducer from "../../redux/reducers/layer-filter-reducer";
import { Observable } from "rxjs";
import moment from 'moment'
import { WmsCapabilitiesProviderService } from '../../services/wms-capabilities-provider.service';
import { LayerService } from '../../services/layer.service';
import { Constants } from '../../util/constants';
import { TimeDimensionService } from '../../services/time-dimension.service'

@Component({
  selector: "layer-filter",
  templateUrl: "./layer-filter.component.html",
  styleUrls: ["./layer-filter.component.css"]
})
export class LayerFilterComponent implements OnInit {
  isDailyGranularity = false;
  isMonthlyGranularity = false;
  isYearlyGranularity = false;
  
  dateRange: any;
  startDateValue: any;
  endDateValue: any;

  minDate = new Date(2016, 0, 1);
  maxDate = new Date(2018, 0, 1);
  
  layer: Layer;
  filters: Observable<fromLayerFilterReducer.Filter[]>;

  constructor(
    private dialogRef: MatDialogRef<LayerFilterComponent>,
    private dom: DomSanitizer,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private store: Store<fromLayerFilterReducer.State>,
    private wmsCapabilitiesProviderService: WmsCapabilitiesProviderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.layer = data.layer;
    this.publishDialogData();

   this.loadFilterFromStore();
  }

  private terrabrasilisApi: TerrabrasilisApiComponent = new TerrabrasilisApiComponent(
    this.dialog,
    this.dom,
    this.cdRef,
    null,
    null,
    null,
    this.store
  );

  ngOnInit () { 

  }

  sendLayerFilter (value: any): void {
    this.dialogRef.close();
  }

  closeDialog () {
    this.dialogRef.close();
  }

  showDialog (content: string): void {
    
    const dialogRef = this.dialog.open(DialogComponent, { width: "450px" });
    dialogRef.componentInstance.content = this.dom.bypassSecurityTrustHtml(
      content
    );
  }
  setStartDateValue (selectedStartDate) {
    this.startDateValue = selectedStartDate
  }

  setEndDateValue (selectedEndDate) {
    this.endDateValue = selectedEndDate
  }
/**
 * Check for previous filter for the current layer on redux store 
 */
  loadFilterFromStore()
  {
    this.store
    .pipe(
      select((state: any) => state.layerFilter.filters))
    .subscribe((refreshedFilter) => {
      let layerFullName = this.layer.workspace + ":" + this.layer.name;
      
      let existingLayerFilters = refreshedFilter.filter((filter: fromLayerFilterReducer.Filter) => (
        filter.workspace + ":" + filter.name) === layerFullName); 
      
      this.filters = existingLayerFilters;

      if(existingLayerFilters && existingLayerFilters.length>0)
      {
        this.restoreFilter(existingLayerFilters[0]);
      }
    });
  }

  restoreFilter(filter: fromLayerFilterReducer.Filter)
  {
    if(filter.initialDate)
    {
      this.startDateValue = new Date(filter.initialDate);
    }
    if(filter.finalDate)
    {
      this.endDateValue = new Date(filter.finalDate);
    }
    
  }

  buildTimeFilter () {
    const initialDate = this.startDateValue
    const finalDate = this.endDateValue

    // TODO: Verificar quando a data for null, ou se a data é só ano por exemplo...
    // Acho que o geoserver funciona de qualquer forma...
    const time = `${moment(initialDate).format('YYYY-MM-DD')}/${moment(finalDate).format('YYYY-MM-DD')}`
    return { time, initialDate, finalDate }
  }

  dispatchFilterActionToStore (currentLayerFilterObject) {
    const setInitialDateAction = fromLayerFilterReducer.actions.setFilterPropsForObject(
      currentLayerFilterObject
    );
    this.store.dispatch(setInitialDateAction);
  }

  applyFilter () {
    const { time, initialDate, finalDate } = this.buildTimeFilter()

    const currentLayerFilterObject = {
      id: this.layer.id,
      name: this.layer.name,
      workspace: this.layer.workspace,
      initialDate,
      finalDate,
      time
    } as fromLayerFilterReducer.Filter;

    this.dispatchFilterActionToStore(currentLayerFilterObject)
    this.closeDialog()
  }
  clearFilter () {
    const currentLayerFilterObject = {
      id: this.layer.id,
      name: this.layer.name,
      workspace: this.layer.workspace,
      initialDate: undefined,
      finalDate: undefined,
      time: ""
    } as fromLayerFilterReducer.Filter;

    this.dispatchFilterActionToStore(currentLayerFilterObject)
    this.closeDialog()
  }

  publishDialogData()
  {
    let capabilitiesURL = LayerService.getLayerBaseURL(this.layer);
   
    this.wmsCapabilitiesProviderService.getCapabilities(capabilitiesURL).subscribe(
      data => { 
        if (data.ok) {
         
          let parsedCapabilities = this.wmsCapabilitiesProviderService.parseCapabilitiesToJsonFormat(data.body);
         
          let dimensionList = WmsCapabilitiesProviderService.getDimensionsFromLayer(parsedCapabilities);

          let granularity = TimeDimensionService.getLayerTimeDimensionGranularity(dimensionList);

          this.dateRange = TimeDimensionService.getStartAndEndDate(dimensionList);
          
          this.minDate = new Date(this.dateRange.startDate);
          this.maxDate = new Date(this.dateRange.endDate);
          
          if(!this.startDateValue)
          {
            this.startDateValue= new Date(this.dateRange.startDate);
          }          
          if(!this.endDateValue)
          {
            this.endDateValue= new Date(this.dateRange.endDate);
          }

          if(granularity==Constants.Granularity.Daily)
          {
            this.isDailyGranularity = true;
          }

          if(granularity==Constants.Granularity.Monthly)
          {
            this.isMonthlyGranularity = true;
          }

          if(granularity==Constants.Granularity.Yearly)
          {
            this.isYearlyGranularity = true;
          }

          console.log(dimensionList);
        } else {
          console.error("Failed to get capabilities data. Erro message: \n "+data.body);
        }
      }
    );
  }

}
