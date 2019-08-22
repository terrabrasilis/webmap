import { Component, OnInit, ViewChild, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';

/**
 * services
 */
import { WmsCapabilitiesProviderService } from '../../services/wms-capabilities-provider.service';
import { MapWmsSearchDialogService } from '../../services/map-wms-search-dialog.service';
import { DatasourceService } from '../../services/datasource.service';

/**
 * components
 */
import {
  WmsServerCapabilities,
  Layer2View
} from '../../entity/wms-server-capabilities';

/**
 * general
 */
import { Datasource } from '../../entity/datasource';
import { DatasourceType } from '../../util/datasouce-type';

// import terrabrasilis api from node_modules
import * as Jsonix from 'terrabrasilis-jsonix';
import * as Terrabrasilis from 'terrabrasilis-api';
import * as ogcSchemas from 'ogc-schemas';
import * as w3cSchemas from 'w3c-schemas';

export interface Source {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-wms-search',
  templateUrl: './wms-search.component.html',
  styleUrls: ['./wms-search.component.css']
})
export class WmsSearchComponent implements OnInit {

  constructor(
    private wmsCapabilitiesProviderService: WmsCapabilitiesProviderService,
    private mapWmsSearchDialogService: MapWmsSearchDialogService,
    private dialogRef: MatDialogRef<WmsSearchComponent>,
    private datasourceService: DatasourceService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  /**
   * publics
   */
  defaultUrl: string;
  capabilities: string;

  selectedValue: string;

  displayedColumns = ['name', 'title', 'metadata', 'url'];
  dataSource = new MatTableDataSource<Layer2View>();

  progressBarColor = 'primary';
  progressBarMode = 'determinate';
  progressBarValue = '0';
  capabilitiesFailure: any = undefined;

  wmsServerCapabilities: WmsServerCapabilities;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  /**
   * List os datasource
   */
  sources = new Array<Datasource>();

  /**
   * privates
   */
  private jsonix: any;
  private Terrabrasilis: any;

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.Terrabrasilis = Terrabrasilis;
    this.defaultUrl = 'http://terrabrasilis.dpi.inpe.br/geoserver/ows';
    this.selectedValue = this.defaultUrl;
    this.jsonix = Jsonix.Jsonix;

    this.datasourceService
          .getAllDatasourceByType(DatasourceType.OWS)
          .subscribe(
              (datasources) => {

                const sortDatasources = function(a: Datasource, b: Datasource) {
                  if (a.host > b.host) {
                    return 1;
                  }
                  if (a.host < b.host) {
                    return -1;
                  }
                  return 0;
                };

                const dsGroup: any[] = [],
                dtCtrl = {};

                datasources.forEach(
                  (dtElement) => {
                    let h = dtElement.host;
                    h = h.replace('http://', '').split('/')[0];
                    if (dtCtrl[h] === undefined) {
                      dsGroup.push(h);
                      dtCtrl[h] = [];
                    }
                    dtCtrl[h].push(dtElement);
                  }
                );

                dsGroup.forEach(
                  (h) => {
                    dtCtrl[h].sort(sortDatasources);
                    while (dtCtrl[h].length) {
                      this.sources.push(dtCtrl[h].pop());
                    }
                  }
                );
              }
          );
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  rowClicked(row: any): void {
    console.log(row);
  }

  validateURL(url: string) {
    console.log(url);
  }

  loadCapabilities() {
    this.capabilitiesFailure = undefined;
    this.progressBarMode = 'indeterminate';
    this.wmsCapabilitiesProviderService.getCapabilities(this.selectedValue).subscribe(
      data => { // defaultUrl
        // console.log(data);
        if (data.ok) {
          this.xmlToJson(data.body);
        } else {
          this.progressBarMode = 'determinate';
          this.progressBarValue = '0';
          this.capabilitiesFailure = 'Failure on request, review your URL and try again.';
        }
      }
    );
  }

  addlayerToMap(layer: Layer2View) {
    const layerMap = {
      geospatialHost: layer.url,
      workspace:      layer.namespace,
      name:           layer.name,
      title:          layer.title,
      active:         true,
      baselayer:      false
    };

    Terrabrasilis.addLayerByGetCapabilities(layerMap, true);

    // console.log(layer.url);
    this.updateLayerToMap(layerMap);
  }

  displayMetadata(url: string) {
    console.log(url);
  }

  private mappingCapabilities(jsonCapabilities: any) {

    const json = jsonCapabilities.WMS_Capabilities;

    // find the registered data source name to these layers
    let datasourceName = '';
    this.sources.some((value: Datasource) => {
      if (value.host === this.selectedValue) {
        datasourceName = value.name;
        return true;
      }
    });

    this.wmsServerCapabilities = new WmsServerCapabilities(json, datasourceName);

    const layers = new Array();
    const serverMapUrl = this.wmsServerCapabilities.request.getmap.href_get;

    this.wmsServerCapabilities.layers.layers.forEach(
      function(l) {
        const lv = new Layer2View();
        lv.name = l.name;
        lv.title = l.title;
        lv.metadata = l.metadataURL.href_get;
        lv.url = serverMapUrl;
        lv.namespace = l.namespace;
        layers.push(lv);
      }
    );

    this.dataSource.data = layers;
  }

  private xmlToJson(xml: string) {
    try {
      const wmsContext = new this.jsonix.Context([
          w3cSchemas.XLink_1_0,
          ogcSchemas.OWS_1_0_0,
          ogcSchemas.SLD_1_1_0,
          ogcSchemas.SE_1_1_0,
          ogcSchemas.Filter_1_1_0,
          ogcSchemas.GML_3_1_1,
          ogcSchemas.SMIL_2_0_Language,
          ogcSchemas.SMIL_2_0,
          ogcSchemas.WMS_1_3_0
        ],
        {
            namespacePrefixes : {
                'http://www.opengis.net/wms' : '',
                'http://www.w3.org/1999/xlink' : 'xlink'
            },
            mappingStyle : 'simplified'
        });

      // Create an unmarshaller (parser)
      const unmarshaller = wmsContext.createUnmarshaller();

      // Unmarshal from URL
      this.capabilities = unmarshaller.unmarshalString(xml);
      this.mappingCapabilities(this.capabilities);
      this.progressBarMode = 'determinate';
      this.progressBarValue = '100';
    } catch (error) {
      this.progressBarMode = 'determinate';
      this.progressBarValue = '0';
      this.capabilitiesFailure = 'Failure on parse the server response. ' + error;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  // @HostListener('updateLayerToMap') // FIXME: fazer testes funcionais, não sei se isso vai funcionar (@pauloluan)
  updateLayerToMap(layer: any) {
    this.mapWmsSearchDialogService.updateMapLayerFromWmsSearch(layer);
  }
}
