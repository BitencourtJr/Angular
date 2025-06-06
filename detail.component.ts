import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { phoneValidator  } from 'src/app/helpers/phone.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { City } from 'src/app/models/city';
import { CivilStatus } from 'src/app/models/civil-status';
import { Country } from 'src/app/models/country';
import { CustomerType } from 'src/app/models/customer-type';
import { Destination } from 'src/app/models/destination';
import {
  BrokerCommodity,
  Contato,
  CvmNumero,
  DetailCustomer,
  Residencia,
  ShareBroker,
} from 'src/app/models/detail-customer';
import { Education } from 'src/app/models/education';
import { FieldActivity } from 'src/app/models/field-activity';
import { Gender } from 'src/app/models/gender';
import { InvestorType } from 'src/app/models/investor-type';
import { MainBroker } from 'src/app/models/main-broker';
import { RelatCI } from 'src/app/models/relatCi';
import { RelatCN } from 'src/app/models/relatCn';
import { SystemMarriage } from 'src/app/models/systemMarriage';
import { Uf } from 'src/app/models/uf';
import { RegisterService } from 'src/app/services/register.service';
import { ToastService } from 'src/app/services/toast.service';
import { Broker } from 'src/app/shared/models/brokers';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  loading: boolean = false;
  basicDataForm!: FormGroup;
  complementCpf!: FormGroup;
  cetipForm!: FormGroup;
  emailControl!: FormControl;
  phoneControl!: FormControl;

  consultResponse: DetailCustomer | undefined;
  phoneResponse: DetailCustomer | undefined;

  customerTypesResponse: CustomerType[] | undefined;
  investorTypesResponse: InvestorType[] | undefined;
  countryResponse: Country[] | undefined;
  civilStatusResponse: CivilStatus[] | undefined;
  systemMarriageResponse: SystemMarriage[] | undefined;
  relatCnResponse: RelatCN[] | undefined;
  relatCiResponse: RelatCI[] | undefined;
  genderResponse: Gender[] | undefined;
  educationResponse: Education[] | undefined;
  fieldActivityResponse: FieldActivity[] | undefined;
  cityResponse: City[] | undefined;
  cityAddResidResponse: City[] | undefined;
  ufResponse: Uf[] | undefined;
  ufAddResidResponse: Uf[] | undefined;
  mainBrokerResponse: MainBroker[] | undefined;
  destinationResponse: Destination[] | undefined;
  nacionalityResponse: Destination[] | undefined;

  contatoArrLength: number = 0;
  phoneArrLength: number = 0;
  residArrLength: number = 0;

  isEditingCustomer: boolean = false;

  singleStatus: boolean = false;

  addInfo: boolean = false;
  addPhoneInfo: boolean = false;
  addResidencia: boolean = false;
  addInfoInput: string = '';
  addPhoneInfoInput: string = '';
  editInfoInput: string = '';
  editPhoneInfoInput: string = '';
  euaSubAccountInput: string = '';
  showEditContact!: number;
  showEditPhoneContact!: number;
  showEditResidencia!: number;

  editDestinoInput: string = 'selecione';
  editPaisInput: string = 'selecione';
  editCepInput: string = '';
  editLogradouroInput: string = '';
  editEstadoInput: string = 'selecione';
  editCidadeInput: string = 'selecione';
  editBairroInput: string = '';

  filterMainBroker: string = '';
  filterCountry: string = '';

  docTypeLabel: string = 'CPF';

  euaSubAccArr: CvmNumero[] = [];
  residArr: Residencia[] = [];
  contatoArr: Contato[] = [];
  phoneArr: Contato[] = [];
  sharedBrokerArr: ShareBroker[] = [];

  searchCommodityBrokerValue: string = "";

  brokerCommodityDialogOpened: boolean = false;
  

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private router: Router
  ) { }

  
  addCustomer() {

console.log("CadastroResumido",this.basicDataForm.get('CadastroResumido')?.value);

    let addObj: DetailCustomer = {
      TelefonePrincipal: this.basicDataForm.get('telefone')?.value,
      Residencias: this.residArr,
      //Contatos: this.contatoArr,
      Contatos:[...this.contatoArr, ...this.phoneArr],
      IDT: {
        ID: {
          Numero: 0.0,
        },
        Nome: this.basicDataForm.get('nome')?.value,
        SINACORCodigo: {
          valor: this.basicDataForm.get('SINACORCodigo')?.value,
        },
        EUAContaCodigo: {
          valor: this.basicDataForm.get('EUAContaCodigo')?.value,
        },
        EUAGrupoContaCodigo: {
          valor: this.basicDataForm.get('EUAGrupoContaCodigo')?.value,
        },
        OperacoesTipo: null,
        Estado: 'True',
        BloqueadoRegistroBolsa: this.basicDataForm.get('BloqueadoRegistroBolsa')
          ?.value,
        CadastroResumido: false, /* this.basicDataForm.get('CadastroResumido')?.value*/
      },
      EUASubContas: this.euaSubAccArr,
      CPF: {
        numero:
          this.basicDataForm.get('docType')?.value === 'cpf'
            ? this.basicDataForm.get('doc')?.value
            : '',
      },
      CNPJ: {
        numero:
          this.basicDataForm.get('docType')?.value === 'cnpj'
            ? this.basicDataForm.get('doc')?.value
            : '',
      },
      CVMNumero: {
        valor:
          this.basicDataForm.get('docType')?.value === 'cvm'
            ? this.basicDataForm.get('doc')?.value
            : '',
      },
      EUAResidente: !this.basicDataForm.get('EUAResidente')?.value,
      Telefones: [
        {
          Telefone: {
            Id: {
              Numero: 0,
            },
            PaisCodigo: '00',
            DDDCodigo: '00',
            Numero: '000000000',
          },
        },
      ],
      Tipo: this.basicDataForm.get('Tipo')?.value,
      InvestidorTipo: this.basicDataForm.get('investidorTipo')?.value,
      MainBroker: {
        valor: this.basicDataForm.get('MainBroker')?.value,
      },
      CPFCompNacionalidade: this.complementCpf.get('nacionalidade')?.value,
      CPFCompPais: {
        Nome: '',
        Sigla: this.complementCpf.get('country')?.value,
      },
      CPFCompUFNascimento: {
        Nome: null,
        UF: this.complementCpf.get('birthUf')?.value,
        Pais: null,
      },
      CPFCompLocalNascimento: {
        Nome: this.complementCpf.get('birthPlace')?.value,
        Estado: null,
      },
      CPFCompPaiResponsavel: this.complementCpf.get('pai')?.value,
      CPFCompMae: this.complementCpf.get('mae')?.value,
      CPFCompNomeConjugue: this.complementCpf.get('spouseName')?.value,
      CPFCompCPFConjugue: this.complementCpf.get('spouseCpf')?.value,
      CPFCompDataNascConjugue: this.complementCpf.get('spouseBirth')?.value,
      CPFCompPaisResidencia: {
        Nome: '',
        Sigla: this.complementCpf.get('countryResid')?.value,
      },
      CPFCompCargo: this.complementCpf.get('occupation')?.value,
      CPFCompRamo: {
        Id: {
          Numero: this.complementCpf.get('fieldActivity')?.value,
        },
        Nome: 'Automóveis e Veículos',
      },
      ShareBrokers: [],
      BrokerCommoditys: this.consultResponse?.BrokerCommoditys || [],
      cNRelatorioLegaisClassificacao: {
        Codigo: {
          valor: this.complementCpf.get('relatCn')?.value,
        },
        Nome: 'CN',
      },
      cIRelatorioLegaisClassificacao: {
        Codigo: {
          valor: this.complementCpf.get('relatCi')?.value,
        },
        Nome: 'CI',
      },
      Sexo: {
        Id: {
          Numero: this.complementCpf.get('gender')?.value,
        },
        Nome: 'Masculino',
      },
      Escolaridade: {
        Id: {
          Numero: this.complementCpf.get('education')?.value,
        },
        Nome: 'Superior Completo',
      },
      RegimeCasamento: {
        Id: {
          Numero: this.complementCpf.get('systemMarriage')?.value,
        },
        Nome: 'Separação Total de Bens',
      },
      EstadoCivil: {
        Id: {
          Numero: this.complementCpf.get('civilStatus')?.value,
        },
        Nome: 'Solteiro(a)',
      },
      Ativo: true,
      CETIP: {
        Codigo: {
          valor: this.cetipForm.get('account')?.value,
        },
        Tributacao: {
          IsentoIOF: this.cetipForm.get('iof')?.value === 'iofy',
          IsentoIFR: this.cetipForm.get('ifr')?.value === 'ifry',
        },
      },
    };

    this.registerService.postSaveCustomer(addObj).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast('Cliente cadastrado com sucesso');
        setTimeout(() => {
          this.router.navigate(['/register/customer']);
        }, 1000);
      },
      error: (err) => {
        this.toastService.showErrorToast(err.error.ExceptionMessage);
      },
    });
  }

  public selectNewDocLabel() {
    this.basicDataForm.patchValue({
      doc: '',
    });

    this.changeDocLabel();
  }

  private changeDocLabel() {
    if (this.basicDataForm.get('docType')?.value === 'cpf') {
      this.docTypeLabel = 'CPF';
    } else if (this.basicDataForm.get('docType')?.value === 'cnpj') {
      this.docTypeLabel = 'CNPJ';
    } else if (this.basicDataForm.get('docType')?.value === 'cvm') {
      this.docTypeLabel = 'CVM';
    }

    if (this.docTypeLabel !== 'CPF') {
      this.complementCpf.disable();
      this.complementCpf.controls['relatCn'].enable();
      this.complementCpf.controls['relatCi'].enable();
      this.complementCpf.controls['fieldActivity'].enable();
    }
  }

  onChangeCivilStatus() {
    if (
      this.complementCpf.get('civilStatus')?.value === 1 ||
      this.complementCpf.get('civilStatus')?.value === 2 ||
      this.complementCpf.get('civilStatus')?.value === 3 ||
      this.complementCpf.get('civilStatus')?.value === 4
    ) {
      this.complementCpf.controls['systemMarriage'].disable();
      this.complementCpf.controls['spouseName'].disable();
      this.complementCpf.controls['spouseCpf'].disable();
      this.complementCpf.controls['spouseBirth'].disable();
    } else {
      this.complementCpf.controls['systemMarriage'].enable();
      this.complementCpf.controls['spouseName'].enable();
      this.complementCpf.controls['spouseCpf'].enable();
      this.complementCpf.controls['spouseBirth'].enable();
    }

    this.complementCpf.patchValue({
      systemMarriage: 'selecione',
      spouseName: '',
      spouseCpf: '',
      spouseBirth: null,
    });
  }

  toggleEditContact(index: number) {
    if (this.showEditContact == index) {
      this.showEditContact = -1;
    } else {
      this.showEditContact = index;
    }
  }

  
  toggleEditPhoneContact(index: number) {
    if (this.showEditPhoneContact == index) {
      this.showEditPhoneContact = -1;
    } else {
      this.showEditPhoneContact = index;
    }
  }

  toggleEditResidencia(index: number) {
    if (this.showEditResidencia == index) {
      this.showEditResidencia = -1;
    } else {
      this.showEditResidencia = index;
    }
  }

  confirmAddResidencia() {
    if (
      this.editDestinoInput === '' ||
      this.editPaisInput === 'selecione' ||
      this.editCepInput === '' ||
      this.editLogradouroInput === '' ||
      this.editEstadoInput === 'selecione' ||
      this.editCidadeInput === 'selecione' ||
      this.editBairroInput === ''
    ) {
      this.toastService.showErrorToast('Preencha todos os campos');
      return;
    }
    this.addResidencia = false;
    let objResidencia = {
      ID: {
        Numero: 0,
      },
      Destino: {
        Id: {
          Numero: 1.0,
        },
        Descricao: this.editDestinoInput,
      },
      Pais: {
        Nome: this.editPaisInput,
        Sigla: this.editPaisInput,
      },
      CEP: this.editCepInput,
      Logradouro: this.editLogradouroInput,
      Estado: {
        Nome: null,
        UF: this.editEstadoInput,
        Pais: null,
      },
      Cidade: {
        Nome: this.editCidadeInput,
        Estado: null,
      },
      Bairro: this.editBairroInput,
      ClienteId: {
        Numero:
          this.consultResponse?.IDT.ID.Numero === undefined
            ? 0
            : this.consultResponse.IDT.ID.Numero,
      },
    };

    this.residArr.push(objResidencia);
    this.consultResponse?.Residencias.push(objResidencia);

    this.editDestinoInput = '';
    this.editPaisInput = 'selecione';
    this.editCepInput = '';
    this.editLogradouroInput = '';
    this.editEstadoInput = 'selecione';
    this.editCidadeInput = 'selecione';
    this.editBairroInput = '';
  }

  cancelAddResidencia() {
    this.addResidencia = false;

    this.editDestinoInput = '';
    this.editPaisInput = '';
    this.editCepInput = '';
    this.editLogradouroInput = '';
    this.editEstadoInput = '';
    this.editCidadeInput = '';
    this.editBairroInput = '';
  }

  confirmEditResidencia(index: number) {
    this.toggleEditResidencia(index);
    if (
      this.editDestinoInput === '' ||
      this.editPaisInput === 'selecione' ||
      this.editCepInput === '' ||
      this.editLogradouroInput === '' ||
      this.editEstadoInput === 'selecione' ||
      this.editCidadeInput === 'selecione' ||
      this.editBairroInput === ''
    ) {
      this.toastService.showErrorToast('Preencha todos os campos');
      return;
    }

    if (this.isEditingCustomer) {
      this.consultResponse!.Residencias[index].Destino.Descricao =
        this.editDestinoInput;
      this.consultResponse!.Residencias[index].Pais.Sigla = this.editPaisInput;
      this.consultResponse!.Residencias[index].CEP = this.editCepInput;
      this.consultResponse!.Residencias[index].Logradouro =
        this.editLogradouroInput;
      this.consultResponse!.Residencias[index].Estado.UF = this.editEstadoInput;
      this.consultResponse!.Residencias[index].Cidade.Nome =
        this.editCidadeInput;
      this.consultResponse!.Residencias[index].Bairro = this.editBairroInput;
    } else {
      this.residArr[index].Destino.Descricao = this.editDestinoInput;
      this.residArr[index].Pais.Sigla = this.editPaisInput;
      this.residArr[index].CEP = this.editCepInput;
      this.residArr[index].Logradouro = this.editLogradouroInput;
      this.residArr[index].Estado.UF = this.editEstadoInput;
      this.residArr[index].Cidade.Nome = this.editCidadeInput;
      this.residArr[index].Bairro = this.editBairroInput;
    }

    this.editDestinoInput = '';
    this.editPaisInput = '';
    this.editCepInput = '';
    this.editLogradouroInput = '';
    this.editEstadoInput = '';
    this.editCidadeInput = '';
    this.editBairroInput = '';

    this.addResidencia = false;
  }

  removeResidencia(index: number) {
    if (this.isEditingCustomer) {
      this.consultResponse?.Residencias.splice(index, 1);
    } else {
      this.residArr.splice(index, 1);
    }
  }

  editResidencia(index: number) {
    this.toggleEditResidencia(index);
    if (this.isEditingCustomer) {
      this.editDestinoInput =
        this.consultResponse!.Residencias[index].Destino.Descricao;
      this.editPaisInput = this.consultResponse!.Residencias[index].Pais.Sigla;
      this.editCepInput = this.consultResponse!.Residencias[index].CEP;
      this.editLogradouroInput =
        this.consultResponse!.Residencias[index].Logradouro;
      this.editEstadoInput = this.consultResponse!.Residencias[index].Estado.UF;
      this.editCidadeInput =
        this.consultResponse!.Residencias[index].Cidade.Nome;
      this.editBairroInput = this.consultResponse!.Residencias[index].Bairro;
    } else {
      this.editDestinoInput = this.residArr[index].Destino.Descricao;
      this.editPaisInput = this.residArr[index].Pais.Sigla;
      this.editCepInput = this.residArr[index].CEP;
      this.editLogradouroInput = this.residArr[index].Logradouro;
      this.editEstadoInput = this.residArr[index].Estado.UF;
      this.editCidadeInput = this.residArr[index].Cidade.Nome;
      this.editBairroInput = this.residArr[index].Bairro;
    }
  }

  editContactInfo(index: number) {
    this.addInfo = false;
    this.toggleEditContact(index);
    if (this.isEditingCustomer) {
      this.editInfoInput = this.consultResponse!.Contatos[index].valor;
    } else {
      this.editInfoInput = this.contatoArr[index].valor;
    }
    this.emailControl.setValue(this.editInfoInput);
  }

    editPhoneContactInfo(index: number) {
    this.addPhoneInfo = false;
    this.toggleEditPhoneContact(index);
    if (this.isEditingCustomer) {
      this.editPhoneInfoInput = this.phoneResponse!.Contatos[index].valor;
    } else {
      this.editPhoneInfoInput = this.phoneArr[index].valor;
    }
    this.phoneControl.setValue(this.editPhoneInfoInput);
  }

  confirmEditContactInfo(index: number) {
    if (this.emailControl.invalid) {
      this.toastService.showErrorToast('Email inválido');
      return;
    }

    this.toggleEditContact(index);
    if (this.isEditingCustomer) {
      this.consultResponse!.Contatos[index].valor = this.editInfoInput;
    } else {
      this.contatoArr[index].valor = this.editInfoInput;
    }
  }

  confirmEditPhoneContactInfo(index: number) {
    if (this.phoneControl.invalid) {
      this.toastService.showErrorToast('Telefone inválido');
      return;
    }

    this.toggleEditPhoneContact(index);
    if (this.isEditingCustomer) {
      this.phoneResponse!.Contatos[index].valor = this.editPhoneInfoInput;
    } else {
      this.phoneArr[index].valor = this.editPhoneInfoInput;
    }
  }
    

  addContactInfo() {
    this.addInfo = true;
    this.showEditContact = -1;
    this.emailControl.setValue('');
  }

  addPhoneContacInfo() {
    this.addPhoneInfo = true;
    this.showEditPhoneContact = -1;
    this.phoneControl.setValue('');
  }

  confirmAddContactInfo() {
  const email = this.addInfoInput.trim();

  if (email.length <= 2) {
    this.toastService.showErrorToast('Digite mais de 3 caracteres');
    return;
  }

  if (this.emailControl.invalid) {
    this.toastService.showErrorToast('Email inválido');
    return;
  }

  // Verifica se o e-mail já foi adicionado anteriormente
  if (this.contatoArr.some(c => c.valor === email)) {
    this.toastService.showErrorToast('E-mail já adicionado');
    return;
  }

  this.addInfo = false;

  const objContact = {
    ID: { Numero: 0 },
    valor: email,
  };

  this.contatoArr.push(objContact);
  // this.consultResponse?.Contatos.push(objContact);
  this.addInfoInput = '';
}

  removeInfoContact(index: number) {
    if (this.isEditingCustomer) {
      this.consultResponse?.Contatos.splice(index, 1);
    } else {
      this.contatoArr.splice(index, 1);
    }
  }

  confirmAddPhoneContactInfo() {
  const phone = this.addPhoneInfoInput.trim();

  if (phone.length <= 2) {
    this.toastService.showErrorToast('Digite mais de 3 caracteres');
    return;
  }

  if (this.phoneControl.invalid) {
    this.toastService.showErrorToast('Telefone inválido');
    return;
  }

  // Verifica se o telefone já foi adicionado anteriormente
  if (this.phoneArr.some(c => c.valor === phone)) {
    this.toastService.showErrorToast('Telefone já adicionado');
    return;
  }

  this.addPhoneInfo = false;

  const objContact = {
    ID: { Numero: 0 },
    valor: phone,
  };

  this.phoneArr.push(objContact);
   //this.phoneResponse?.Contatos.push(objContact);
  this.addPhoneInfoInput = '';
}

   removeInfoPhoneContact(index: number) {
    if (this.isEditingCustomer) {
      this.phoneResponse?.Contatos.splice(index, 1);
    } else {
      this.phoneArr.splice(index, 1);
    }
  }

  addSubAccount() {
    if (
      this.basicDataForm.get('EUASubContas')?.value === '' ||
      this.basicDataForm.get('EUASubContas')?.value === undefined
    ) {
      this.basicDataForm.controls['EUASubContas'].markAsTouched();
      this.toastService.showWarningToast('Digite algum texto.');
      return;
    }
    let objEuaSubAcc = {
      valor: this.basicDataForm.get('EUASubContas')?.value,
    };
    this.basicDataForm.patchValue({
      EUASubContas: '',
    });
    this.euaSubAccArr.push(objEuaSubAcc);
    this.consultResponse?.EUASubContas.push(objEuaSubAcc);
    this.basicDataForm.get('EUASubContas')?.markAsUntouched();
  }

  removeSubAccount(index: number) {
    this.consultResponse?.EUASubContas.splice(index, 1);
    this.euaSubAccArr.splice(index, 1);
  }

  getUfs() {
    const country: string = this.complementCpf.get('country')?.value;
    if (country !== undefined) {
      this.registerService.getUfs(country).subscribe({
        next: (response) => {
          this.ufResponse = response;
          if (country !== 'BRA') {
            this.complementCpf.patchValue({
              birthUf: 'EX',
            });


            this.complementCpf.get('birthPlace')?.disable();
          } else {
            if (this.complementCpf.get("nacionalidade")?.value == "Brasileiro Nato") {
              this.complementCpf.get('birthPlace')?.enable();
            }

            this.complementCpf.patchValue({
              birthUf: 'selecione',
              birthPlace: 'selecione',
            });
          }
        },
        error: (err) => {
          this.toastService.showErrorToast(
            err.error.ExceptionMessage ?? err.message
          );
        },
      });
    }
  }

  getUfsAddResid() {
    if (this.editPaisInput !== undefined) {
      this.registerService.getUfs(this.editPaisInput).subscribe({
        next: (response) => {
          this.ufAddResidResponse = response;
          if (this.editPaisInput !== 'BRA') {
            this.editEstadoInput = 'EX';
            this.editCidadeInput = 'selecione';
          } else {
            this.editEstadoInput = 'selecione';
          }
          this.editEstadoInput = 'selecione';
        },
        error: (err) => {
          this.toastService.showErrorToast(
            err.error.ExceptionMessage ?? err.message
          );
        },
      });
    }
  }

  getCitiesAddResid() {
    if (this.editEstadoInput !== undefined) {
      this.registerService.getCities(this.editEstadoInput).subscribe({
        next: (response) => {
          this.cityAddResidResponse = response;
        },
        error: (err) => {
          this.toastService.showErrorToast('Não foi possível obter as cidades');
        },
      });
    }
  }

  getCities() {
    const uf: string = this.complementCpf.get('birthUf')?.value;
    if (uf !== undefined) {
      this.registerService.getCities(uf).subscribe({
        next: (response) => {
          this.cityResponse = response;
          this.complementCpf.get('birthPlace')?.enable();
          this.complementCpf.patchValue({
            birthPlace: 'selecione',
          });
        },
        error: (err) => {
          this.toastService.showErrorToast('Não foi possível obter as cidades');
        },
      });
    }
  }

  getMainBroker() {
    if (this.isEditingCustomer) {
      this.consultResponse!.ShareBrokers = [];
    } else {
      this.sharedBrokerArr = [];
    }
    this.registerService
      .getMainBrokerById(this.basicDataForm.get('MainBroker')?.value)
      .subscribe({
        next: (response) => {
          if (this.isEditingCustomer) {
            this.consultResponse!.ShareBrokers = [];
            this.consultResponse!.ShareBrokers = response;
          } else {
            this.sharedBrokerArr = [];
            this.sharedBrokerArr = response;
          }
        },
        error: (err) => {
          this.toastService.showErrorToast(
            err.error.ExceptionMessage ?? err.message
          );
        },
      });
  }

  ngOnInit(): void {
    this.getSelects();

    this.registerService.getAllMainBrokers().subscribe({
      next: (response) => {
        this.mainBrokerResponse = response;
      },
      error: (err) => {
        this.toastService.showErrorToast(
          err.error.ExceptionMessage ?? 'Falha ao obter os dados'
        );
      },
    });

    this.basicDataForm = this.fb.group({
      BloqueadoRegistroBolsa: [false],
      CadastroResumido: [false],
      SINACORCodigo: [''],
      EUAGrupoContaCodigo: [''],
      EUAContaCodigo: [''],

      EUASubContas: [''],

      docType: ['cpf'],
      doc: [''],
      nome: [''],
      telefone: [''],
      EUAResidente: [false],
      Tipo: ['selecione'],
      investidorTipo: ['selecione'],
      MainBroker: [''],
    });

    this.complementCpf = this.fb.group({
      nacionalidade: ['selecione'],
      country: ['selecione'],
      birthUf: ['selecione'],
      birthPlace: ['selecione'],
      pai: [''],
      mae: [''],
      civilStatus: ['selecione'],
      systemMarriage: ['selecione'],
      spouseName: [''],
      spouseCpf: [''],
      spouseBirth: [],
      relatCn: ['selecione'],
      relatCi: ['selecione'],
      gender: ['selecione'],
      education: ['selecione'],
      countryResid: ['selecione'],
      occupation: [''],
      fieldActivity: ['selecione'],
    });

    this.complementCpf.get("nacionalidade")?.valueChanges.subscribe(resp => {
      if (this.complementCpf.get("nacionalidade")?.value == "Brasileiro Nato") {
        this.complementCpf.get("country")?.enable();
        this.complementCpf.get("birthUf")?.enable();
        this.complementCpf.get("birthPlace")?.enable();
      } else {
        this.complementCpf.get("country")?.disable();
        this.complementCpf.get("birthUf")?.disable();
        this.complementCpf.get("birthPlace")?.disable();
      }

      this.complementCpf.get("country")?.updateValueAndValidity({ emitEvent: false });
      this.complementCpf.get("birthUf")?.updateValueAndValidity({ emitEvent: false });
      this.complementCpf.get("birthPlace")?.updateValueAndValidity({ emitEvent: false });
    })

    this.cetipForm = this.fb.group({
      account: [environment.defaultValues.CETIP_ACCOUNT],
      iof: ['iofn'],
      ifr: ['ifrn'],
      active: [false],
    });

    this.emailControl = new FormControl('', {validators: Validators.email});
    this.phoneControl = new FormControl('', [Validators.required, phoneValidator()]);

    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.isEditingCustomer = true;
      this.registerService.consultById(id).subscribe({
        next: (response) => {
          this.consultResponse = response;
          this.phoneResponse = response;

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          this.contatoArr = response.Contatos.filter(c => emailRegex.test(c.valor));
          this.phoneArr = response.Contatos.filter(c => !emailRegex.test(c.valor));

          this.basicDataForm.patchValue({
            BloqueadoRegistroBolsa: response.IDT.BloqueadoRegistroBolsa,
            CadastroResumido: response.IDT.CadastroResumido,
            SINACORCodigo: response.IDT.SINACORCodigo.valor,
            EUAGrupoContaCodigo: response.IDT.EUAGrupoContaCodigo.valor,
            EUAContaCodigo: response.IDT.EUAContaCodigo.valor,
            docType: this.typeDoc(response),
            doc: this.doc(response),
            nome: response.IDT.Nome,
            telefone: response.TelefonePrincipal,
            EUAResidente: !response.EUAResidente,
            Tipo: response.Tipo === '' || response.Tipo === null ? 'selecione' : response.Tipo,
            investidorTipo: response.InvestidorTipo === '' || response.InvestidorTipo === null ? 'selecione' : response.InvestidorTipo,
            MainBroker: response.MainBroker.valor,
          });

          if (this.basicDataForm.get('docType')?.value === 'cpf') {
            this.docTypeLabel = 'CPF';
          } else if (this.basicDataForm.get('docType')?.value === 'cnpj') {
            this.docTypeLabel = 'CNPJ';
          } else if (this.basicDataForm.get('docType')?.value === 'cvm') {
            this.docTypeLabel = 'CVM';
          }

          if (
            response.EstadoCivil.Id.Numero === 1 ||
            response.EstadoCivil.Id.Numero === 2 ||
            response.EstadoCivil.Id.Numero === 3 ||
            response.EstadoCivil.Id.Numero === 4
          ) {
            this.complementCpf.controls['systemMarriage'].disable();
            this.complementCpf.controls['spouseName'].disable();
            this.complementCpf.controls['spouseCpf'].disable();
            this.complementCpf.controls['spouseBirth'].disable();
          } else {
            this.complementCpf.controls['systemMarriage'].enable();
            this.complementCpf.controls['spouseName'].enable();
            this.complementCpf.controls['spouseCpf'].enable();
            this.complementCpf.controls['spouseBirth'].enable();
          }

          if (this.docTypeLabel !== 'CPF') {
            this.complementCpf.disable();
            this.complementCpf.controls['relatCn'].enable();
            this.complementCpf.controls['relatCi'].enable();
            this.complementCpf.controls['fieldActivity'].enable();
          }

          if(response.CPFCompPais?.Nome) this.registerService.getUfs(response.CPFCompPais.Nome).subscribe({
            next: (response) => {
              this.ufResponse = response;
            },
            error: (err) => {
              this.toastService.showErrorToast(
                err.error.ExceptionMessage ?? 'Falha ao obter os dados'
              );
            },
          });

          this.complementCpf.patchValue({
            nacionalidade: response.CPFCompNacionalidade,
            country: response.CPFCompPais.Sigla,
            birthUf: response.CPFCompUFNascimento.UF,
            birthPlace: response.CPFCompLocalNascimento.Nome,
            pai: response.CPFCompPaiResponsavel,
            mae: response.CPFCompMae,
            civilStatus: response.EstadoCivil.Id.Numero,
            systemMarriage: response.RegimeCasamento.Id.Numero,
            spouseName: response.CPFCompNomeConjugue,
            spouseCpf: response.CPFCompCPFConjugue,
            spouseBirth: response.CPFCompDataNascConjugue === '9999-12-31T23:59:59.9999999' ? '' : formatDate(
              response.CPFCompDataNascConjugue,
              'yyyy-MM-dd',
              'en'
            ),
            relatCn: response.cNRelatorioLegaisClassificacao.Codigo.valor,
            relatCi: response.cIRelatorioLegaisClassificacao.Codigo.valor,
            gender: response.Sexo.Id.Numero ?? 'selecione',
            education: response.Escolaridade.Id.Numero ?? 'selecione',
            countryResid: response.CPFCompPaisResidencia.Sigla ?? 'selecione',
            occupation: response.CPFCompCargo,
            fieldActivity: response.CPFCompRamo.Id.Numero ?? 'selecione',
          });

          this.cetipForm.patchValue({
            account: response.CETIP.Codigo.valor,
            iof: response.CETIP.Tributacao.IsentoIOF ? 'iofy' : 'iofn',
            ifr: response.CETIP.Tributacao.IsentoIFR ? 'ifry' : 'ifrn',
            active: !response.Ativo,
          });

          this.registerService
            .getCities(response.CPFCompUFNascimento.UF)
            .subscribe({
              next: (response) => {
                this.cityResponse = response;
              },
              error: (err) => { },
            });
        },
        error: (err) => { },
      });
    }
  }

  saveCustomer(redirect: boolean = true) {
    // Basic Data
    this.consultResponse!.IDT.BloqueadoRegistroBolsa = this.basicDataForm.get(
      'BloqueadoRegistroBolsa'
    )?.value;
    this.consultResponse!.IDT.CadastroResumido =
      this.basicDataForm.get('CadastroResumido')?.value;
    this.consultResponse!.IDT.SINACORCodigo.valor =
      this.basicDataForm.get('SINACORCodigo')?.value;
    this.consultResponse!.IDT.EUAGrupoContaCodigo.valor =
      this.basicDataForm.get('EUAGrupoContaCodigo')?.value;
    this.consultResponse!.IDT.EUAContaCodigo.valor =
      this.basicDataForm.get('EUAContaCodigo')?.value;
    if (this.consultResponse!.CPF.numero !== '') {
      this.consultResponse!.CPF.numero = this.basicDataForm.get('doc')?.value;
    }

    if (this.consultResponse!.CNPJ.numero !== '') {
      this.consultResponse!.CNPJ.numero = this.basicDataForm.get('doc')?.value;
    }

    if (this.consultResponse!.CVMNumero.valor !== '') {
      this.consultResponse!.CVMNumero.valor =
        this.basicDataForm.get('doc')?.value;
    }
    this.consultResponse!.IDT.Nome = this.basicDataForm.get('nome')?.value;
    this.consultResponse!.TelefonePrincipal =
      this.basicDataForm.get('telefone')?.value;
    this.consultResponse!.EUAResidente =
      !this.basicDataForm.get('EUAResidente')?.value;
    this.consultResponse!.Tipo = this.basicDataForm.get('Tipo')?.value;
    this.consultResponse!.InvestidorTipo =
      this.basicDataForm.get('investidorTipo')?.value;
    this.consultResponse!.MainBroker.valor =
      this.basicDataForm.get('MainBroker')?.value;

    // Complement CPF
    this.consultResponse!.CPFCompNacionalidade =
      this.complementCpf.get('nacionalidade')?.value;
    this.consultResponse!.CPFCompPais.Sigla =
      this.complementCpf.get('country')?.value;
    this.consultResponse!.CPFCompUFNascimento.UF =
      this.complementCpf.get('birthUf')?.value;
    this.consultResponse!.CPFCompLocalNascimento.Nome =
      this.complementCpf.get('birthPlace')?.value;
    this.consultResponse!.CPFCompPaiResponsavel =
      this.complementCpf.get('pai')?.value;
    this.consultResponse!.CPFCompMae = this.complementCpf.get('mae')?.value;
    this.consultResponse!.EstadoCivil.Id.Numero =
      this.complementCpf.get('civilStatus')?.value;
    this.consultResponse!.RegimeCasamento.Id.Numero =
      this.complementCpf.get('systemMarriage')?.value;
    this.consultResponse!.CPFCompNomeConjugue =
      this.complementCpf.get('spouseName')?.value;
    this.consultResponse!.CPFCompCPFConjugue =
      this.complementCpf.get('spouseCpf')?.value;
    this.consultResponse!.CPFCompDataNascConjugue =
      this.complementCpf.get('spouseBirth')?.value;
    this.consultResponse!.cNRelatorioLegaisClassificacao.Codigo.valor =
      this.complementCpf.get('relatCn')?.value;
    this.consultResponse!.cIRelatorioLegaisClassificacao.Codigo.valor =
      this.complementCpf.get('relatCi')?.value;
    this.consultResponse!.Sexo.Id.Numero =
      this.complementCpf.get('gender')?.value;
    this.consultResponse!.Escolaridade.Id.Numero =
      this.complementCpf.get('education')?.value;
    this.consultResponse!.CPFCompPaisResidencia.Sigla =
      this.complementCpf.get('countryResid')?.value;
    this.consultResponse!.CPFCompCargo =
      this.complementCpf.get('occupation')?.value;
    this.consultResponse!.CPFCompRamo.Id.Numero =
      this.complementCpf.get('fieldActivity')?.value;

    // CETIP
    this.consultResponse!.CETIP.Codigo.valor =
      this.cetipForm.get('account')?.value;
    this.consultResponse!.CETIP.Tributacao.IsentoIOF =
      this.cetipForm.get('iof')?.value === 'iofy';
    this.consultResponse!.CETIP.Tributacao.IsentoIFR =
      this.cetipForm.get('ifr')?.value === 'ifry';
    this.consultResponse!.Ativo = !this.cetipForm.get('active')?.value;

    this.registerService.postSaveCustomer(this.consultResponse!).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast(
          'Dados salvos com sucesso. Redirecionando para tela de de cadastro de clientes.'
        );


        if (redirect) {
          setTimeout(() => {
            this.router.navigate(['/register/customer']);
          }, 1000);
        }
      },
      error: (err) => {
        this.toastService.showErrorToast(err.error.ExceptionMessage);
      },
    });
  }

  consultSinacor() {
    this.residArr = [];
    this.contatoArr = [];
    this.euaSubAccArr = [];
    this.sharedBrokerArr = [];
    this.registerService
      .consultSinacor(this.basicDataForm.get('SINACORCodigo')?.value)
      .subscribe({
        next: (response) => {
          this.basicDataForm.reset();
          this.complementCpf.reset();
          this.cetipForm.reset();
          this.toastService.showSuccessToast('Encontrado no SINACOR');
          this.contatoArr = response.Contatos;
          this.euaSubAccArr = response.EUASubContas;
          this.residArr = response.Residencias;
          this.contatoArrLength = this.contatoArr ? this.contatoArr.length : 0;
          this.residArrLength = this.residArr ? this.residArr.length : 0;

          this.basicDataForm.patchValue({
            BloqueadoRegistroBolsa: response.IDT?.BloqueadoRegistroBolsa,
            CadastroResumido: response.IDT?.CadastroResumido,
            SINACORCodigo: response.IDT?.SINACORCodigo?.valor,
            EUAGrupoContaCodigo: response.IDT?.EUAGrupoContaCodigo?.valor,
            EUAContaCodigo: response.IDT?.EUAContaCodigo?.valor,
            doc: this.doc(response),
            docType: this.typeDoc(response),
            nome: response.IDT?.Nome,
            telefone: response.TelefonePrincipal,
            EUAResidente: !response.EUAResidente,
            Tipo: response.Tipo,
            investidorTipo: response.InvestidorTipo,
            MainBroker: response.MainBroker?.valor,
          });
          this.changeDocLabel();
          this.complementCpf.patchValue({
            nacionalidade: response.CPFCompNacionalidade,
            country: response.CPFCompPais !== null ? response.CPFCompPais.Sigla : 'BRA',
            birthUf: response.CPFCompUFNascimento.UF,
            birthPlace: response.CPFCompLocalNascimento?.Nome,
            pai: response.CPFCompPaiResponsavel,
            mae: response.CPFCompMae,
            civilStatus: response.EstadoCivil?.Id?.Numero,
            systemMarriage: response.RegimeCasamento?.Id?.Numero,
            spouseName: response.CPFCompNomeConjugue,
            spouseCpf: response.CPFCompCPFConjugue,
            spouseBirth: response.CPFCompDataNascConjugue === '9999-12-31T23:59:59.9999999' ? '' : formatDate(
              response.CPFCompDataNascConjugue,
              'yyyy-MM-dd',
              'en'
            ),
            relatCn: response.cNRelatorioLegaisClassificacao?.Codigo?.valor,
            relatCi: response.cIRelatorioLegaisClassificacao?.Codigo?.valor,
            gender: response.Sexo?.Id?.Numero,
            education: response.Escolaridade?.Id?.Numero,
            countryResid: response.CPFCompPaisResidencia?.Sigla,
            occupation: response.CPFCompCargo,
            fieldActivity: response.CPFCompRamo !== null ? response.CPFCompRamo.Id?.Numero : 'selecione',
          });
          this.cetipForm.patchValue({
            account: response.CETIP.Codigo.valor,
            iof: response.CETIP.Tributacao.IsentoIOF ? 'iofy' : 'iofn',
            ifr: response.CETIP.Tributacao.IsentoIFR ? 'ifry' : 'ifrn',
            active: !response.Ativo,
          });

          if (response.CPFCompUFNascimento?.UF) {
            this.registerService
            .getCities(response.CPFCompUFNascimento.UF)
            .subscribe({
              next: (response) => {
                this.cityResponse = response;
              },
              error: (err) => {
                this.toastService.showErrorToast(err.error.ExceptionMessage ?? 'Não foi possível carregar os dados');
              },
            });
          }

          if (response.CPFCompPais?.Nome) {
            this.registerService.getUfs(response.CPFCompPais.Nome).subscribe({
              next: (response) => {
                this.ufResponse = response;
              },
              error: (err) => {
                this.toastService.showErrorToast(err.error.ExceptionMessage ?? 'Não foi possível carregar os dados');
              },
            });
          }

          if (
            response.EstadoCivil.Id.Numero === 1 ||
            response.EstadoCivil.Id.Numero === 2 ||
            response.EstadoCivil.Id.Numero === 3 ||
            response.EstadoCivil.Id.Numero === 4
          ) {
            this.complementCpf.controls['systemMarriage'].disable();
            this.complementCpf.controls['spouseName'].disable();
            this.complementCpf.controls['spouseCpf'].disable();
            this.complementCpf.controls['spouseBirth'].disable();
          } else {
            this.complementCpf.controls['systemMarriage'].enable();
            this.complementCpf.controls['spouseName'].enable();
            this.complementCpf.controls['spouseCpf'].enable();
            this.complementCpf.controls['spouseBirth'].enable();
          }
          this.getMainBroker();
          Object.keys(this.basicDataForm.controls).forEach(key => {
            if (this.basicDataForm.get(key)?.value) {
              this.basicDataForm.get(key)?.disable();
            }
          });
          Object.keys(this.complementCpf.controls).forEach(key => {
            if (this.complementCpf.get(key)?.value) {
              this.complementCpf.get(key)?.disable();
            }
          });
          Object.keys(this.cetipForm.controls).forEach(key => {
            if (this.cetipForm.get(key)?.value) {
              this.cetipForm.get(key)?.disable();
            }
          });
          if (this.typeDoc(response) === 'cnpj') {
            this.complementCpf.disable();
          }
        },
        error: (err) => {
          this.basicDataForm.reset();
          this.complementCpf.reset();
          this.cetipForm.reset();
          // this.basicDataForm.controls['SINACORCodigo'].setErrors({
          //   'not-found': true,
          // });
          // this.basicDataForm.patchValue({
          //   BloqueadoRegistroBolsa: false,
          //   CadastroResumido: false,
          //   SINACORCodigo: '',
          //   EUAGrupoContaCodigo: '',
          //   EUAContaCodigo: '',
          //   doc: '',
          //   nome: '',
          //   telefone: '',
          //   EUAResidente: false,
          //   Tipo: 'selecione',
          //   investidorTipo: 'selecione',
          //   MainBroker: '',
          // });
          // this.complementCpf.patchValue({
          //   nacionalidade: '',
          //   country: 'selecione',
          //   birthUf: '',
          //   birthPlace: 'selecione',
          //   pai: '',
          //   mae: '',
          //   civilStatus: 'selecione',
          //   systemMarriage: 'selecione',
          //   spouseName: '',
          //   spouseCpf: '',
          //   spouseBirth: '',
          //   relatCn: 'selecione',
          //   relatCi: 'selecione',
          //   gender: 'selecione',
          //   education: 'selecione',
          //   countryResid: 'selecione',
          //   occupation: '',
          //   fieldActivity: 'selecione',
          // });
          // this.cetipForm.patchValue({
          //   account: '',
          //   iof: '',
          //   ifr: '',
          //   active: false,
          // });
          this.toastService.showErrorToast(
            err.error.ExceptionMessage ?? err.error.mensagem
          );
        },
      });
  }

  getSelects() {
    this.registerService.getInvestorTypes().subscribe({
      next: (response) => {
        this.investorTypesResponse = response;
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.registerService.getCustomerTypes().subscribe({
      next: (response) => {
        this.customerTypesResponse = response;
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.registerService.getCountries().subscribe({
      next: (response) => {
        this.countryResponse = response;
      },
    });

    this.registerService.getCivilStatus().subscribe({
      next: (response) => {
        this.civilStatusResponse = response;
      },
    });

    this.registerService.getSystemMarriage().subscribe({
      next: (response) => {
        this.systemMarriageResponse = response;
      },
    });

    this.registerService.getRelatCn().subscribe({
      next: (response) => {
        this.relatCnResponse = response;
      },
    });

    this.registerService.getRelatCi().subscribe({
      next: (response) => {
        this.relatCiResponse = response;
      },
    });

    this.registerService.getGender().subscribe({
      next: (response) => {
        this.genderResponse = response;
      },
    });

    this.registerService.getEducation().subscribe({
      next: (response) => {
        this.educationResponse = response;
      },
    });

    this.registerService.getFieldActivity().subscribe({
      next: (response) => {
        this.fieldActivityResponse = response;
      },
    });

    this.registerService.getDestination().subscribe({
      next: (response) => {
        this.destinationResponse = response;
      },
    });

    this.registerService.getNacionality().subscribe({
      next: (response) => {
        this.nacionalityResponse = response;
      },
    });
  }

  resetForms() {
    this.basicDataForm.reset();
    this.complementCpf.reset();
  }

  doc(data: DetailCustomer) {
    if (data.CPF.numero !== '') {
      return data.CPF.numero;
    }

    if (data.CNPJ.numero !== '') {
      return data.CNPJ.numero;
    }

    if (data.CVMNumero.valor !== '') {
      return data.CVMNumero.valor;
    }

    return null;
  }

  typeDoc(data: DetailCustomer) {
    if (data.CPF.numero !== '') {
      return 'cpf';
    }

    if (data.CNPJ.numero !== '') {
      return 'cnpj';
    }

    if (data.CVMNumero.valor !== '') {
      return 'cvm';
    }

    return 'cpf';
  }

  public deleteBrokerCommodity(brokerCommodityToDelete: BrokerCommodity) {
    if (!this.consultResponse) return;
    if (!this.consultResponse?.BrokerCommoditys) this.consultResponse!.BrokerCommoditys = [];
    this.consultResponse.BrokerCommoditys = this.consultResponse.BrokerCommoditys.filter(
      (brokerCommdity) => brokerCommdity != brokerCommodityToDelete
    );
    this.saveCustomer(false);
  }

  public openBrokerCommodityDialog() {
    this.brokerCommodityDialogOpened = true;
  }

  public onSaveAddBrokerCommodity(brokerCommodity: BrokerCommodity) {
    if (this.isEditingCustomer) {
      if (!this.consultResponse) {
        return;
      }

      if (!this.consultResponse?.BrokerCommoditys) {
        this.consultResponse!.BrokerCommoditys = [];
      }

      this.consultResponse.BrokerCommoditys.push(brokerCommodity);
      this.saveCustomer(false);
    } else {
      if (!this.consultResponse) {
        this.consultResponse = {} as DetailCustomer;
      }

      if (!this.consultResponse?.BrokerCommoditys) {
        this.consultResponse!.BrokerCommoditys = [];
      }

      this.consultResponse.BrokerCommoditys.push(brokerCommodity);
    }
  }

  public getBrokerList(): any[] {
    return this.isEditingCustomer ? (this.consultResponse?.ShareBrokers || []) : this.sharedBrokerArr;
  }

  public getBrokerMainBroker(): Broker | undefined {
    return this.basicDataForm.get('MainBroker')?.value;
  }

  public hasProduct(): boolean {
    return (this.consultResponse?.BrokerCommoditys?.length || 0) > 0;
  }

  public isCadastroResumido(): boolean {
    return this.basicDataForm.get('CadastroResumido')?.value;
  }

}
