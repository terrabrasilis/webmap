import { actions, featureKey, reducer } from './layer-filter-reducer'

describe('LayerFilterReducer', () => {
  describe('ACTIONS:', () => {
    it('feature key should be "layerFilter"', () => {
      expect(featureKey).toBe('layerFilter')
    })

    it('setInitialDate should be a function', () => {
      expect(actions.setInitialDate).toBeInstanceOf(Function)
    })

    it('setFinalDate should be a function', () => {
      expect(actions.setFinalDate).toBeInstanceOf(Function)
    })
  })

  describe('REDUCERS', () => {
    it('should return the default state', () => {
      const result = reducer(undefined, {} as any)
      expect(result).toMatchSnapshot()
    })

    // it('should dispatch the setInitialDate and return the merged object', () => {
    //   const action = actions.setInitialDate({ date: new Date() })
    //   const result = reducer(fromBooks.initialState, action)
    //     console.log('====================================');
    //     console.log({result});
    //     console.log('====================================');
    //   //   expect(result).toMatchSnapshot()
    // })

    it('should dispatch the setFinalDate and return the merged object', () => {})
  })

  describe('SELECTORS', () => {})
})
