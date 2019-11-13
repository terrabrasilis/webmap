import { NgModule } from '@angular/core'
// import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../../environments/environment'
import { ROOT_REDUCERS, metaReducers } from './reducers'

@NgModule({
  imports: [
    StoreModule.forRoot(ROOT_REDUCERS, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    // EffectsModule.forRoot([]),
    environment.production ? [] : StoreDevtoolsModule.instrument()
  ]
})

export default class StoreModuleConfig {}
