import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../../environments/environment';

export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
   let i18nResource = ( environment.BUILD_TYPE === 'production' )?('/app/assets/i18n/'):('/assets/i18n/');
   return new TranslateHttpLoader(httpClient, i18nResource, '.json');
}