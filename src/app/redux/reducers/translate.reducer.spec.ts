import {
  reducer,
  initialState,
  actions,
  getLanguage,
  Languages
} from './translate.reducer'

describe('Translate Reducer', () => {
  describe('SELECTOR', () => {
    it('getLanguage: the selector should return the state value', () => {
      // const result = reducer({},actions.setLanguage)
      const initialLanguage = getLanguage(initialState)
      expect(initialLanguage).toBe(Languages.portuguese)
    })
  })

  describe('REDUCER', () => {
    it('the initial state should be with the pt-br language', () => {
      const NULL_STATE = undefined
      const changedState = reducer(
        NULL_STATE,
        actions.setLanguage({ language: Languages.english })
      )

      const expectedResult = { language: 'ENGLISH' }
      expect(changedState).toStrictEqual(expectedResult)
    })
  })
})
