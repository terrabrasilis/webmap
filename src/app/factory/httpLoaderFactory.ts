import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
   let i18nResource = ( process.env.ENV === 'production' )?('/app/assets/i18n/'):('assets/i18n/');
   return new TranslateHttpLoader(httpClient, i18nResource, '.json');
}