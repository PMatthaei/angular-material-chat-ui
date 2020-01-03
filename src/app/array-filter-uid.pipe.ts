import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayFilterUid'
})
export class ArrayFilterUidPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value || !args) {
      return value;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    console.log(value)
    console.log(args)
    return value.filter(item => item != args[0]);
  }

}


/*import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class ArrayFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item != filter);
  }
}*/