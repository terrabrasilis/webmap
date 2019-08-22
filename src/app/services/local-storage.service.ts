import { Injectable } from '@angular/core';
import { LocalStorage, JSONSchema } from '@ngx-pwa/local-storage';

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

  setValue(key: any, value: any) {
    this.toStorage.key = key;
    this.toStorage.value = value;

    this.localStorage.setItem(this.prefix + key, JSON.stringify(this.toStorage)).subscribe(() => {
      // console.log("Object storaged!");
      // console.log(this.toStorage);
    });
  }

  getValue(key: any): any {
    return this.localStorage.getItem(this.prefix + key);
  }

  clearAll(): void {
    this.localStorage.clear().subscribe(() => {});
  }

  removeItem(key: any): void {
    this.localStorage.removeItem(this.prefix + key).subscribe(() => {});
  }
}
