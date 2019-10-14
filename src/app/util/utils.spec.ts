import { async } from '@angular/core/testing'
import { Utils } from './utils'

describe('UTILS: ', () => {
  describe('.genericSearch: ', () => {
    const cityArray = ['sÃo, Páulo', 'PAUlópolis', 'inicioPaUlofim', 'riô de Jánẽiro', 'janeiroCity', 'belem do PARÁ', 'PARANA', 'PARATESTE']

    it('should find 3 results for the search term PARA', async (() => {
      const expectResult = ['belem do PARÁ', 'PARANA', 'PARATESTE']
      expect(Utils.genericSearch(cityArray, 'para')).toEqual(expectResult)
      expect(Utils.genericSearch(cityArray, 'pãra')).toEqual(expectResult)
      expect(Utils.genericSearch(cityArray, 'pará')).toEqual(expectResult)
      expect(Utils.genericSearch(cityArray, 'pARÃ')).toEqual(expectResult)
      expect(Utils.genericSearch(cityArray, 'párá')).toEqual(expectResult)
    }))

    it('should find 2 results for the search term paulo', async (() => {
      const expectResult = ['sÃo, Páulo', 'PAUlópolis', 'inicioPaUlofim']
      expect(Utils.genericSearch(cityArray, 'paulo')).toEqual(expectResult)
      expect(Utils.genericSearch(cityArray, 'PÃULÓ')).toEqual(expectResult)
      expect(Utils.genericSearch(cityArray, 'pAuLò')).toEqual(expectResult)
    }))
  })

  describe('.getLegend', () => {
    const layerMock = {
      workspace: 'prodes-amz',
      name: 'yearly_deforestation_2008_2018_biome',
      datasource: { host: 'http://terrabrasilis.dpi.inpe.br/geoserver/ows' },
      thirdHost: ''
    }

    const language = 'pt-br'

    it('should build the url for the legend', async (() => {
      const SHOULD_RETURN_AS_TAG = false
      const result = Utils.getLegend({ ...layerMock }, SHOULD_RETURN_AS_TAG, language)
      const expected = 'http://terrabrasilis.dpi.inpe.br/geoserver/ows?request=GetLegendGraphic&format=image/png&width=20&height=20&layer=prodes-amz:yearly_deforestation_2008_2018_biome&service=WMS&style=yearly_deforestation_2008_2018_biome_pt-br'
      expect(result).toEqual(expected)
    }))

    it('should build the entire img tag with all informations', async (() => {
      const SHOULD_RETURN_AS_TAG = true
      const result = Utils.getLegend({ ...layerMock }, SHOULD_RETURN_AS_TAG, language)
      const expected = "<img src='http://terrabrasilis.dpi.inpe.br/geoserver/ows?request=GetLegendGraphic&format=image/png&width=20&height=20&layer=prodes-amz:yearly_deforestation_2008_2018_biome&service=WMS&style=yearly_deforestation_2008_2018_biome_pt-br' />"
      expect(result).toEqual(expected)
    }))

    it('should built the tag for an intern INPE url applying the style', async (() => {
      const SHOULD_RETURN_AS_TAG = true
      const result = Utils.getLegend({ datasource: { host: '' }, thirdHost: true, ...layerMock }, SHOULD_RETURN_AS_TAG, language)
      const expected = "<img src='http://terrabrasilis.dpi.inpe.br/geoserver/ows?request=GetLegendGraphic&format=image/png&width=20&height=20&layer=prodes-amz:yearly_deforestation_2008_2018_biome&service=WMS&style=yearly_deforestation_2008_2018_biome_pt-br' />"
      expect(result).toEqual(expected)
    }))

    it('should built the tag for an external URL in which not apply the style', async (() => {
      const SHOULD_RETURN_AS_TAG = true
      const result = Utils.getLegend({ datasource: { host: '' }, ...layerMock }, SHOULD_RETURN_AS_TAG, language)
      const expected = "<img src='http://terrabrasilis.dpi.inpe.br/geoserver/ows?request=GetLegendGraphic&format=image/png&width=20&height=20&layer=prodes-amz:yearly_deforestation_2008_2018_biome&service=WMS&style=yearly_deforestation_2008_2018_biome_pt-br' />"
      expect(result).toEqual(expected)
    }))
  })

  describe('.isInpeUrl', () => {
    it('should assert multiple times ', async (() => {
      expect(Utils.isInpeUrl('teste')).toBeFalsy()
      expect(Utils.isInpeUrl('dpi.inpe')).toBeTruthy()
      expect(Utils.isInpeUrl('http://terrabrasilis.dpi.inpe.br')).toBeTruthy()
      expect(Utils.isInpeUrl('http://terrabrasilis.dpi.vral')).toBeFalsy()
      expect(Utils.isInpeUrl('www.google.com')).toBeFalsy()
      expect(Utils.isInpeUrl('www.terrabrasilis.com.br')).toBeFalsy()
    }))
  })
})
