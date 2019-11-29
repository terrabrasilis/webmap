import {
  actions,
  featureKey,
  reducer,
  onSetFilterAction,
  State
} from "./layer-filter-reducer";
import { log } from "util";

describe("LayerFilterReducer", () => {
  describe("ACTIONS:", () => {
    it('feature key should be "layerFilter"', () => {
      expect(featureKey).toBe("layerFilter");
    });

    it("setInitialDate should be a function", () => {
      expect(actions.setFilterPropsForObject).toBeInstanceOf(Function);
    });
  });

  describe("REDUCERS", () => {
    it("should return the default state", () => {
      const result = reducer(undefined, {} as any);
      expect(result).toMatchSnapshot();
    });

    describe("onSetFilterAction", () => {
      it("should push a new object into the array", () => {
        const results = onSetFilterAction(undefined, { id: 1 });
        expect(results).toStrictEqual({ filters: [{ id: 1 }] });
      });
      it("should merge with an existent object", () => {
        const dateMock = new Date(2019, 6, 6);
        const initialDate = new Date(2016, 0, 1);
        const finalDate = new Date(2016, 0, 1);
        const initialState: State = {
          filters: [{ id: 1, initialDate, finalDate }]
        };
        const results = onSetFilterAction(initialState, {
          id: 2,
          initialDate: dateMock
        });
        expect(results).toStrictEqual({
          filters: [
            { id: 1, initialDate, finalDate },
            { id: 2, initialDate: dateMock }
          ]
        });
      });

      it("should update an existent object", () => {
        const dateMock = new Date(2019, 6, 6);
        const initialDate = new Date(2016, 0, 1);
        const finalDate = new Date(2016, 0, 1);
        const initialState: State = {
          filters: [{ id: 1, initialDate, finalDate }]
        };
        const results = onSetFilterAction(initialState, {
          id: 1,
          initialDate: dateMock
        });
        expect(results).toStrictEqual({
          filters: [{ id: 1, initialDate: dateMock, finalDate }]
        });
      });
    });
  });

  describe("SELECTORS", () => {});
});
