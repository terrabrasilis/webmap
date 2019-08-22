/**
 * Using the @angular/material
 *
 * https://www.npmjs.com/org/material
 *
 */

import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { MatAutocompleteModule
  , MatButtonModule
  , MatCardModule
  , MatCheckboxModule
  , MatDialogModule
  , MatDividerModule
  , MatExpansionModule
  , MatFormFieldModule
  , MatIconModule
  , MatInputModule
  , MatListModule
  , MatMenuModule
  , MatPaginatorModule
  , MatProgressBarModule
  , MatProgressSpinnerModule
  , MatRadioModule
  , MatSelectModule
  , MatSidenavModule
  , MatSliderModule
  , MatSlideToggleModule
  , MatTabChangeEvent
  , MatTableModule
  , MatTabsModule
  , MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    EcoFabSpeedDialModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule
  ],
  exports: [
    CommonModule,
    EcoFabSpeedDialModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  declarations: []
})

export class MaterialCoreModule { }
