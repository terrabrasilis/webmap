import { createReducer, createAction, on, props } from '@ngrx/store'

/* ACTIONS / CREATORS */
export const actions = {
  setInitialDate: createAction('[FILTER] set initial date', props<{initialDate: Date}>()),
  setFinalDate: createAction('[FILTER] set final date', props<{finalDate: Date}>())
}
export const featureKey = 'layerFilter'

export interface State {
  initialDate: Date;
  finalDate: Date;
}

const initialState: State = {
  initialDate: null,
  finalDate: null
}

/* REDUCER */
export const reducer = createReducer(
  initialState,
  // Even thought the `state` is unused, it helps infer the return type
  on(actions.setFinalDate, (state, initialDate: any) => ({ ...state, initialDate })),
  on(actions.setInitialDate, (state, finalDate: any) => ({ ...state, finalDate }))
)

// SELECTOR
export const selectInitialDate = (state: State) => state.initialDate
export const selectFinalDate = (state: State) => state.finalDate