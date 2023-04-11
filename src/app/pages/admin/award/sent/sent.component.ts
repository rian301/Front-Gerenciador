import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SentStatusEnum } from 'src/app/enums/app-status.enum';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { CustomerListModel, CustomerModel } from 'src/app/models';
import { AwardModel } from 'src/app/models/award.model';
import { MentoredModel } from 'src/app/models/mentored.model';
import { SentModel } from 'src/app/models/sent.model';
import { CustomerService, NavigationService, UtilitariosService } from 'src/app/services';
import { AwardService } from 'src/app/services/admin/award.service';
import { MentoredService } from 'src/app/services/admin/mentored.service';
import { SentService } from 'src/app/services/admin/sent.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss']
})
export class SentComponent extends OnDestroySubscriptions implements OnInit {
  id: number = null;
  form: FormGroup;
  statusEnum: typeof SentStatusEnum = SentStatusEnum;
  title: string = "Novo Envio";
  loading: boolean = false;
  statusCode: number;
  startDate: Date = new Date();
  statusDocFilter: number = 1;
  awards: AwardModel[] = [];
  customers: CustomerListModel[] = [];
  mentoreds: MentoredModel[] = [];
  filterText: string = null;
  search: string = null;
  searchM: string = null;
  cepDetected: boolean = true;

  constructor(
    private _formbuilder: FormBuilder,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _sentService: SentService,
    private route: ActivatedRoute,
    private _navigationService: NavigationService,
    private _awardService: AwardService,
    private _customerService: CustomerService,
    private _mentoredService: MentoredService
  ) {
    super();

    this.form = this._formbuilder.group({
      searchCustomer: [ null ],
      searchMentored: [ null ],
      id: [''],
      name: [''],
      awardId: [null, [Validators.required]],
      customerId: [],
      mentoredId: [],
      dateRequest: [''],
      dateSend: [''],
      dateReceiving: [''],
      requester: [''],
      campaign: [''],
      statusDescription: [''],
      email: [''],
      code: [''],
      status: [''],
      phone: [''],
      zipCode: [''],
      street: [''],
      number: [''],
      complement: [''],
      district: [''],
      city: [''],
      state: [''],
      note: ['']
    });
  }

  searchCustomer(event) {
    // Nome
    setTimeout(() => {
      this.filterText = event;
      if (this.filterText.length >= 3 || this.filterText.length == 0) {
        this.loadCustomers();
      }
    }, 400);
  }

  searchMentored(event) {
    // Nome
    setTimeout(() => {
      this.filterText = event;
      if (this.filterText.length >= 3 || this.filterText.length == 0) {
        this.loadCustomers();
      }
    }, 400);
  }

  ngOnInit(): void {
    this.loadAwardList();
    this.loadCustomers();
    this.loadMentored();
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id != null) {
          this.load();
        }
      })
    );
  }

  loadCustomers() {
    this.loading = true;
    this._customerService
      .get(
        0,
        25,
        this.filterText,
        null
      )
      .toPromise()
      .then((ret) => {
        this.loading = false;
        this.customers = ret.content;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  loadMentored() {
    this.loading = true;
    this._mentoredService
      .get()
      .toPromise()
      .then((ret) => {
        this.loading = false;
        this.mentoreds = ret;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  loadAwardList() {
    this.loading = true;
    this._awardService
      .get()
      .toPromise()
      .then((resp: AwardModel[]) => {
        this.awards = resp;
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadCustomerById(id: number) {
    this.loading = true;
    this._customerService
      .findList(id)
      .toPromise()
      .then((resp: CustomerListModel) => {
        if (resp) {
          this.customers.push(resp);
          this.filterText = resp.name;
          this.loadCustomers();
        }
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  load() {
    this._sentService.find(this.id)
      .toPromise()
      .then((ret) => {
        if (ret.customerId)
          this.loadCustomerById(ret.customerId);

        this.form.patchValue(ret);
        this.validStatus(ret.status);
        this.form.controls.searchCustomer.setValue(ret?.customerId);
        this.form.controls.searchMentored.setValue(ret?.mentoredId);
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  changeCustomer(customer: CustomerModel) {
    this.form.controls.zipCode.setValue(customer.zipCode);
    this.form.controls.street.setValue(customer.street);
    this.form.controls.number.setValue(customer.number);
    this.form.controls.complement.setValue(customer.complement);
    this.form.controls.district.setValue(customer.district);
    this.form.controls.city.setValue(customer.city);
    this.form.controls.state.setValue(customer.state);
  }

  save() {
    if (!this.form.valid) {
      console.log(this.form);
      this._utilService.FormValidate(this.form);
      return;
    }

    this.form.controls["customerId"].setValue(this.search);
    this.form.controls["mentoredId"].setValue(this.searchM);

    this.loading = true;
    let model = <SentModel>this.form.value;
    this._sentService.save(model)
      .toPromise()
      .then((resp: SentModel) => {
        if (resp != null) {
          this.loading = false;
          this._snackBar.open(model.id > 0 ? `Envio atualizado com sucesso!` : `Envio salvo com sucesso!`);
          this.id = resp.id;
          this._navigationService.sentList();
        }
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  validStatus(statusCode: number) {
    this.statusCode = statusCode;
  }

  cancel() {
    this._navigationService.sentList();
  }

  searchCep(event) {
    let cep = event.target.value;
    if (cep.length === 9) {
      this._utilitariosService
        .BuscarCep(event.target.value)
        .toPromise()
        .then((ret) => {
          this.form.patchValue({
            city: ret.localidade,
            state: ret.uf,
            street: ret.logradouro,
            district: ret.bairro
          });
        })
        .catch((error) => {
          this.cepDetected = false;
          console.error(error);
        });
    }
  }

  IsNullOrUndefined(value: any) {
    return value == null || value == undefined;
  }
}
