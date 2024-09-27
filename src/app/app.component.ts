import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { version } from '../../package.json';
import { LanguageService } from './services/language.service';
import { LocalStorageService } from './services/local-storage.service';

/**
 * To use localStorage with angular:
 * 1 - https://github.com/zoomsphere/ngx-store
 * 2 - https://www.npmjs.com/package/@ngx-pwa/local-storage (**INSTALLED AND USING)
 * 
 * To use translate:
 * 1 - http://anthonygiretti.com/2018/04/23/getting-started-with-translation-in-angular-5-with-ngx-translate/
 * 2 - https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-angular-app-with-ngx-translate
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  imgPath:string=( process.env.ENV === 'production' )?('/app/'):('');

  public version: string = version;// the project version loaded from package.json
  public title:string = '';
  public type:string = '';
  private languageKey: string = "language";

  constructor(private router: Router    
    , private _translate: TranslateService
    , private localStorageService: LocalStorageService) {

    this.loadDefaultLanguage();
  }

  ngOnInit() {
    this._translate.get('app.title').subscribe((translated: string) => {
      //this.title = this._translate.instant('app.title');
      //this.title = translated;
      //console.log(translated);
    });   
    this.localStorageService.clearAll();
  }

  callLogin() {
    this.router.navigate(["login"]);
  }
  
  private loadDefaultLanguage(): void 
  { 
    let lang = LanguageService.getCurrentLang();
    
    if(lang === null) {      
      this._translate.setDefaultLang('pt-br');
      this._translate.use('pt-br');
      this.localStorageService.setValue(this.languageKey, 'pt-br');
      LanguageService.setCurrentLang('pt-br');  
      return;
    } 
    
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);
    LanguageService.setCurrentLang(lang);           
  }
}
