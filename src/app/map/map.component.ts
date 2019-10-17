import {
    Component
    , OnInit
    , Inject
    , NgZone
    , ChangeDetectorRef
    , OnDestroy
    , HostBinding
    , DoCheck
} from '@angular/core';
import { MatDialog } from '@angular/material';

/**
 * components
 */
import { DialogComponent } from '../dialog/dialog.component';
import { WmsSearchComponent } from '../wms/wms-search/wms-search.component';
import { ContactComponent } from '../contact/contact.component';

/**
 * services
 */
import { MapWmsSearchDialogService } from '../services/map-wms-search-dialog.service';
import { VisionService } from '../services/vision.service';

/**
 * entity
 */
import { Layer } from '../entity/layer';
import { Vision } from '../entity/vision';

/**
 * general
 */
import { SubscriptionLike as ISubscription, combineLatest } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../services/local-storage.service';
import { Download, Datasource } from '../entity/datasource';
import { TerrabrasilisApiComponent } from '../tool/terrabrasilis-api/terrabrasilis-api.component';
import { Tool } from '../entity/tool';
import { OpenUrl } from '../util/open-url';
import * as _ from 'lodash'; // using the _.uniqueId() method

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy, DoCheck, OpenUrl {

    imgPath: string = ( process.env.ENV === 'production' ) ? ('/app/') : ('');

    /**
     * FAB Speed Dial Button
     */
    public fixed = false; // true, false
    public open = false; // true, false
    public spin = false; // true, false
    public direction = 'left'; // up, down, left, right
    public animationMode = 'fling'; // scale, fling

    /**
     * general
     */
    public type = '';
    public language = '';
    public template: any;
    public terraBrasilisAboutURL: string;

    /**
     * radio button
     */
    public baselayerChecked = false;

    /**
     * toggle slide
     */
    public overlayerChecked = false;

    /**
     * Slider value
     */
    public value = 0.1;
    public max = 1;
    public min = 0;
    public step = 0.1;

    /**
     * privates
     */
    public languageKey = 'translate';
    public baselayers: Array<Layer> = new Array();
    public overlayers: Array<Vision> = new Array();
    public downloads: Array<Download> = new Array();
    public thirdProject: Vision;
    public layersToLegend: Array<Vision> = new Array();
    public _subscription: Array<ISubscription> = new Array();
    @HostBinding() public thirdlayers: Array<Layer> = new Array();

    constructor(
        private dialog: MatDialog
        , private dom: DomSanitizer
        , private mapWmsSearchDialogService: MapWmsSearchDialogService
        , private visionService: VisionService
        , private cdRef: ChangeDetectorRef
        , private activeRoute: ActivatedRoute
        , private _translate: TranslateService
        , private localStorageService: LocalStorageService
        , @Inject(NgZone) private zone: NgZone
    ) {}

    ///////////////////////////////////////////////////////////////
    /// Terrabrasilis component
    ///////////////////////////////////////////////////////////////
    private terrabrasilisApi: TerrabrasilisApiComponent = new TerrabrasilisApiComponent(this.dialog, this.dom, this.cdRef, this.localStorageService);

    ///////////////////////////////////////////////////////////////
    /// Angular lifeCycle hooks
    ///////////////////////////////////////////////////////////////
    ngOnInit() {
        this.cdRef.detectChanges();

        /**
         * The best way to combine the param and queryParams url navigate
         *
         * https://kamranahmed.info/blog/2018/02/28/dealing-with-route-params-in-angular-5/
         */
        const urlParams = combineLatest(
            this.activeRoute.params,
            this.activeRoute.queryParams,
            (params, queryParams) => ({ ...params, ...queryParams})
        );

        /**
         * Identify the routeParams to load the specific layers
         */
        urlParams.subscribe(routeParams => {
            this.type = routeParams.type;
            this.language = routeParams.hl !== 'undefined' ? routeParams.hl : null;
            this.terraBrasilisAboutURL="http://terrabrasilis.dpi.inpe.br/sobre/";

            this.visionService.getVisionAndAllRelationshipmentByName(this.type)
                .subscribe(visions => {
                    this.buildOverlayersAndBaselayers(visions);

                    /**
                     * treat overlayers array to send to leaflet
                     */
                    let layersToMap = new Array();
                    this.overlayers.forEach(vision => {
                        layersToMap = layersToMap.concat(this.gridStackInstance(vision));
                    });

                    this.zone.runOutsideAngular(() => {
                        this.terrabrasilisApi.map({
                                longitude: -51.921875,
                                latitude: -14.81973
                            }, this.baselayers, layersToMap);
                    });
                    this.updateOverlayerLegends();
                    this.swapGroupLayer(this.overlayers[0]);
                    this.terrabrasilisApi.disableLoading();

                    if (this.language != null) { this.changeLanguage(this.language); }
                });

            this.localStorageService.getValue(this.languageKey)
                .subscribe((item:any) => {
                    let toUse = JSON.parse(item);
                    this.changeAboutURL((toUse === null)?('pt-br'):(toUse.value));
                });
        });

        /**
         * treat layer add from WmsSearchDialog and other maps service
         */
        this.mapWmsSearchDialogService.change.subscribe((l: any) => {
            let wmsVision: Vision,
            abort = false;
            this.overlayers.forEach(vision => {
                if (this.hasElement(vision.layers, l)) {
                    abort = true;
                }
                if (vision.name == l.workspace) {
                    wmsVision = vision;
                }
            });

            if (abort) {
                this.showDialog('Layer [ ' + l.name + ' ] already exists!');
                return;
            }

            if (!wmsVision) {
                wmsVision = new Vision(Date.now().toString(), l.workspace, '', true, '', [], [], [], false, this.overlayers.length);
                this.overlayers.unshift(wmsVision);
            }

            const tools = new Array<Tool>();
            tools.push(
                    new Tool().addTarget('<app-transparency-tool [shared]="layer"></app-transparency-tool>'),
                    new Tool().addTarget('<app-basic-info-tool [shared]="layer"></app-basic-info-tool>')
                );

            const datasource = new Datasource().addHost(l.geospatialHost);
            const nLayer = new Layer(Date.now().toString() + _.uniqueId())
                .addName(l.name)
                .addTitle(l.title)
                .addWorkspace(l.workspace)
                .addOpacity(0.9)
                .addDownloads([])
                .isBaselayer(l.baselayer)
                .isActive(l.active)
                .isEnable(true)
                .isTranslatable(false)
                .willRemove(true)
                .addThirdHost(l.geospatialHost)
                .addTools(tools)
                .addStackOrder(0)
                .addDatasource(datasource);

            wmsVision.addLayer(
                nLayer
            );
            console.log(nLayer);
            if (wmsVision.layers.length == 1) {
                this.gridStackInstance(wmsVision);
            } else {
                setTimeout(function() {
                    const gsId = '#grid-stack-' + wmsVision.id;
                    const gsStack: any = $(gsId);
                    const grid = gsStack.data('gridstack');
                    const gslayer = $('#' + nLayer.id + '_gslayer');
                    grid.addWidget(gslayer, 0, nLayer.uiOrder, 12, 1, false);
                    grid.batchUpdate();
                    grid.commit();

                    wmsVision.layers.forEach(l => {
                        const gslayer = $('#' + l.id + '_gslayer');
                        grid.update(gslayer, 0, l.uiOrder);
                    });
                }, 250);
            }
            this.updateOverlayerLegends();
        });
        this.cdRef.detectChanges();
    }

    ngOnDestroy() {
        this.cdRef.detach();
        this._subscription.forEach(s => {
           s.unsubscribe();
        });
    }

    ngAfterContentInit() {
        // this.terrabrasilisApi.disableLoading();
    }

    ngDoCheck() {}

    ///////////////////////////////////////////////////////////////
    /// GridStack interactions
    ///////////////////////////////////////////////////////////////
    /**
     * Configure the GridStacks for a visions
     * @param vision One Vision to configure
     * @returns The list of updated layers
     */
    gridStackInstance(vision: Vision): Array<Layer> {
        const gsId = '#grid-stack-' + vision.id;
        this.initGrid(gsId);

        const layers = vision.layers,
        rLayers: Array<Layer> = new Array();
        layers.forEach(layer => {
            // Define the initial state of the toggle button for layers group.
            vision.enabled = (layer.active && !vision.enabled) ? (true) : (vision.enabled);

            layer.tools.push(new Tool().addTarget("<fit-bounds-tool [shared]=\"layer\"></fit-bounds-tool>"))

            rLayers.push(
                new Layer(layer.id)
                    .addName(layer.name)
                    .addTitle(layer.title)
                    .addWorkspace(layer.workspace)
                    .addCapabilitiesUrl(layer.capabilitiesUrl)
                    .addOpacity(layer.opacity)
                    .addDashboardUrl(layer.dashboard)
                    .addMetadata(layer.metadata)
                    .addDatasource(layer.datasource)
                    // .addTools([])
                    .addTools(layer.tools)
                    .isBaselayer(layer.baselayer)
                    .isActive(layer.active)
                    .isEnable(layer.enable)
                    .isTranslatable(true)
                    .isTimeDimension(layer.timeDimension)
                    .typeOfData(layer.isAggregatable)
                    .addStackOrder(layer.stackOrder)
            );
            // rLayers.push(layer);
        });
        return rLayers;
    }

    /**
     * Define the behavior for all GridStack instances related to LayerTreeView
     * @param gridId GridStack identifier
     */
    initGrid(gridId: string): void {
        const self = this;
        $(function() {

            // define options for gridstack
            const options = {
                cellHeight: 80,
                verticalMargin: 1,
                disableResize: true
            };
            // define grid
            const gsStack: any = $(gridId);
            gsStack.gridstack(options);
            gsStack.on('change', function(event: any, items: any) {
                self.gridStackOnChange(this.id, items);
                self.updateOverlayerLegends();
            });
            gsStack.on('removed', function(event: any, items: any) {
                self.gridStackOnRemoved(this.id, items);
            });
        });
    }

    /**
     * Update layer position after GridStack changes.
     * @param gsId The identifier of one GridStack instance
     * @param changedItems The list of changed items
     *
     * Notes about the stackOrder values:
     * The stackOrder is used to set the zIndex for each layer when added in Leaflet Map,
     * so the smallest values is displayed below and the biggest values is displayed above of the stacked layers in the Map.
     */
    gridStackOnChange(gsId: string, changedItems: any) {
        this.overlayers.forEach(vision => {
            if (changedItems && gsId == 'grid-stack-' + vision.id) {
                changedItems.forEach((gsitem: any) => {
                    vision.layers.some(layer => {
                        if (gsitem.el.length && gsitem.el[0].id == layer.id + '_gslayer') {
                            // See stackOrder notes above
                            layer.stackOrder = (vision.stackOrder * 100) + (vision.layers.length - gsitem.y);
                            layer.uiOrder = gsitem.y;
                            return true;
                        }
                    });
                });
                this.terrabrasilisApi.reorderOverLayers(vision.layers);
            }
        });
    }

    /**
     * Remove one or more Layers of the list of Layers in one Vision after these are removed of the TreeViewLayer on UI.
     * @param gsId The identifier of one GridStack instance
     * @param removedItems The list of removed items
     */
    gridStackOnRemoved(gsId: string, removedItems: any) {
        this.overlayers.forEach(vision => {
            if (removedItems && gsId == 'grid-stack-' + vision.id) {
                removedItems.forEach((gsitem: any) => {
                    const index = vision.layers.findIndex(layer => {
                        return (gsitem.el.length && gsitem.el[0].id == layer.id + '_gslayer');
                    });
                    vision.layers.splice(index, 1);
                });
            }
        });
    }

    ///////////////////////////////////////////////////////////////
    /// Tools used in sidebar header
    ///////////////////////////////////////////////////////////////
    fullScreen() {
        this.terrabrasilisApi.fullScreen();
    }

    drawSimpleShape() {
        this.showDialog('Terrabrasilis web application.');
    }

    showDialogCapabilities() {
        this.cdRef.detectChanges();
        this.dialog.open(WmsSearchComponent, {
            width : '950px',
            minWidth: '690px',
            height: '630px',
            minHeight: '400px'
        });
    }

    resetMap() {
        this.terrabrasilisApi.resetMap();
    }

    undo() {
        this.terrabrasilisApi.undo();
    }

    redo() {
        this.terrabrasilisApi.redo();
    }

    getSingleLayerFeatureInfo(layer: any) {
        console.log('getSingleLayerFeatureInfo');
        console.log(layer);
    }

    getFeatureInfo(event: any) {
        this.terrabrasilisApi.addGetLayerFeatureInfoEventToMap(event);
    }

    showCoordinates(event: any) {
        this.terrabrasilisApi.addShowCoordinatesEventToMap(event);
    }

    ///////////////////////////////////////////////////////////////
    /// Layers interactions
    ///////////////////////////////////////////////////////////////
    layerBaseLayerChange(layerObject: any) {
        let layer = this.getLayerByName(layerObject.name);
        if (typeof(layer) == 'undefined' || layer === null) { layer = null; }

        if (layer == null) {
            const activeBaselayers = this.terrabrasilisApi.getTerrabrasilisBaselayers();
            activeBaselayers.forEach((bl: any) => {

                const baselayer = this.baselayers.find(function(l) {
                    if (l.name == bl.options._name) {return true; }
                });
                this.terrabrasilisApi.deactiveLayer(baselayer);
            });
            this.terrabrasilisApi.activeLayer(layerObject);
        }
    }

    layerOnOff(input: HTMLInputElement, layerObject: any, vision: Vision) {
        layerObject.active = input.checked;
        if (layerObject.active) {
            vision.enabled = true;
        } else {
            vision.enabled = vision.layers.some(layer => {
                if (layer.active) { return true; }
            });
        }
        this.mapLayerOnOff(layerObject);
        this.updateOverlayerLegends();
    }

    /**
     * Apply layer state on TerraBrasilis Map component
     * @param layerObject A reference to one Layer instance
     */
    private mapLayerOnOff(layerObject: any) {
        if (layerObject.active) {
            this.showWarning(layerObject); // TODO: it's a hard coded information for Pampa and Pantanal. Will be disabled in the future!
            this.terrabrasilisApi.activeLayer(layerObject);
        } else if (this.terrabrasilisApi.isLayerActived(layerObject)) {
            this.terrabrasilisApi.deactiveLayer(layerObject);
        }
    }

    /**
     * Update the local instance for the thirdies vision.
     * @param thirdlayers The layers list of third parties
     */
    updateThirdiesProject(thirdlayers: Array<Layer>) {
        if (!this.thirdProject) {
            this.thirdProject = new Vision(_.uniqueId(), 'Uncategorized', '', true, '', [], thirdlayers, [], false, this.overlayers.length);
        } else {
            // this.thirdProject.updateLayers(thirdlayers);
            console.log('reimplement');
        }
    }

    /**
     * Used to control the special uncategorized group layers
     * @param ev The browser event generated when on/off button is changed by a click
     */
    thirdlayersGroupOnOff(input: HTMLInputElement) {
        this.projectGroupOnOff(input, this.thirdProject);
    }

    /**
     * Used to control the state of layers inside a group layers.
     * @param input The HTML element, one checkbox, where action was started.
     * @param vision The vision reference to access the active property
     */
    projectGroupOnOff(input: HTMLInputElement, vision: Vision) {
        vision.enabled = input.checked;
        vision.layers.forEach(layer => {
            layer.active = vision.enabled;
            // apply layer status on map
            this.mapLayerOnOff(layer);
        });
        this.updateOverlayerLegends();
    }

    /**
     * Change the Group Layer UI to display or hide the layers into the group component.
     * @param groupName The vision name from configurations defined in layer.service.ts
     */
    swapGroupLayer(vision: Vision) {

        // let groupName = vision.name.replace(/\s/g, "");
        const groupName = vision.id;

        let grpLayers = $('.project-group-opened');
        grpLayers.each(function(i, t) {
            if (t.id != groupName + '_group') {
                t.className = 'project-group-closed';
            }
        });
        grpLayers = $('.group-title-opened');
        grpLayers.each(function(i, t) {
            if (t.id != groupName + '_titlegroup') {
                t.className = 'group-title-closed';
            }
        });

        this.overlayers.forEach(prj => {
            prj.isOpened = false;
        });

        if ($('#' + groupName + '_group').hasClass('project-group-closed')) {
            ($('#' + groupName + '_group') as any).switchClass('project-group-closed', 'project-group-opened');
            vision.isOpened = true;
        } else {
            ($('#' + groupName + '_group') as any).switchClass('project-group-opened', 'project-group-closed');
            vision.isOpened = false;
        }
        // The style of the title group is different for the opened and closed states.
        if ($('#' + groupName + '_titlegroup').hasClass('group-title-closed')) {
            ($('#' + groupName + '_titlegroup') as any).switchClass('group-title-closed', 'group-title-opened');
        } else {
            ($('#' + groupName + '_titlegroup') as any).switchClass('group-title-opened', 'group-title-closed');
        }

        this.updateOverlayerLegends();
    }

    /**
     * Change the height of a grid stack layer item.
     * @param layerName The layer name to compose the identifier of grid stack item.
     */
    changeHeightLayerItem(layerName: string, projectId: string) {
        setTimeout(function() {
            const lname = layerName.replace(/\s/g, '');
            const el = $('#' + lname + '_gslayer');
            const gsItemHeight = ($('#' + layerName + '_gstoggle').attr('aria-expanded') === 'true') ? (2) : (1);

            const gsId = '#grid-stack-' + projectId,
            gsStack: any = $(gsId);
            const grid = gsStack.data('gridstack');
            grid.resize(el[0], null, gsItemHeight);
            grid.batchUpdate();
            grid.commit();
        }, 250);
    }

    removeLayerFromTreeView(layer: any, projectId: string) {
        $(function() {
            const layerId = layer.id;
            const el = $('#' + layerId + '_gslayer');

            const gsId = '#grid-stack-' + projectId,
            gsStack: any = $(gsId);
            const grid = gsStack.data('gridstack');
            grid.removeWidget(el[0]);
            grid.batchUpdate();
            grid.commit();
        });
        /**
         * Force to remove layer from the map
         */
        this.terrabrasilisApi.deactiveLayer(layer);
    }

    removeLayer(layerObject: any, vision: Vision) {
        this.cdRef.detectChanges();
        if (layerObject && layerObject.name) {
            this.terrabrasilisApi.deactiveLayer(layerObject);
            this.removeLayerFromTreeView(layerObject, vision.id);
        }
    }

    bringLayerToFront(layerObject: any) {
        if (layerObject && layerObject.name) {
            this.terrabrasilisApi.moveLayerToFront(layerObject);
        } else {
            this.showDialog('Falhou ao mover a camada.');
            return this;
        }
    }

    bringLayerToBack(layerObject: any) {
        if (layerObject && layerObject.name) {
            this.terrabrasilisApi.moveLayerToBack(layerObject);
        } else {
            this.showDialog('Falhou ao mover a camada.');
            return this;
        }
    }

    ///////////////////////////////////////////////////
    /// Tools to use directly on map.component
    ///////////////////////////////////////////////////
    showDialog(content: string): void {
        const dialogRef = this.dialog.open(DialogComponent, { width : '450px' });
        dialogRef.componentInstance.content = this.dom.bypassSecurityTrustHtml(content);
    }

    showWarning(layerObject: any) {
        if (layerObject.name == 'pampa_accumulated_deforestation_up_to_2016' || layerObject.name == 'pantanal_accumulated_deforestation_up_to_2016') {
            const msg = '<b>Atenção, este é um dado preliminar.</b><br />' +
            'Ele mostra o desmatamento acumulado até 2016 para o bioma.<br />' +
            'O dado definitivo será consolidado após conclusão dos mapeamentos previstos para os anos que compõem a série histórica de 2004 a 2018.<br /><br />' +
            '<a href=\'' + layerObject.metadata + '\' style=\'color:#007bff;text-decoration: underline;\'>Confira aqui o metadado da camada.</a>';
            this.showDialog(msg);
        }
    }

    showContact() {
        this.cdRef.detectChanges();
        this.dialog.open(ContactComponent, { width : '450px' });
    }

    changeLanguage(value: string) {
        this.localStorageService.setValue(this.languageKey, value);
        this._translate.use(value);
        this.changeAboutURL(value);
        this.updateOverlayerLegends();
    }

    changeAboutURL(value: string) {
        this.terraBrasilisAboutURL=(value=='en')?("http://terrabrasilis.dpi.inpe.br/en/about/"):("http://terrabrasilis.dpi.inpe.br/sobre/");
    }

    goTo(url: string) {
        window.open(url, '_blank');
    }

    showDialogDownloadOptions() {
        this.showDialog(this.getDownloadHtmlOptions());
    }

    processLegendForLayers(layers: any): Promise<any> {
        const promises = layers.map((layer) => {
          return this.terrabrasilisApi.getLegend(layer, false)
            .then((url) => {
              layer.addLegendURL(url)
              return layer
            })
        });

        return Promise.all(promises)
    }

    ///////////////////////////////////////////////////
    /// Private methods
    ///////////////////////////////////////////////////

    private getLayerByName(layerName: string): any {
        return this.terrabrasilisApi.getLayerByName(layerName);
    }

    private hasElement(list: any, toCompare: any): boolean {
        let hasElement = false;

        list.some((e: any) => {
            if (e.name === toCompare.name) {
                hasElement = true;
                return true; // only to break
            }
        });

        return hasElement;
    }

    /**
     * Used to update state of legend...
     */
    private updateOverlayerLegends() {
        let self = this
        this.cdRef.detectChanges();
        this.layersToLegend = [];

        this.overlayers.forEach(vision => {
          const l = vision.layers.slice();
          const p = new Vision(vision.id, vision.name, '', vision.enabled, '', [], l, vision.downloads, true, vision.stackOrder, vision.isOpened);

          self.processLegendForLayers(p.layers)
            .then((layers) => {
              p.layers = layers.sort(function(a, b) {
                if (a.uiOrder > b.uiOrder) { return 1; } else { return -1; }
              });
            })

          self.layersToLegend.push(p);
        });
    }

    private removeFromArray(listToRemoveObject: any, elementWillBeRemoved: any): void {
        const index = listToRemoveObject.indexOf(elementWillBeRemoved);

        if (index !== -1) {
            listToRemoveObject.splice(index, 1);
        }
    }

    private getDownloadHtmlOptions(): string {
        let downloadHtml = '<div class="container">';

        const match = /terrabrasilis.dpi.inpe.br\/download/;

        this.downloads.forEach(download => {
            const link =  match.test(download.link) == false ?
                        '<a href=\'' + download.link + '\' target="_blank" class="btn btn-primary btn-success">Acesso aos Dados</a>' :
                        '<a href=\'' + download.link + '\' class="btn btn-primary btn-success">Download</a>';

            downloadHtml += '    <div class="card mt-3">' +
                            '     <div class="card-body">' +
                            '        <h5 class="card-title">' + download.description + '</h5>' +
                            '        <p class="card-text">' + download.name + '</p>' + link +
                            '     </div>' +
                            '    </div>';
        });
        downloadHtml += '</div>';
        return downloadHtml;
    }

    private buildOverlayersAndBaselayers(values: any): void {
        const baselayers = new Array<any>();
        const visions = new Array<any>(),
        visions_ctrl = new Array<any>();

        values.forEach((e: any) => {
            e.vision.layers.forEach((l: any) => {
                if (l.baselayer) {
                    baselayers.push(l);
                } else if (!visions_ctrl.includes(e.id)) {
                    visions_ctrl.push(e.id);
                    visions.push(e);
                }
            });

            e.visions.forEach((e: any) => {
                e.layers.forEach((l: any) => {
                    if (l.baselayer) {
                        baselayers.push(l);
                    } else if (!visions_ctrl.includes(e.id)) {
                        visions_ctrl.push(e.id);
                        visions.push(e);
                    }
                });
            });
        });

        // Implements the sort Visions by stackOrder
        visions.sort( (a: any, b: any) => {
            return a.stackOrder - b.stackOrder;
        });

        baselayers.forEach((l: any) => {
            const domains = new Array();
            l.subdomains.forEach((s: any) => {
                domains.push(s.name);
            });

            const layer = new Layer(l.id)
                .addName(l.name)
                .addTitle(l.title)
                .addDescription(l.description)
                .addAttribution(l.attribution)
                .addSubdomains(domains)
                .addDatasource(l.datasource)
                .isBaselayer(l.baselayer)
                .isActive(l.active)
                .isEnable(l.enabled);

            this.baselayers.push(layer);
        });
        this.baselayers.push(new Layer(_.uniqueId()).addName('Blank').addTitle('Blank').isBaselayer(true).isActive(false));

        visions.forEach((v: any) => {
            v.downloads.forEach((d: any) => {
                this.downloads.push(d);
            });

            const layers: Array<any> = [];
            const isVisionEnabled: boolean = v.enabled;
            v.layers.forEach((l: any) => {
                // replaces if exists, the workspace of the datasource host string
                l.datasource.host = l.datasource.host.replace('/' + l.workspace + '/', '/');

                const layer = new Layer(l.id + v.id)
                    .addName(l.name)
                    .addTitle(l.title)
                    .addWorkspace(l.workspace)
                    .addCapabilitiesUrl(l.capabilitiesUrl)
                    .addOpacity(l.opacity)
                    .addDatasource(l.datasource)
                    .addTools(l.tools)
                    .addDownloads(l.downloads)
                    .addMetadata(l.metadata)
                    .isBaselayer(l.baselayer)
                    .isActive( isVisionEnabled ? l.active : isVisionEnabled )
                    .isEnable(l.enabled)
                    .isTranslatable(true)
                    .isTimeDimension(l.timeDimension)
                    .typeOfData(l.aggregatable)
                    .addStackOrder(l.stackOrder)
                    .addDashboardUrl(l.dashboard);

                layers.push(layer);
            });
            this.overlayers.unshift(new Vision(v.id, v.name, v.description, isVisionEnabled, v.created, v.tools, layers, v.downloads, true, v.stackOrder));
        });
    }
}
