import { Action, createReducer, createAction, on, props } from '@ngrx/store'

export const featureKey = 'LanguageSelector'

/* ACTIONS / CREATORS */
export const actions = {
  setLanguage: createAction(
    '[LANGUAGE] set language',
    props<{ language: string }>()
  )
}

export enum Languages {
  portuguese = 'BRAZILIAN',
  english = 'ENGLISH'
}

export interface State {
  language: String
}

export const initialState: State = {
  language: Languages.portuguese
}

/* REDUCER */
export const translateReducer = createReducer(
  initialState,
  // Even thought the `state` is unused, it helps infer the return type
  on(actions.setLanguage, (state, action: any) => ({
    ...state,
    language: action.language
  }))
)

export function reducer(state: State | undefined, action: Action) {
  return translateReducer(state, action)
}

// SELECTOR
export const getLanguage = (state: State) => state.language
