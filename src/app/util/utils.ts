import { includes, filter, forEach, kebabCase, get } from 'lodash';

export const Utils = {

  genericSearch (arrayToBeSearched = [], searchText = '') {
    const searchWords = this.removeSpecialCharactersAndCase(searchText)
    const elementsFound = filter(arrayToBeSearched, (element) => {
      let isValid = true
      const arrayElement = this.removeSpecialCharactersAndCase(element)
      forEach(searchWords, (searchedWord) => {
        if (!includes(arrayElement, searchedWord)) isValid = false
      })
      return isValid
    })

    return elementsFound
  },

  removeSpecialCharactersAndCase (word = '') {
    return kebabCase(word.toLowerCase()).split('-').join(' ')
  }

}
