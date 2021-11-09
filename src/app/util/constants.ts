/**
 * This class is responsible to store all global variables to use in entire application and not duplicate code
 */

import { environment } from '../../environments/environment';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export class Constants {
    constructor(@Inject(DOCUMENT) private document: Document) {
        environment.BASE_SCHEMA=document.location.protocol;
        environment.BASE_HOST=document.location.hostname;
    }

    public static get BASE_URL(): string {
        return environment.BASE_SCHEMA+'//'+environment.BASE_HOST;
    };

    public static get PROXY_OGC(): string {
        return environment.BASE_SCHEMA+'//'+environment.BASE_HOST+environment.PROXY_OGC;
    };

    public static get TERRABRASILIS_API_HOST(): string {
        return environment.BASE_SCHEMA+'//'+environment.BASE_HOST+environment.TERRABRASILIS_API_HOST;
    };

    public static get TERRABRASILIS_BUSINESS_API_HOST(): string {
      
        let base_url=Constants.BASE_URL;

        if(environment.BUILD_TYPE)
        {
            if(environment.BUILD_TYPE == 'production')
            {
                let url = base_url+'/business/api/v1/';
                return url;
            }
            if(environment.BUILD_TYPE == 'staging')
            {
                let url = base_url+'/homologation/api/v1/';
                return url;
            }
            if(environment.BUILD_TYPE == 'development')
            {
                let url = base_url+':8090/api/v1/';
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
