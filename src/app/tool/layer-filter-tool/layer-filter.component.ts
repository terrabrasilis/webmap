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
import moment from 'moment'
import { WmsCapabilitiesProviderService } from '../../services/wms-capabilities-provider.service';
import { LayerService } from '../../services/layer.service';
import { Constants } from '../../util/constants';
import { TimeDimensionService } from '../../services/time-dimension.service'
import { DateService } from 'src/app/services/date.service';
import { Filter } from 'src/app/entity/filter';
import { FilterService } from 'src/app/services/filter.service';
import { Vision } from 'src/app/entity/vision';

@Component({
  selector: "layer-filter",
  templateUrl: "./layer-filter.component.html",
  styleUrls: ["./layer-filter.component.css"]
})
export class LayerFilterComponent implements OnInit {
  foundTimeDimension = false;
  isDailyGranularity = false;
  isMonthlyGranularity = false;
  isYearlyGranularity = false;
  layerPublishCount = 0;
  layerCount = 0;
  
  startDateValue: any;
  endDateValue: any;
  private project: Vision;


  minDate = new Date(2016, 0, 1);
  maxDate = new Date(2018, 0, 1);
  
  layers: Array<Layer>;
  
  constructor(
    private dialogRef: MatDialogRef<LayerFilterComponent>,
    private dom: DomSanitizer,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    
    private wmsCapabilitiesProviderService: WmsCapabilitiesProviderService,
    private filterService: FilterService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.layers = data.layers;
    this.project = data.project;
    this.publishDialogData();

    this.loadFilterFromStore();
  }

  private terrabrasilisApi: TerrabrasilisApiComponent = new TerrabrasilisApiComponent(
    this.dialog,
    this.dom,
    this.cdRef,
    null,
    null,
    null
  );

  ngOnInit () { 

  }

  sendLayerFilter (value: any): void {
    this.dialogRef.close();
  }

  closeDialog () {
    this.updateFilterState();
    this.dialogRef.close();
  }

  showDialog (content: string): void {
    
    const dialogRef = this.dialog.open(DialogComponent, { width: "450px" });
    dialogRef.componentInstance.content = this.dom.bypassSecurityTrustHtml(
      content
    );
  }

  public updateFilterState() 
  {
    this.filterService.getLayersFilters(this.project.id).toPromise().then((existingFiltersJson: any) => 
    {
      let existingFilterList = this.filterService.getFilterListFromJSON(existingFiltersJson);

      existingFilterList.forEach(filter => {
        var filterButtonId = "#filter-button-"+filter.layerId;
    
        if(filter &&  filter.time)
        {
          $(filterButtonId).addClass("filtered-data");
        }
        else
        {
          $(filterButtonId).removeClass("filtered-data");
        }
      });
    });
      
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
    this.filterService.getLayersFilters(this.project.id).toPromise().then((existingFiltersJson: any) => 
    {
      if(existingFiltersJson)
      {
        let existingFilterList = this.filterService.getFilterListFromJSON(existingFiltersJson);

        if(this.layers.length==1)
        {
          let layerFullName = this.layers[0].workspace + ":" + this.layers[0].name;
        
          let existingLayerFilters = existingFilterList.filter((filter: Filter) => (
            filter.workspace + ":" + filter.layerName) === layerFullName); 
          
          if(existingLayerFilters && existingLayerFilters.length>0)
          {
            this.restoreFilter(existingLayerFilters[0]);
            this.layers[0].setFilter(existingLayerFilters[0]);
          }
        }
      }      

    });
  }

  restoreFilter(filter: Filter)
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

  applyFilter () 
  {
    this.terrabrasilisApi.enableLoading();

    const { time, initialDate, finalDate } = this.buildTimeFilter()

    let filterList = new Array<Filter>();

    this.layers.forEach(layer => 
    {
      if(layer.timeDimension)
      {
        const layerFilter = {
          layerId: layer.id,
          layerName: layer.name,
          workspace: layer.workspace,
          initialDate,
          finalDate,
          time
        } as Filter;

        filterList.push(layerFilter);
        layer.setFilter(layerFilter);
      }

    });

    this.filterService.saveLayersFilters(this.project.id, filterList).toPromise().then(() => 
    {
      this.terrabrasilisApi.applyFiltersOnLayer(filterList);

      this.terrabrasilisApi.disableLoading();
  
      this.closeDialog()
    });
  }
  clearFilters()
  {

    this.filterService.getLayersFilters(this.project.id).toPromise().then((existingFiltersJson: any) => 
    {
      let existingFilterList = this.filterService.getFilterListFromJSON(existingFiltersJson);

      this.layers.forEach(layer => 
        {
          for (let i = 0; i < existingFilterList.length; i++) {
            const filter = existingFilterList[i];
            if(filter.layerId==layer.id)
            {
              if(layer.timeDimension)
              {
                const layerFilter = {
                  layerId: layer.id,
                  layerName: layer.name,
                  workspace: layer.workspace,
                  initialDate: undefined,
                  finalDate: undefined,
                  time: ""
                } as Filter;
  
                existingFilterList[i]=layerFilter;
              }
              layer.setFilter(null);
            }
          }
          
      });

      this.filterService.saveLayersFilters(this.project.id, existingFilterList).toPromise().then(() => 
      {
        this.terrabrasilisApi.applyFiltersOnLayer(existingFilterList);
  
        this.terrabrasilisApi.disableLoading();
    
        this.closeDialog()
      });
  
    });

  }

  publishDialogData()
  {
    this.layerPublishCount = 0;
    this.layerCount = 0;
    this.terrabrasilisApi.enableLoading();
    let timeDimensonLayers = LayerService.getLayersWithTimeDimension(this.layers);

    this.foundTimeDimension = false;

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
            if (data.ok) 
            {
              try
              {
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
                this.finishPublish(timeDimensonLayers, true);
  
              } catch(e)
              {
                this.finishPublish(timeDimensonLayers, false);
                console.error("Failed to get capabilities data. Erro message: \n "+e);
              }

            } else 
            {              
              this.finishPublish(timeDimensonLayers, false);
              console.error("Failed to get capabilities data. Erro message: \n "+data.body);
            }
          }
        );

      }
      
    }

  }
  finishPublish(timeDimensonLayers: Layer[], foundDimension: boolean)
  {
    if(foundDimension)
    {
      this.layerPublishCount++;
      this.layerCount++;
    }
    else
    {
      this.layerCount++;      
    } 
    if(timeDimensonLayers.length==this.layerCount)
      {        
        this.terrabrasilisApi.disableLoading();
        if(this.layerPublishCount>0)
        {
          this.foundTimeDimension = true;
        }
      }
  }

}
