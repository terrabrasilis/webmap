/**
 * This class is responsible to store all global variables to use in entire application and not duplicate code
 */

import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { environment } from '../../environments/environment';

export class Constants {
    constructor(@Inject(DOCUMENT) private document: Document) { }

    public static get BASE_URL(): string {
        return document.location.protocol+'//'+document.location.hostname;
    };

    public static get PROXY_GETCAPABILITIES(): string {
        return Constants.BASE_URL+environment.PROXY_GETCAPABILITIES;
    };

    public static get TERRABRASILIS_API_HOST(): string {
        return Constants.BASE_URL+environment.TERRABRASILIS_API_HOST;
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
                let url = base_url+'/business/api/v1/';
                
                if(environment.FORCE_API && environment.FORCE_API == 'yes')
                    return 'http://terrabrasilis.dpi.inpe.br/business/api/v1/';
                else
                    return url;
            }
        }
        throw new Error(`Invalid project BUILD_TYPE configuration: ${environment.BUILD_TYPE}`); 

    };
    public static get AUTHENTICATION_PROXY_HOST(): string 
    {
        return environment.AUTHENTICATION_PROXY_HOST;         
    };
    /**
     *  Defines an enum to store types of time dimension granularity
     */
    public static Granularity = { Daily: 'Daily', Monthly: 'Montly', Yearly: 'Yearly' }; 




}
