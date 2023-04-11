import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from 'src/app/app.material';
import { ModalConfirmationComponent } from 'src/app/components/modal-confirmation/modal-confirmation.component';
import { PaymentTypeStatusEnum } from 'src/app/enums/payment-type.enum';
import { StatusTypeEnum } from 'src/app/enums/status.enum';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { PaymentMethodModel } from 'src/app/models/payment-method.model';
import { UtilitariosService, NavigationService } from 'src/app/services';
import { PaymentMethodService } from 'src/app/services/admin/payment-method.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent extends OnDestroySubscriptions implements OnInit {
  form: FormGroup;
  statusEnum: typeof StatusTypeEnum = StatusTypeEnum;
  title: string = "Nova Forma de Pagamento";
  loading: boolean = false;
  statusCode: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PaymentMethodModel,
    private _dialogRef: MatDialogRef<PaymentMethodComponent>,
    private _formbuilder: FormBuilder,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _dialog: MatDialog,
    private _paymentMethodService: PaymentMethodService
  ) {
    super();

    this.form = this._formbuilder.group(new PaymentMethodModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["status"].clearValidators();
    this.form.controls["customerId"].clearValidators();
    this.form.controls["statusDescription"].clearValidators();
    this.form.controls["statusDescriptionCustom"].clearValidators();
  }

  ngOnInit(): void {
      this.load();

    if (this.data.customerId != null){}
    this.form.controls.customerId.setValue(this.data.customerId);
  }

  load() {
    this._paymentMethodService.find(this.data.id)
      .toPromise()
      .then((ret) => {
        this.form.patchValue(ret);
        this.validStatus(ret.status);
        this.title = "Editar Forma de Pagamento";
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
    let model = <PaymentMethodModel>this.form.value;
    this._paymentMethodService.save(model)
      .toPromise()
      .then((resp: PaymentMethodModel) => {
        if (resp != null) {
          this._dialogRef.close();
          this.loading = false;
          this._snackBar.open(model.id > 0 ? `Produto atualizado com sucesso!` : `Produto salvo com sucesso!`);
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

  modalConfirmationDeactivate() {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, { minWidth: '50%', data: { title: 'Deseja confirmar a inativação?' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.statusDeactivate();
      }
    });
  }

  modalConfirmationActivate() {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, { minWidth: '50%', data: { title: 'Deseja confirmar a ativação?' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.statusActivate();
      }
    });
  }

  statusActivate() {
    this._paymentMethodService.statusChange(this.data.id, StatusTypeEnum.Active)
      .toPromise()
      .then(resp => {
        this.load();
        this._snackBar.open(`Forma de pagamento ativada com sucesso!`);
        this._dialogRef.close();
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  statusDeactivate() {
    this._paymentMethodService.statusChange(this.data.id, StatusTypeEnum.Inactive)
      .toPromise()
      .then(resp => {
        this.load();
        this._snackBar.open(`Forma de pagamento inativado com sucesso!`);
        this._dialogRef.close();
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  cancel() {
    this._dialogRef.close();
  }
}
