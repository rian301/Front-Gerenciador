import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatSelectChange, MatSnackBar, MAT_DIALOG_DATA } from 'src/app/app.material';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { AwardModel } from 'src/app/models/award.model';
import { CustomerPaymentModel } from 'src/app/models/customer-payment.model';
import { PaymentMethodModel } from 'src/app/models/payment-method.model';
import { UtilitariosService } from 'src/app/services';
import { AwardService } from 'src/app/services/admin/award.service';
import { CustomerAwardService } from 'src/app/services/admin/customer-award.service';
import { CustomerPaymentService } from 'src/app/services/admin/customer-payment.service';
import { PaymentMethodService } from 'src/app/services/admin/payment-method.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-customer-payment',
  templateUrl: './customer-payment.component.html',
  styleUrls: ['./customer-payment.component.scss']
})
export class CustomerPaymentComponent extends OnDestroySubscriptions implements OnInit {
  form: FormGroup;
  startDate = new Date(2021, 0, 1);
  id: number = null;
  title: string = "Novo Pêmio";
  methods: PaymentMethodModel[] = [];
  situations: string[] = [];
  loading: boolean = false;
  productId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CustomerPaymentModel,
    private _dialogRef: MatDialogRef<CustomerPaymentComponent>,
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _service: CustomerPaymentService,
    private _utilitariosService: UtilitariosService,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _paymentService: PaymentMethodService,
  ) {
    super();

    this.form = this._formbuilder.group(new CustomerPaymentModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["signatureDate"].clearValidators();
    this.form.controls["cancelDate"].clearValidators();
    this.form.controls["installments"].clearValidators();
    this.form.controls["note"].clearValidators();
    this.form.controls["statusDescription"].clearValidators();
    this.form.controls["statusDescriptionCustom"].clearValidators();
  }

  ngOnInit(): void {
    this.loadPaymentsMethods();
    if (this.data.id != null)
      this.load();

    if (this.data.customerId != null){}
      this.form.controls.customerId.setValue(this.data.customerId);
  }

  loadPaymentsMethods() {
    this.loading = true;
    this._paymentService
      .get()
      .toPromise()
      .then((resp: PaymentMethodModel[]) => {
        this.loading = false;
        this.methods = resp;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  paymentSelect(item: MatSelectChange) {

  }

  load() {
    this._service.findPaymendByCustomerById(this.data.customerId, this.data.id)
      .toPromise()
      .then((ret) => {
        this.form.patchValue(ret);
        this.title = "Editar Pagamento";
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
    this._service.save(this.form.value)
      .toPromise()
      .then((resp: CustomerPaymentModel) => {
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
