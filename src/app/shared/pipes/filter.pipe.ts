import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name:'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, field: string): any[] {
    if (!items) return [];
    if (!searchText || !field) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      if (typeof item[field] === 'string') {
        return item[field].toLowerCase().includes(searchText);
      }
      return false;
    });
  }
}
