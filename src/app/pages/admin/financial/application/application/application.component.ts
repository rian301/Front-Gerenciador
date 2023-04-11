import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AppStatusEnum } from 'src/app/enums/sent-status.enum';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { ApplicationModel } from 'src/app/models/application.model';
import { NavigationService, UtilitariosService } from 'src/app/services';
import { ApplicationService } from 'src/app/services/admin/application.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent extends OnDestroySubscriptions implements OnInit {
  id: number = null;
  form: FormGroup;
  statusEnum: typeof AppStatusEnum = AppStatusEnum;
  title: string = "Novo Envio";
  loading: boolean = false;
  statusCode: number;
  startDate: Date = new Date();
  statusDocFilter: number = 1;
  filterText: string = null;
  search: string = null;
  cepDetected: boolean = true;

  constructor(
    private _formbuilder: FormBuilder,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _appService: ApplicationService,
    private route: ActivatedRoute,
    private _navigationService: NavigationService,
  ) {
    super();

    this.form = this._formbuilder.group({
      searchCustomer: [],
      id: [null],
      name: [null, [Validators.required]],
      datePurchase: [null],
      requester: [null, [Validators.required]],
      value: [null],
      signature: [null],
      description: [null],
      responsible: [null, [Validators.required]],
      dateCanceled: [null],
      motiveCancel: [null],
      status: [null],
      dateCanceledExport: [null],
      datePurchaseExport: [null],
      statusDescription: [null],
      note: [null],
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id != null)
          this.load();
      })
    );
  }


  load() {
    this._appService.find(this.id)
      .toPromise()
      .then((ret) => {
        this.form.patchValue(ret);
        this.validStatus(ret.status);
        this.title = "Editar Aplicativo";
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  save() {
    if (!this.form.valid) {
      console.log(this.form);
      this._utilService.FormValidate(this.form);
      return;
    }

    this.loading = true;
    let model = <ApplicationModel>this.form.value;
    this._appService.save(model)
      .toPromise()
      .then((resp: ApplicationModel) => {
        if (resp != null) {
          this.loading = false;
          this._snackBar.open(model.id > 0 ? `Aplicativo atualizado com sucesso!` : `Aplicativo salvo com sucesso!`);
          this.id = resp.id;
          this._navigationService.appList();
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
    this._navigationService.appList();
  }
}
