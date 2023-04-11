import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from 'src/app/app.material';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { ProviderModel } from 'src/app/models/provider.model';
import { UtilitariosService, NavigationService } from 'src/app/services';
import { ProviderService } from 'src/app/services/admin/provider.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent extends OnDestroySubscriptions implements OnInit {
  form: FormGroup;
  id: number = null;
  title: string = "Novo Fornecedor";
  loading: boolean = false;

  constructor(
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _providerService: ProviderService,
    private _navigationService: NavigationService,
  ) {
    super();

    this.form = this._formbuilder.group(new ProviderModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["bank"].clearValidators();
    this.form.controls["agency"].clearValidators();
    this.form.controls["acount"].clearValidators();
    this.form.controls["pix"].clearValidators();
    this.form.controls["document"].clearValidators();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id != null)
          this.loadProvider();
      })
    );
  }

  loadProvider() {
    this.loading = true;
    this._providerService.find(this.id)
      .toPromise()
      .then((resp: ProviderModel) => {
        this.form.patchValue(resp);
        this.title = "Editar Fornecedor";
        this.loading = false;
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

    let model = <ProviderModel>this.form.value;
    this._providerService.save(model)
      .toPromise()
      .then((resp: ProviderModel) => {
        if (resp != null) {
          this._snackBar.open(model.id > 0 ? `Fornecedor atualizado com sucesso!` : `Fornecedor salvo com sucesso!`);
          this._navigationService.providerList();
        }
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  cancel() {
    this._navigationService.providerList();
  }

}
