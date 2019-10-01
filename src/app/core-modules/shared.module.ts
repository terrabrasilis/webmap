/** Angular */
import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClient } from "@angular/common/http";

/** Thirdies */
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpLoaderFactory } from "../factory/httpLoaderFactory";

/** Components */
import { ToolComponent } from "../tool/tool-component-interface";
import { TransparencyToolComponent } from "../tool/transparency-tool/transparency-tool.component";
import { BasicInfoToolComponent } from "../tool/basic-info-tool/basic-info-tool.component";
import { TimeDimensionComponent } from "../tool/time-dimension/time-dimension.component";
import { PipeSharedModule } from "./pipe-shared.module";
import { MaterialCoreModule } from "./material-core.module";
import { LayerDownloadToolComponent } from '../tool/layer-download-tool/layer-download-tool.component';
import { LayerLegendToolComponent } from '../tool/layer-legend-tool/layer-legend-tool.component';
import { LayerDashboardToolComponent } from '../tool/layer-dashboard-tool/layer-dashboard-tool.component';
import { LayerFitBoundsToolComponent } from '../tool/fit-bounds-tool/layer-fit-bounds-tool.component';
import { LayerMetadataToolComponent } from '../tool/layer-metadata-tool/layer-metadata-tool.component';
import { LayerRemoveToolComponent } from '../tool/layer-remove-tool/layer-remove-tool.component';

@NgModule({
  imports: [
    CommonModule,
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
    PipeSharedModule,
    MaterialCoreModule
  ],
  declarations: [
    /** Components */
    ToolComponent, TransparencyToolComponent, BasicInfoToolComponent, TimeDimensionComponent, LayerDownloadToolComponent, LayerLegendToolComponent, LayerDashboardToolComponent, LayerMetadataToolComponent, LayerRemoveToolComponent, LayerFitBoundsToolComponent,
  ],
  exports: [
    /** Components */
    ToolComponent, TransparencyToolComponent, BasicInfoToolComponent, TimeDimensionComponent, LayerDownloadToolComponent, LayerLegendToolComponent, LayerDashboardToolComponent, LayerMetadataToolComponent, LayerRemoveToolComponent, LayerFitBoundsToolComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule {}