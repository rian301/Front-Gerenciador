import { DecimalPipe } from "@angular/common";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialogRef, MAT_DIALOG_DATA } from "src/app/app.material";
import { ModalConfirmationComponent } from "src/app/components/modal-confirmation/modal-confirmation.component";
import { ConfirmationModel } from "src/app/components/modal-confirmation/modal-confirmation.model";
import { InvoiceStatusEnum, SubscriptionStatusEnum } from "src/app/enums";
import { OnDestroySubscriptions } from "src/app/helpers/detroy-subscriptions.helper";
import { MentoredCompanyModel } from "src/app/models/mentored-company.model";
import { MentoredPaymentList } from "src/app/models/mentored-payment-list.model";
import { InvoiceModel } from "src/app/models/mentored-payment.model";
import { MentoredSubscriptionModel } from "src/app/models/mentored-subscription.model";
import { PaymentMethodModel } from "src/app/models/payment-method.model";
import { ProductModel } from "src/app/models/product.model";
import { InvoiceService } from "src/app/services/admin/invoice.service";
import { MentoredCompanyService } from "src/app/services/admin/mentored-company.service";
import { MentoredPaymentService } from "src/app/services/admin/mentored-payment.service";
import { MentoredSubscriptionService } from "src/app/services/admin/mentored-subscription.service";
import { PaymentMethodService } from "src/app/services/admin/payment-method.service";
import { ProductService } from "src/app/services/admin/product.service";
import { UtilService } from "src/app/services/admin/util.service";
import { UtilitariosService } from "src/app/services/common/utilitarios.service";

