import { Pipe, PipeTransform } from '@angular/core';
import { Country } from 'src/app/models/country';

@Pipe({
  name: 'filterCountry',
})
export class FilterCountryPipe implements PipeTransform {
  transform(value: any, searchValue: string): Country[] {
    return value?.filter((x: Country) => {
      return x.Nome.toLowerCase().includes(searchValue.toLowerCase());
    });
  }
}
