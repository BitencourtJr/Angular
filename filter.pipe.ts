import { Pipe, PipeTransform } from '@angular/core';
import { Customer } from 'src/app/models/customer';

@Pipe({
  name: 'filterCustomer',
})
export class FilterCustomerPipe implements PipeTransform {
  transform(value: any, searchValue: string, filteredLength: any): Customer[] {
    let filteredItems = value?.filter((x: Customer) => {
      return (
        x.Nome?.toLowerCase().includes(searchValue.toLowerCase()) ||
        x.SINACORCodigo.valor
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        x.EUAGrupoContaCodigo.valor
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        x.EUAContaCodigo.valor
          ?.toLowerCase()
          .includes(searchValue.toLowerCase())
      );
    });
    filteredLength.count = filteredItems?.length;
    return filteredItems;
  }
}
