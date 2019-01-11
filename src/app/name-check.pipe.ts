import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameCheck'
})
export class NameCheckPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
