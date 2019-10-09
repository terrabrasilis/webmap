import { includes, filter, forEach, kebabCase, get } from 'lodash'

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
  },

  getLegend (layer, urlOrCompleteSrcImgElement, language) {
    const host = layer.datasource == null ? layer.thirdHost : layer.datasource.host
    const params = (host.split('?')[1] ? '&':'?') + 'request=GetLegendGraphic&format=image/png&width=20&height=20&layer=' + layer.workspace + ':' + layer.name + '&service=WMS'
    let url = host + params

    const IS_INPE_HOST = this.isInpeUrl(host)
    if(IS_INPE_HOST) { url += `&style=${layer.name}_${language}` }

    return urlOrCompleteSrcImgElement == true ? '<img src=\'' + url + '\' />' : url
  },

  isInpeUrl (url) {
    return includes(url, 'dpi.inpe')
  }
}
