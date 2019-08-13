import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanWhiteSpace'
})
export class CleanWhiteSpacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return '';
    }
    return value.replace(/\s/g, "");
  }

}
