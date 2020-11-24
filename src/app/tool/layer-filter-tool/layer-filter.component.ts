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
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: "layer-filter",
  templateUrl: "./layer-filter.component.html",
  styleUrls: ["./layer-filter.component.css"]
})
export class LayerFilterComponent implements OnInit {
  isDailyGranularity = false;
  isMonthlyGranularity = false;
  isYearlyGranularity = false;
  
  startDateValue: any;
  endDateValue: any;


  minDate = new Date(2016, 0, 1);
  maxDate = new Date(2018, 0, 1);
  
  layers: Array<Layer>;
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
    this.layers = data.layers;
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

      if(this.layers.length==1)
      {
        let layerFullName = this.layers[0].workspace + ":" + this.layers[0].name;
      
        let existingLayerFilters = refreshedFilter.filter((filter: fromLayerFilterReducer.Filter) => (
          filter.workspace + ":" + filter.name) === layerFullName); 
        
        this.filters = existingLayerFilters;
  
        if(existingLayerFilters && existingLayerFilters.length>0)
        {
          this.restoreFilter(existingLayerFilters[0]);
        }
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

  this.layers.forEach(layer => {
    const currentLayerFilterObject = {
      id: layer.id,
      name: layer.name,
      workspace: layer.workspace,
      initialDate,
      finalDate,
      time
    } as fromLayerFilterReducer.Filter;

    this.dispatchFilterActionToStore(currentLayerFilterObject)
  });

    this.closeDialog()
  }
  clearFilter () {

    this.layers.forEach(layer => {
      const currentLayerFilterObject = {
        id: layer.id,
        name: layer.name,
        workspace: layer.workspace,
        initialDate: undefined,
        finalDate: undefined,
        time: ""
      } as fromLayerFilterReducer.Filter;
  
      this.dispatchFilterActionToStore(currentLayerFilterObject)
    });
    
    this.closeDialog()
  }

  publishDialogData()
  {

    let timeDimensonLayers = LayerService.getLayersWithTimeDimension(this.layers);

    let tempMinDate: any;
    let tempMaxDate: any;
    let tempStartDateValue: any;
    let tempEndDateValue: any;
    let tempGranularity: any;

    for (let i = 0; i < timeDimensonLayers.length; i++) 
    {
      const layer = timeDimensonLayers[i];
      
      //Only for layer that contains timeDimension
      if(layer.timeDimension)
      {
        let capabilitiesURL = LayerService.getLayerBaseURL(layer);
   
        this.wmsCapabilitiesProviderService.getCapabilities(capabilitiesURL).subscribe(
          data => { 
            if (data.ok) {
             
              let parsedCapabilities = this.wmsCapabilitiesProviderService.parseCapabilitiesToJsonFormat(data.body);
             
              let dimensionList = WmsCapabilitiesProviderService.getDimensionsFromLayer(parsedCapabilities);
    
              let granularity = TimeDimensionService.getLayerTimeDimensionGranularity(dimensionList);
    
              let dateRange = TimeDimensionService.getStartAndEndDate(dimensionList);

              //If temp start date not defined use current date and looking for the layer with the first date.
              if(!tempStartDateValue)
              {
                tempStartDateValue = new Date(dateRange.startDate);
              }
              else
              {
                if(DateService.isGreater(tempStartDateValue,dateRange.startDate))
                {
                  tempStartDateValue=new Date(dateRange.startDate);
                }
              }              

              //If temp end date not defined use current date and looking for the layer with the last date.
              if(!tempEndDateValue)
              {
              
                tempEndDateValue = new Date(dateRange.endDate);

              }
              else
              {
                if(DateService.isLess(tempEndDateValue,dateRange.endDate))
                {
                  tempEndDateValue = new Date(dateRange.endDate);
                }
              } 
              
              if(tempGranularity!=Constants.Granularity.Daily)
              {
                if(granularity==Constants.Granularity.Daily)
                {
                  tempGranularity = Constants.Granularity.Daily;
                }
              }
              
              if(tempGranularity!=Constants.Granularity.Daily &&
                  tempGranularity!=Constants.Granularity.Monthly)
              {
                if(granularity==Constants.Granularity.Monthly)
                {
                  tempGranularity = Constants.Granularity.Monthly;
                }
                else
                {
                  tempGranularity = Constants.Granularity.Yearly;
                }
              }
    
              //If it is the last set final values 
              if(i==(timeDimensonLayers.length-1))
              {
                if(!this.endDateValue)
                {
                  this.endDateValue= tempEndDateValue;
                }
                if(!this.startDateValue)
                {
                  this.startDateValue = tempStartDateValue;
                }

                if(tempGranularity==Constants.Granularity.Daily)
                {
                  this.isDailyGranularity = true;
                }
      
                if(tempGranularity==Constants.Granularity.Monthly)
                {
                  this.isMonthlyGranularity = true;
                }
      
                if(granularity==Constants.Granularity.Yearly)
                {
                  this.isYearlyGranularity = true;
                }

                this.minDate = new Date(tempStartDateValue);
                this.maxDate = new Date(tempEndDateValue); 

              }


            } else {
              console.error("Failed to get capabilities data. Erro message: \n "+data.body);
            }
          }
        );




      }
      
    }

    timeDimensonLayers.forEach(layer => {
      
      
    });
  }

}
