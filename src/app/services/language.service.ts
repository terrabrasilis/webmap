import { Injectable } from '@angular/core';

@Injectable()
export class LanguageService {
  
  constructor(
  ) {}

  public static getCurrentLang(): string
  {
    let currentLang = localStorage.getItem(this.getLanguageKey())
    if(currentLang && currentLang!='undefined')
    {
      return currentLang;
    }
    
    return this.getDefaultLanguage();
    
  }

  public static setCurrentLang(lang: string)
  {
    localStorage.setItem(this.getLanguageKey(), lang);
  }
  private static getDefaultLanguage()
  {
    return "pt-br";
  }

  private static getLanguageKey()
  {
    return "currentlang";
  }
}
