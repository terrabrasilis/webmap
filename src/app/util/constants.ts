/**
 * This class is responsible to store all global variables to use in entire application and not duplicate code
 */

import { environment } from '../../environments/environment';

export class Constants {
    public static get PROXY_OGC(): string {
        return environment.PROXY_OGC
    };

    public static get TERRABRASILIS_API_HOST(): string {
        return environment.TERRABRASILIS_API_HOST 
    };

    public static get TERRABRASILIS_BUSINESS_API_HOST(): string {
        let url = 'http://terrabrasilis.dpi.inpe.br/business/api/v1/';

        if(environment.BUILD_TYPE && environment.ENV == 'production') {
            // confirm the 13111 port in docker-stacks/api/business-api-homologation.yaml
            if(environment.BUILD_TYPE == 'homologation') url = 'http://terrabrasilis2.dpi.inpe.br:13111/api/v1/';
            
            // confirm the 2222 port in docker-stacks/demo/docker-compose.yaml
            if(environment.BUILD_TYPE == 'compose') url = 'http://localhost:2222/api/v1/';
        }
        return url;
    };
}
