import { Injectable } from '@angular/core';
declare var Authentication: any;

@Injectable()
export class AuthenticationService {

  private constructor(
  ) { }

  public static isAuthenticated() {
    return Authentication.hasToken();
  }

  public static getToken() {
    return Authentication.getToken();
  }

}
