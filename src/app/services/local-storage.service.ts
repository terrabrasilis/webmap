import { Injectable } from '@angular/core';
import { LocalStorage, JSONSchema } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';

const schema: JSONSchema = {
  properties: {
    key: { type: 'string' },
    value: { type: 'string' }
  },
  required: ['key', 'value']
};

@Injectable()
export class LocalStorageService {

  /**
   * The main object to storage
   * key
   * value
   */
  private toStorage: any = {};
  private prefix = 'tbv01_';

  constructor(private localStorage: LocalStorage) { }

  setValue(key: any, value: any): Observable<any>  {
    this.toStorage.key = key;
    this.toStorage.value = value;

    return this.localStorage.setItem(this.prefix + key, JSON.stringify(this.toStorage))
  }

  getValue(key: any): Observable<any> {
    return this.localStorage.getItem(this.prefix + key);
  }

  clearAll(): void {
    this.localStorage.clear().subscribe(() => {});
  }

  removeItem(key: any): void {
    this.localStorage.removeItem(this.prefix + key).subscribe(() => {});
  }
}