@Component({
  selector: "app-mentored-payment",
  templateUrl: "./mentored-payment.component.html",
  styleUrls: ["./mentored-payment.component.scss"],
})
export class MentoredPaymentComponent
  extends OnDestroySubscriptions
  implements OnInit
{
  title: string = "Pagamentos";
  startDate: Date = new Date();
  form: FormGroup;
  loading: boolean = false;
  disabled: boolean = true;
  isUpdate: boolean = false;
  subscription: MentoredSubscriptionModel[] = [];
  sub: MentoredSubscriptionModel;
  methods: PaymentMethodModel[] = [];
  companies: MentoredCompanyModel[] = [];
  invoiceList: InvoiceModel[] = [];
  products: ProductModel[] = [];
  installments = [];
  filterPeriodValue: any;
  companyId: number = null;
  subscriptionValue: any;
  amountInstallments: number = 0;
  statusCode: number;
  statusSubscription: typeof SubscriptionStatusEnum = SubscriptionStatusEnum;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<MentoredPaymentComponent>,
    private _formbuilder: FormBuilder,
    private _utilitariosService: UtilitariosService,
    private _mentoredPaymentService: MentoredPaymentService,
    private _productService: ProductService,
    private _invoiceService: InvoiceService,
    private _subscriptionService: MentoredSubscriptionService,
    private _companyService: MentoredCompanyService,
    private _utilService: UtilService,
    private _mentoredSubscriptionService: MentoredSubscriptionService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {
    super();

    this.form = this._formbuilder.group(new MentoredSubscriptionModel());
    Object.keys(this.form.controls).forEach((prop) =>
      this.form.controls[prop].setValidators(Validators.required)
    );
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
    this.form.controls["status"].clearValidators();
    this.form.controls["statusDescription"].clearValidators();
    this.form.controls["invoices"].clearValidators();
    this.form.controls["partnerId"].clearValidators();
    this.form.controls["endSubscriptionDate"].clearValidators();
    this.form.controls["statusDescriptionCustom"].clearValidators();
    this.form.controls["productName"].clearValidators();
    this.form.controls["mentoredName"].clearValidators();
    this.form.controls["statusDescriptionCustom"].clearValidators();
    this.form.controls["subscriptionDateString"].clearValidators();
    this.form.controls["endSubscriptionDateString"].clearValidators();
  }
  ngOnInit(): void {
    this.form.controls.initialAmount.setValue(0);
    this.form.controls.discountAmount.setValue(0);
    this.form.controls.totalAmount.setValue(0);
    this.form.controls.mentoredId.setValue(this.data.mentoredId);
    this.loadCompany();
    this.loadProducts();
    this.createInstallments();

    if (this.data.id != null) {
      this.isUpdate = true;
      this.form.controls.id.setValue(this.data.id);
      this.loadSubscriptionById();
    }
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
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  loadCompany() {
    this._companyService
      .findCompanyByMentored(this.data.mentoredId)
      .toPromise()
      .then((ret: MentoredCompanyModel[]) => {
        if (ret != null) this.companies = ret;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  loadSubscriptionById() {
    this.loading = true;
    this._mentoredSubscriptionService
      .getById(this.data.id, this.data.mentoredId)
      .toPromise()
      .then((resp: MentoredSubscriptionModel) => {
        this.validStatus(resp.status);
        this.form.patchValue(resp);
        this.invoiceList = resp.invoices;
        this.title = "Editar pagamentos";
        this.loading = false;
        this.sub = resp;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  loadInvoices() {
    this.loading = true;
    this._invoiceService
      .getByMentoredId(this.data.id)
      .toPromise()
      .then((resp: InvoiceModel[]) => {
        this.loading = false;
        this.invoiceList = resp;
        this.form.patchValue(resp);
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  verifyIfDisable(value) {
    if (value >= 1) this.disabled = false;
    else this.disabled = true;
  }

  prepareForm() {
    this.invoiceList.forEach((element) => {
      element.mentoredCompanyId = this.form.value.mentoredCompanyId;
      element.mentoredId = this.data.mentoredId;
      element.status = InvoiceStatusEnum.Pending;
      element.subscriptionId = this.form.value.productId;
    });
    this.form.controls.invoices.setValue(this.invoiceList);
  }

  save() {
    this.prepareForm();
    if (this.invoiceList.length <= 0) {
      this._snackBar.open("É preciso gerar as faturas antes de salvar.");
      return;
    }

    var expirationDate = this.invoiceList.filter(
      (x) => x.expirationDate == null
    );

    if (expirationDate.length > 0) {
      this._utilitariosService.SnackAlert(
        "É preciso preencher todas as datas de vencimento.",
        "error"
      );
      return;
    }

    if (!this.form.valid) {
      console.log(this.form);
      this._utilService.FormValidate(this.form);
      return;
    }

    this.loading = true;
    this._mentoredPaymentService
      .save(this.data.id, this.form.value)
      .toPromise()
      .then((ret) => {
        this.loading = false;
        this._utilitariosService.SnackAlert(
          "Pagamento salvo com sucesso!",
          "success"
        );
        this._dialogRef.close(ret);
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
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

  // newPaymentMethod() {
  //   if (!this.form.valid) {
  //     console.log(this.form);
  //     this._utilService.FormValidate(this.form);
  //     return;
  //   }

  //   var index = this.form.value.installments;
  //   if (this.invoiceList.length <= 0)
  //     for (let i = 1; i <= index; i++) {
  //       this.invoiceList.push(new InvoiceModel(this.form.value.totalAmount / index));
  //     }
  //   else
  //     this.invoiceList.push(new InvoiceModel());
  // }

  modalConfirmationDelete(invoice: InvoiceModel, index: number) {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, {
      minWidth: "50%",
      data: {
        title: "Deseja confirmar a exlusão?",
        subTitle: "A operação não poderá ser desfeita.",
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.removePaymentMethod(invoice, index);
      }
    });
  }

  newPaymentMethod() {
    this.invoiceList.push(new InvoiceModel(0));
  }

  removePaymentMethod(invoice: InvoiceModel, index: number) {
    if (invoice.id != null) this.removeInvoiceAPI(invoice.id);
    this.invoiceList.splice(index);
  }

  removeInvoiceAPI(id: number) {
    this._invoiceService
      .remove(id)
      .toPromise()
      .then((ret) => {
        this.loading = false;
        this._utilitariosService.SnackAlert(
          "Pagamento removido com sucesso!",
          "success"
        );
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  changeStatusSubscription(status: SubscriptionStatusEnum) {
    this.loading = true;
    this._mentoredPaymentService
      .changeStatusSubscription(this.data.id, status)
      .toPromise()
      .then((resp: boolean) => {
        this.loading = false;
        this._utilitariosService.SnackAlert(
          "Status alterado com sucesso!",
          "success"
        );
        this._dialogRef.close();
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  validStatus(statusCode: number) {
    this.statusCode = statusCode;
  }

  modalConfirmationDeactivate() {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, {
      maxWidth: "50%",
      data: {
        title: "Deseja confirmar a desativação?",
        // subTitle:
        //   "Ao inativar a assinatura todas as faturas que não foram pagas pertencentes a esta assinatura serão canceladas. ATENÇÃO! Após a confimação não será possível reativar a assinatura.",
      },
    });
    dialogRef.afterClosed().subscribe((result: ConfirmationModel) => {
      if (result.confirm) {
        this.changeStatusSubscription(SubscriptionStatusEnum.Inactive);
      }
    });
  }

  modalConfirmationCancel() {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, {
      maxWidth: "50%",
      data: {
        title: "Deseja confirmar o cancelamento?",
        // subTitle:
        //   "Ao cancelar a assinatura todas as faturas que não foram pagas pertencentes a esta assinatura serão canceladas. ATENÇÃO! Após a confimação não será possível reativar a assinatura.",
      },
    });
    dialogRef.afterClosed().subscribe((result: ConfirmationModel) => {
      if (result.confirm) {
        this.changeStatusSubscription(SubscriptionStatusEnum.Canceled);
      }
    });
  }

  modalConfirmationConclude() {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, {
      maxWidth: "50%",
      data: {
        title: "Deseja confirmar a conclusão?",
        // subTitle:
        //   "Ao cancelar a assinatura todas as faturas que não foram pagas pertencentes a esta assinatura serão canceladas. ATENÇÃO! Após a confimação não será possível reativar a assinatura.",
      },
    });
    dialogRef.afterClosed().subscribe((result: ConfirmationModel) => {
      if (result.confirm) {
        this.changeStatusSubscription(SubscriptionStatusEnum.Conclude);
      }
    });
  }

  modalConfirmationActivate() {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, {
      minWidth: "50%",
      data: { title: "Deseja confirmar a ativação?" },
    });
    dialogRef.afterClosed().subscribe((result: ConfirmationModel) => {
      if (result.confirm) {
        this.changeStatusSubscription(SubscriptionStatusEnum.Active);
      }
    });
  }

  cancel() {
    this._dialogRef.close();
  }
}
