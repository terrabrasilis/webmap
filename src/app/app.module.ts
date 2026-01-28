/** 
 * Angular imports
 */
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

import { MatPaginatorIntl, MatSnackBarModule } from '@angular/material';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

/**
 * Custom module created imports
 */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing.module';
import { DynamicComponentModule } from './core-modules/dynamic-component';
import { MaterialCoreModule } from './core-modules/material-core.module';
import { PipeSharedModule } from './core-modules/pipe-shared.module';
import { SharedModule } from './core-modules/shared.module';

/**
 * Custom shared modules
 */
import { DatePickerFullComponent } from './shared-components/date-picker-full/date-picker-full.component';
import { DatePickerMonthComponent } from './shared-components/date-picker-month/date-picker-month.component';
import { DatePickerYearComponent } from './shared-components/date-picker-year/date-picker-year.component';

/**
 * Custom component imports
 */
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { DialogComponent } from './dialog/dialog.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { ChartpanelComponent } from './time-series/chartpanel/chartpanel.component';
import { ControlpanelComponent } from './time-series/controlpanel/controlpanel.component';
import { TablepanelComponent } from './time-series/tablepanel/tablepanel.component';
import { LayerFilterComponent } from './tool/layer-filter-tool/layer-filter.component';
import { TerrabrasilisApiComponent } from './tool/terrabrasilis-api/terrabrasilis-api.component';
import { UserComponent } from './user/user.component';
import { WmsSearchComponent } from './wms/wms-search/wms-search.component';


/**
 * Services
 */
import { TranslateService } from '@ngx-translate/core';
import { ContactService } from './services/contact.service';
import { DatasourceService } from './services/datasource.service';
import { FilterService } from './services/filter.service';
import { LayerService } from './services/layer.service';
import { LocalStorageService } from './services/local-storage.service';
import { MapWmsSearchDialogService } from './services/map-wms-search-dialog.service';
import { MatPaginatorI18nService } from './services/mat-paginator-i18n.service';
import { TimeDimensionService } from './services/time-dimension.service';
import { TsComponentsDataShareService } from './services/ts-components-data-share.service';
import { UserProviderService } from './services/user-provider.service';
import { VisionService } from './services/vision.service';
import { WmsCapabilitiesProviderService } from './services/wms-capabilities-provider.service';

/**
 * Providers
 */

/**
 * Translate tool
 */
import { HttpLoaderFactory } from "./factory/httpLoaderFactory";

/**
 * Node modules import
 */
import 'hammerjs';

import 'gridstack';

import StoreModule from './redux/store';
import { LanguageService } from './services/language.service';
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
    DatasourceService,
    LayerService,
    FilterService,
    TimeDimensionService,
    VisionService,
    MatDatepickerModule,
    TsComponentsDataShareService,
    LanguageService,
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
