/** 
 * Angular imports
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MatSnackBarModule, MatPaginatorIntl } from '@angular/material';

/**
 * Custom module created imports
 */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialCoreModule } from './core-modules/material-core.module';
import { AppRoutingModule } from './app.routing.module';
import { LocalStorageModule } from '@ngx-pwa/local-storage';
import { DynamicComponentModule } from './core-modules/dynamic-component';
import { SharedModule } from './core-modules/shared.module';
import { PipeSharedModule } from './core-modules/pipe-shared.module';

/**
 * Custom shared modules
 */
import { DatePickerYearComponent } from './shared-components/date-picker-year/date-picker-year.component';
import { DatePickerMonthComponent } from './shared-components/date-picker-month/date-picker-month.component';
import { DatePickerFullComponent } from './shared-components/date-picker-full/date-picker-full.component'

/**
 * Custom component imports
 */
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { DialogComponent } from './dialog/dialog.component';
import { WmsSearchComponent } from './wms/wms-search/wms-search.component';
import { ContactComponent } from './contact/contact.component';
import { TerrabrasilisApiComponent } from './tool/terrabrasilis-api/terrabrasilis-api.component';
import { MapComponent } from './map/map.component';
import { LayerFilterComponent } from './tool/layer-filter-tool/layer-filter.component';
import { ControlpanelComponent } from './time-series/controlpanel/controlpanel.component';
import { ChartpanelComponent } from './time-series/chartpanel/chartpanel.component';
import { TablepanelComponent } from './time-series/tablepanel/tablepanel.component';


/**
 * Services
 */
import { UserProviderService } from './services/user-provider.service';
import { WmsCapabilitiesProviderService } from './services/wms-capabilities-provider.service';
import { MapWmsSearchDialogService } from './services/map-wms-search-dialog.service';
import { ContactService } from './services/contact.service';
import { LocalStorageService } from './services/local-storage.service';
import { DatasourceService } from './services/datasource.service';
import { LayerService } from './services/layer.service';
import { FilterService } from './services/filter.service';
import { TimeDimensionService } from './services/time-dimension.service';
import { VisionService } from './services/vision.service';
import { TsComponentsDataShareService } from './services/ts-components-data-share.service';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorI18nService } from './services/mat-paginator-i18n.service';

/**
 * Providers
 */
import { localStorageProviders } from '@ngx-pwa/local-storage';

/**
 * Translate tool
 */
import { HttpLoaderFactory } from "./factory/httpLoaderFactory";

/**
 * Node modules import
 */
import * as Jsonix from 'terrabrasilis-jsonix';
import * as ogcSchemas from 'ogc-schemas';
import * as w3cSchemas from 'w3c-schemas';
import 'hammerjs';

import * as d3 from 'd3';
import * as $ from 'jquery';
import * as _ from 'lodash';
import 'gridstack';

import * as gridstack from 'gridstack';
import StoreModule from './redux/store'
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LoginComponent,
    UserComponent,
    DialogComponent,
    LayerFilterComponent,
    WmsSearchComponent,
    ContactComponent,
    TerrabrasilisApiComponent,
    DatePickerYearComponent,
    DatePickerMonthComponent,
    DatePickerFullComponent,
    ControlpanelComponent,
    ChartpanelComponent,
    TablepanelComponent
  ],
  imports: [
    PipeSharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialCoreModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MatSnackBarModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    /**
     * Active the translate tool for entire app
     */
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    /**
     * Enable local storage module
     */
    LocalStorageModule,
    CommonModule,
    SharedModule,
    /**
     * Enable DynamicComponentModule
     */
    DynamicComponentModule.forRoot({
      imports: [
        SharedModule
      ]
    }),
    StoreModule
  ],
  providers: [
    UserProviderService,
    WmsCapabilitiesProviderService,
    MapWmsSearchDialogService,
    ContactService,
    LocalStorageService,
    localStorageProviders({ prefix: 'TBV01_' }),
    DatasourceService,
    LayerService,
    FilterService,
    TimeDimensionService,
    VisionService,
    MatDatepickerModule,
    TsComponentsDataShareService,
    {
      provide: MatPaginatorIntl,
      useFactory: (translate) => {
        const service = new MatPaginatorI18nService();
        service.injectTranslateService(translate);
        return service;
      },
      deps: [TranslateService]
    }
    // {
    //   provide: APP_BASE_HREF, 
    //   useValue: '/map' /**https://angular.io/api/common/APP_BASE_HREF */
    // }
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    DialogComponent,
    LayerFilterComponent,
    ContactComponent,
    TerrabrasilisApiComponent
  ],
  exports: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
