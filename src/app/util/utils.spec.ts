import { async } from '@angular/core/testing';
import { Utils } from './utils'

describe('UTILS: ', () => {
  describe('.genericSearch: ', () => {
    const cityArray = ['sÃo, Páulo', 'PAUlópolis', 'inicioPaUlofim', 'riô de Jánẽiro', 'janeiroCity', 'belem do PARÁ', 'PARANA', 'PARATESTE']

    it('should find 3 results for the search term PARA', async (() => {
      const expectResult = ['belem do PARÁ', 'PARANA', 'PARATESTE']
      expect(Utils.genericSearch(cityArray, 'para')).toEqual(expectResult);
      expect(Utils.genericSearch(cityArray, 'pãra')).toEqual(expectResult);
      expect(Utils.genericSearch(cityArray, 'pará')).toEqual(expectResult);
      expect(Utils.genericSearch(cityArray, 'pARÃ')).toEqual(expectResult);
	    expect(Utils.genericSearch(cityArray, 'párá')).toEqual(expectResult);
    }));

    it('should find 2 results for the search term paulo', async (() => {
      const expectResult = ['sÃo, Páulo', 'PAUlópolis', 'inicioPaUlofim']
      expect(Utils.genericSearch(cityArray, 'paulo')).toEqual(expectResult);
      expect(Utils.genericSearch(cityArray, 'PÃULÓ')).toEqual(expectResult);
      expect(Utils.genericSearch(cityArray, 'pAuLò')).toEqual(expectResult);
    }));

  });
});
