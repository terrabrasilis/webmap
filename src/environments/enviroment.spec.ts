import { async } from '@angular/core/testing';
import { environment as development } from './environment'
import { environment as production } from './environment'
import { environment as staging } from './environment'

describe('Enviroment simple unit tests', () => {
  beforeEach(async(() => {}));

  it('should be true',
   async(() => {
    expect(development.production).toEqual(false);
    expect(staging.production).toEqual(true);
    expect(production.production).toEqual(true);
  }));
});
