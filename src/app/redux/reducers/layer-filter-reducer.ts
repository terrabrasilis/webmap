import { createReducer, createAction, on, props, Action } from "@ngrx/store";
import { findIndex, size, merge } from "lodash";

/* ACTIONS / CREATORS */
export const actions = {
  setFilterPropsForObject: createAction(
    "[FILTER] set filter props for an specific Object",
    props<{ filterObject: Filter }>()
  )
};

export const featureKey = "layerFilter";

export interface State {
  filters: Filter[];
}
export interface Filter {
  id: number;
  initialDate: Date;
  finalDate: Date;
}

const initialState: State = { filters: [] };

export const onSetFilterAction = (state = initialState, filterObject) => {
  const FILTER_EXISTS =
    findIndex(state.filters, ["id", filterObject.id]) !== -1;
  if (FILTER_EXISTS) {
    return {
      filters: state.filters.map(filter =>
        filter.id === filterObject.id ? { ...filter, ...filterObject } : filter
      )
    };
  }

  return { ...state, filters: [...state.filters, filterObject] };
};

/* REDUCER */
export const reducer = createReducer(
  initialState,
  // Even thought the `state` is unused, it helps infer the return type
  on(actions.setFilterPropsForObject, onSetFilterAction)
);
