import { DecimalPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from 'src/app/app.material';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { MentoredCompanyModel } from 'src/app/models/mentored-company.model';
import { InvoiceModel } from 'src/app/models/mentored-payment.model';
import { MentoredSubscriptionModel } from 'src/app/models/mentored-subscription.model';
import { ProductModel } from 'src/app/models/product.model';
import { UtilitariosService } from 'src/app/services';
import { InvoiceService } from 'src/app/services/admin/invoice.service';
import { MentoredCompanyService } from 'src/app/services/admin/mentored-company.service';
import { MentoredSubscriptionService } from 'src/app/services/admin/mentored-subscription.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { UtilService } from 'src/app/services/admin/util.service';
import { MentoredPaymentComponent } from '../mentored-payment/mentored-payment.component';

@Component({
  selector: 'app-mentored-subscription',
  templateUrl: './mentored-subscription.component.html',
  styleUrls: ['./mentored-subscription.component.scss']
})
export class MentoredSubscriptionComponent extends OnDestroySubscriptions implements OnInit {
  form: FormGroup;
  title: string = "Assinatura";
  products: ProductModel[] = [];
  invoices: InvoiceModel[] = [];
  companies: MentoredCompanyModel[] = [];
  subs: MentoredSubscriptionModel;
  installments = [];
  startDate = new Date();
  loading: boolean = false;
  disabled: boolean = true;
  totalAmountValue: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<MentoredSubscriptionComponent>,
    private _formbuilder: FormBuilder,
    private _productService: ProductService,
    private _utilitariosService: UtilitariosService,
    private _mentoredCompanyService: MentoredCompanyService,
    private _mentoredSubscriptionService: MentoredSubscriptionService,
    private _utilService: UtilService,
    private _decimalPipe: DecimalPipe,
  ) {
    super();

    this.form = this._formbuilder.group(new MentoredSubscriptionModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["canceledDate"].clearValidators();
    this.form.controls["currentPeriodId"].clearValidators();
    this.form.controls["mentoredCompanyId"].clearValidators();
    this.form.controls["motiveCanceled"].clearValidators();
    this.form.controls["overdueSince"].clearValidators();
    this.form.controls["requestCancelDate"].clearValidators();
    this.form.controls["requestCancelMotive"].clearValidators();
    this.form.controls["dueDate"].clearValidators();
    this.form.controls["discountAmount"].clearValidators();
    this.form.controls["requestCancelMotive"].clearValidators();
  }

  ngOnInit(): void {
    if (this.data.id != null) {
      this.load();
    }

    this.form.controls.mentoredId.setValue(this.data.mentoredId);
    this.form.controls.initialAmount.setValue(0);
    this.form.controls.discountAmount.setValue(0);
    this.form.controls.totalAmount.setValue(0);

    this.loadProducts();
    this.loadCompanyByIdMentored();
    this.createInstallments();
  }

  load() {
    this.loading = true;
    this._mentoredSubscriptionService
      .getById(this.data.id, this.data.mentoredId)
      .toPromise()
      .then((resp: MentoredSubscriptionModel) => {
        this.form.patchValue(resp);
        this.title = "Editar assinatura";
        this.loading = false;
        this.subs = resp;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadProducts() {
    this.loading = true;
    this._productService
      .get()
      .toPromise()
      .then((resp: ProductModel[]) => {
        this.loading = false;
        this.products = resp;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadCompanyByIdMentored() {
    this._mentoredCompanyService.findCompanyByMentored(this.data.mentoredId)
      .toPromise()
      .then((ret: MentoredCompanyModel[]) => {
        if (ret != null)
          this.companies = ret;
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
    this._mentoredSubscriptionService.save(this.form.value)
      .toPromise()
      .then(ret => {
        this.loading = false;
        this._utilitariosService.SnackAlert('Pagamento salvo com sucesso.', "success");
        this._dialogRef.close(ret);
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  createInstallments() {
    var installments = [];
    for (let i = 1; i <= 12; i++) {
      installments.push({ value: i, description: `${i}x` });
    }
    this.installments = installments;
  }

  cancel() {
    this._dialogRef.close();
  }

}
