import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from 'src/app/app.material';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { CustomerLaunchModel } from 'src/app/models/customer-launch.model';
import { UtilitariosService } from 'src/app/services';
import { CustomerLauncService } from 'src/app/services/admin/customer-launch.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-customer-launch',
  templateUrl: './customer-launch.component.html',
  styleUrls: ['./customer-launch.component.scss']
})
export class CustomerLaunchComponent extends OnDestroySubscriptions implements OnInit {
  form: FormGroup;
  id: number = null;
  title: string = "Dados de Lançamento";

  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CustomerLaunchModel,
    private _dialogRef: MatDialogRef<CustomerLaunchComponent>,
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _service: CustomerLauncService,
    private _utilitariosService: UtilitariosService,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
  ) {
    super();

    this.form = this._formbuilder.group(new CustomerLaunchModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["testimonial"].clearValidators();
    this.form.controls["invoice"].clearValidators();
  }

  ngOnInit(): void {
    if (this.data.id != null)
      this.load();

    if (this.data.customerId != null)
      this.form.controls.customerId.setValue(this.data.customerId);
  }

  load() {
    this._service.findLaunchByCustomerById(this.data.customerId, this.data.id)
      .toPromise()
      .then((ret) => {
        this.form.patchValue(ret);
        this.title = "Editar Lançamento";
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
      this._utilService.FormValidate(this.form);
      return;
    }
    this.loading = true;
    this._service.save(this.form.value)
      .toPromise()
      .then((resp: CustomerLaunchModel) => {
        if (resp != null) {
          this.loading = false;
          this._snackBar.open(this.form.controls.id.value > 0 ? `Informações atualizada com sucesso!` : `Informações salvas com sucesso!`);
          this._dialogRef.close(resp);
        }
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  cancel() {
    this._dialogRef.close();
  }

}
