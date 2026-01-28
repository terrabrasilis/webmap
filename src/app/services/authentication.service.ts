import { Injectable } from '@angular/core';
declare var Authentication: any;// from componet loaded dinamically when app is loaded on browser

@Injectable()
export class AuthenticationService {

  private constructor(
  ) { }

  public static isAuthenticated() {
    return ((typeof Authentication != 'undefined')?(Authentication.hasToken()):(false));
  }

  public static getToken() {
    return ((typeof Authentication != 'undefined')?(Authentication.getToken()):(false));
  }

  public static getOAuthProxyUrl(url, clientId, role)
  {
    return ((typeof Authentication != 'undefined')?(Authentication.getOAuthProxyUrl(url, clientId, role)):(false));
  }

}
