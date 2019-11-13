import { createReducer, createAction, on, props } from '@ngrx/store'

/* ACTIONS / CREATORS */
export const openSidenav = createAction('[FILTER] Open Sidenav')
export const closeSidenav = createAction('[FILTER] Close Sidenav')

export const featureKey = 'layerFilter'

export interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false,
}

/* REDUCER */
export const reducer = createReducer(
  initialState,
  // Even thought the `state` is unused, it helps infer the return type
  on(closeSidenav, state => ({ showSidenav: false })),
  on(openSidenav, state => ({ showSidenav: true }))
)

// SELECTOR
export const selectShowSidenav = (state: State) => state.showSidenav