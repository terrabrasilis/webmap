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

  getLegend (layer, urlOrCompleteSrcImgElement, language, bbox, crs, applyStyle=true) 
  {
    const host = layer.datasource == null ? layer.thirdHost : layer.datasource.host
    
    let params = (host.split('?')[1] ? '&':'?') + 'request=GetLegendGraphic&format=image/png&width=20&height=20&layer=' + layer.workspace + ':' + layer.name + '&service=WMS'

    if(bbox && crs)
    {
      params+='&bbox=' +bbox;
      params+='&srs=' +crs;
    }

    if(layer.getFilter())
    {
      if(layer.getFilter().time)
      {
        params+='&time=' +layer.getFilter().time;
        params+='&legend_options=hideEmptyRules:true;forceLabels:on'
      }
    }

    let url = host + params

    if(applyStyle==true)
    {
      if(layer.isExternal()==false && layer.getStyleName()) 
      {
        url += `&style=${layer.workspace}:${layer.getStyleName()}_${language}` 
      }  
    }
    return urlOrCompleteSrcImgElement == true ? '<img src=\'' + url + '\' />' : url
  },

  isInpeUrl (url) {
    return includes(url, 'dpi.inpe')
  },

  removeURLParameters (url: string) {
    if(url.includes('?')==true)
    {
      return url.split('?')[0];
    }
    return url;
  }
}
