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

        // confirm the 13111 port in docker-stacks/api/business-api-homologation.yaml
        // or use the homologation url to acess from outside (internet): http://terrabrasilis.dpi.inpe.br/homologation/api/v1/
        if(environment.BUILD_TYPE == 'staging') url = 'http://terrabrasilis.dpi.inpe.br/homologation/api/v1/';
        
        // confirm the 2222 port in docker-stacks/demo/docker-compose.yaml
        if(environment.BUILD_TYPE == 'compose') url = 'http://localhost:2222/api/v1/';
        
        return url;
    };
    /**
     *  Defines an enum to store types of time dimension granularity
     */
    public static Granularity = { Daily: 'Daily', Monthly: 'Montly', Yearly: 'Yearly' }; 

}
