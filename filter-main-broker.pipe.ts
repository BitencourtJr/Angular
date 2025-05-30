import { Pipe, PipeTransform } from '@angular/core';
import { MainBroker } from 'src/app/models/main-broker';

@Pipe({
  name: 'filterMainBroker',
})
export class FilterPipe implements PipeTransform {
  transform(value: any, searchValue: string): MainBroker[] {
    return value?.filter((x: MainBroker) => {
      return x?.MainBroker?.toLowerCase().includes(searchValue?.toLowerCase());
    });
  }
}
