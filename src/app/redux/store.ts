import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule, META_REDUCERS, MetaReducer } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../../environments/environment'
import { ROOT_REDUCERS, metaReducers } from './reducers'
import { storageMetaReducer } from './storage-metareducer'
import { ROOT_STORAGE_KEYS, ROOT_LOCAL_STORAGE_KEY } from './app.tokens'
import { LocalStorageService } from './local-storage.service'

// factory meta-reducer configuration function
export function getMetaReducers(
  saveKeys: string[],
  localStorageKey: string,
  storageService: LocalStorageService
): MetaReducer<any>[] {
  return [storageMetaReducer(saveKeys, localStorageKey, storageService)]
}

@NgModule({
  imports: [
    StoreModule.forRoot(ROOT_REDUCERS, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [
    { provide: ROOT_STORAGE_KEYS, useValue: ['layout.theme'] },
    { provide: ROOT_LOCAL_STORAGE_KEY, useValue: '__app_storage__' },
    {
      provide: META_REDUCERS,
      deps: [ROOT_STORAGE_KEYS, ROOT_LOCAL_STORAGE_KEY, LocalStorageService],
      useFactory: getMetaReducers
    }
  ]
})
export default class StoreModuleConfig {}
