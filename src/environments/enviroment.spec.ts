import { async } from '@angular/core/testing';
import { environment as development } from './environment'
import { environment as staging } from './environment.staging'
import { environment as production } from './environment.prod'

describe('Enviroment simple unit tests', () => {
  beforeEach(async(() => {}));

  it('should test if the environment was overwriting all the configs based on its profile',
   async(() => {
    expect(development.production).toEqual(false);
    expect(staging.production).toEqual(true);
    expect(production.production).toEqual(true);
  }));
});
