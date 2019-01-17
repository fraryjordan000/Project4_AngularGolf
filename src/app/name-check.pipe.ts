import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameCheck'
})
export class NameCheckPipe implements PipeTransform {

  transform(p_name: string, p_array?: any): any {
    let duplicate = false;
    let count = 1;
    for(let p in p_array) {
      if(p_array[p] == p_name && count == 2) {
        duplicate = true;
      } else if(p_array[p] == p_name) {
        count = 2;
      }
    }
    return duplicate ? p_name+'_' : p_name;
  }

}
