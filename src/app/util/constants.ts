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
      

        if(environment.BUILD_TYPE)
        {
            if(environment.BUILD_TYPE == 'production')
            {
                let url = 'http://terrabrasilis.dpi.inpe.br/business/api/v1/';
                return url;
            }
            if(environment.BUILD_TYPE == 'staging')
            {
                let url = 'http://terrabrasilis.dpi.inpe.br/homologation/api/v1/';
                return url;
            }
            if(environment.BUILD_TYPE == 'development')
            {
                let url = 'http://localhost:8090/api/v1/';
                return url;
            }
        }
        throw new Error(`Invalid project BUILD_TYPE configuration: ${environment.BUILD_TYPE}`); 

    };
    /**
     *  Defines an enum to store types of time dimension granularity
     */
    public static Granularity = { Daily: 'Daily', Monthly: 'Montly', Yearly: 'Yearly' }; 

}
