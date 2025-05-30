import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { RegisterService } from 'src/app/services/register.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  assetForm!: FormGroup;
  searchValue: string = '';
  loading: boolean = true;
  tableHeader: string[] = [
    'Nome',
    'SINACOR',
    'EUA Grupo Conta',
    'EUA Conta',
  ];
  customersResponse: Customer[] | undefined;
  currentPage: number = 1;
  pageSize: number = 10;
  filteredLength = { count: 0 };

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerService.getAllCustomers().subscribe({
      next: (response) => {
        this.customersResponse = response;
        this.loading = false;
        this.toastService.showSuccessToast('Sucesso ao obter os dados.');
      },
      error: (err) => {
        this.loading = false;
        this.toastService.showErrorToast(err.error.ExceptionMessage);
      },
    });
  }

  onSubmit(): void { }

}
