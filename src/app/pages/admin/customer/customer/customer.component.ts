import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from "src/app/app.material";
import { MatDialog } from "src/app/app.material";
import { DinamicTableModel } from "src/app/components/dinamic-table/dinamic-table.model";
import { ModalConfirmationComponent } from "src/app/components/modal-confirmation/modal-confirmation.component";
import { PermissionConsts } from "src/app/consts/permission.consts";
import { SubscriptionStatusEnum } from "src/app/enums";
import { CustomerStatusEnum } from "src/app/enums/customer-status.enum";
import { OnDestroySubscriptions } from "src/app/helpers/detroy-subscriptions.helper";
import { PermissionHelper } from "src/app/helpers/permission.helper";
import { CustomerAwardModel } from "src/app/models/customer-award.model";
import { CustomerLaunchModel } from "src/app/models/customer-launch.model";
import { CustomerPaymentModel } from "src/app/models/customer-payment.model";
import { CustomerProductModel } from "src/app/models/customer-product.model";
import { CustomerModel } from "src/app/models/customer.model";
import {
  NavigationService,
  PermissionService,
  UtilitariosService,
} from "src/app/services";
import { CustomerAwardService } from "src/app/services/admin/customer-award.service";
import { CustomerLauncService } from "src/app/services/admin/customer-launch.service";
import { CustomerPaymentService } from "src/app/services/admin/customer-payment.service";
import { CustomerProductService } from "src/app/services/admin/customer-product.service";

import { CustomerService } from "src/app/services/admin/customer.service";

import { UtilService } from "src/app/services/admin/util.service";
import { CustomerAwardComponent } from "../customer-award/customer-award.component";
import { CustomerLaunchComponent } from "../customer-launch/customer-launch.component";
import { CustomerPaymentComponent } from "../customer-payment/customer-payment.component";
import { CustomerProductComponent } from "../customer-product/customer-product.component";
import { ModalUploadCustomerComponent } from "../modal-upload-customer/modal-upload-customer.component";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.scss"],
})
export class CustomerComponent
  extends OnDestroySubscriptions
  implements OnInit
{
  form: FormGroup;
  id: number = null;
  title: string = "Novo aluno";
  startDate = new Date(1990, 0, 1);

  displayedColumnsLanch: string[] = [
    "nicho",
    "invoice",
    "instagram",
    "testimonial",
    "action",
  ];
  dataSource = new MatTableDataSource();

  displayedColumnsProduct: string[] = ["id", "name", "datePurchase", "action"];
  dataSourceProduct = new MatTableDataSource();

  displayedColumnsAward: string[] = [
    "id",
    "name",
    "dateSend",
    "dateReceiving",
    "dateResend",
    "dateDevolution",
    "code",
    "action",
  ];
  dataSourceAward = new MatTableDataSource();

  displayedColumnsPayment: string[] = [
    "id",
    "signatureDate",
    "cancelDate",
    "installments",
    "statusDescription",
    "action",
  ];
  dataSourcePayment = new MatTableDataSource();

  paymentCard: boolean = false;
  paymentTicket: boolean = false;
  hidenTabs: boolean = false;
  cepDetected: boolean = true;
  action: string = null;
  isNewSale: boolean = false;
  hidenButtonNewCustomer: boolean = false;
  subEnum: typeof SubscriptionStatusEnum = SubscriptionStatusEnum;
  customerEnum: typeof CustomerStatusEnum = CustomerStatusEnum;
  motiveCanceled: string = null;
  cancelInvoicePending: boolean = false;
  subscriptionId: number = null;
  loading: boolean = false;
  isAdm: boolean = false;

  constructor(
    private _dialog: MatDialog,
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _customerService: CustomerService,
    private _navigationService: NavigationService,
    private _customerLaunchService: CustomerLauncService,
    private _customerProductService: CustomerProductService,
    private _customerAwardService: CustomerAwardService,
    private _customerPaymentService: CustomerPaymentService,
    private _permissionService: PermissionService
  ) {
    super();

    this.form = this._formbuilder.group(new CustomerModel());
    Object.keys(this.form.controls).forEach((prop) =>
      this.form.controls[prop].setValidators(Validators.required)
    );
    this.form.controls["id"].clearValidators();
    this.form.controls["document"].clearValidators();
    this.form.controls["birthDate"].clearValidators();
    this.form.controls["rg"].clearValidators();
    this.form.controls["createdAt"].clearValidators();
    this.form.controls["status"].clearValidators();
    this.form.controls["statusDescription"].clearValidators();
    this.form.controls["phoneNumber"].clearValidators();
    this.form.controls["note"].clearValidators();

    this.form.controls["zipCode"].clearValidators();
    this.form.controls["street"].clearValidators();
    this.form.controls["number"].clearValidators();
    this.form.controls["complement"].clearValidators();
    this.form.controls["district"].clearValidators();
    this.form.controls["city"].clearValidators();
    this.form.controls["state"].clearValidators();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe((params) => {
        this.id = params["id"];
        if (this.id != null) {
          this.loadCustomer();
        } else this.hidenTabs = true;
      })
    );

    this.subscriptions.add(
      this.route.queryParams.subscribe((params) => {
        this.action = params["acao"];
        if (this.action != null && this.action == "novo_aluno") {
          this.isNewSale = true;
        }
      })
    );
  }

  loadCustomer() {
    this.loading = true;
    this._customerService
      .find(this.id)
      .toPromise()
      .then((resp: CustomerModel) => {
        this.form.patchValue(resp);
        this.title = "Editar Aluno";
        this.loading = false;
        this.loadLaunch();
        this.loadProduct();
        this.loadAward();
        this.loadPayment();
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  loadLaunch() {
    this.loading = true;
    this._customerLaunchService
      .findLaunchByCustomer(this.id)
      .toPromise()
      .then((resp: CustomerLaunchModel[]) => {
        this.dataSource.data = resp;
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  loadPayment() {
    this.loading = true;
    this._customerPaymentService
      .findPaymentByCustomer(this.id)
      .toPromise()
      .then((resp: CustomerPaymentModel[]) => {
        this.dataSourcePayment.data = resp;
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  loadProduct() {
    this.loading = true;
    this._customerProductService
      .findProductByCustomer(this.id)
      .toPromise()
      .then((resp: CustomerProductModel[]) => {
        this.dataSourceProduct.data = resp;
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  loadAward() {
    this.loading = true;
    this._customerAwardService
      .findAwardByCustomer(this.id)
      .toPromise()
      .then((resp: CustomerAwardModel[]) => {
        this.dataSourceAward.data = resp;
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  statusChange(status: CustomerStatusEnum) {
    this._customerService
      .statusChange(this.id, status)
      .toPromise()
      .then((resp) => {
        this.loadCustomer();
        this._snackBar.open(`Status alterado com sucesso!`);
      })
      .catch((error) => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  newLaunch() {
    const dialogRef = this._dialog.open(CustomerLaunchComponent, {
      minWidth: "80%",
      data: { customerId: this.id },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: CustomerLaunchModel) => this.loadCustomer());
  }

  editLaunch(model: CustomerLaunchModel) {
    const dialogRef = this._dialog.open(CustomerLaunchComponent, {
      minWidth: "80%",
      data: model,
    });
    dialogRef
      .afterClosed()
      .subscribe((result: CustomerLaunchModel) => this.loadCustomer());
  }

  newProduct() {
    const dialogRef = this._dialog.open(CustomerProductComponent, {
      minWidth: "50%",
      data: { customerId: this.id },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: CustomerProductModel) => this.loadProduct());
  }

  editProduct(model: CustomerProductModel) {
    const dialogRef = this._dialog.open(CustomerProductComponent, {
      minWidth: "50%",
      data: { id: model.id, customerId: this.id },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: CustomerProductModel) => this.loadProduct());
  }

  newAward() {
    const dialogRef = this._dialog.open(CustomerAwardComponent, {
      minWidth: "50%",
      data: { customerId: this.id },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: CustomerAwardModel) => this.loadAward());
  }

  editAward(model: CustomerAwardModel) {
    const dialogRef = this._dialog.open(CustomerAwardComponent, {
      minWidth: "50%",
      data: { id: model.id, customerId: this.id },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: CustomerAwardModel) => this.loadAward());
  }

  newPayment() {
    const dialogRef = this._dialog.open(CustomerPaymentComponent, {
      minWidth: "50%",
      data: { customerId: this.id },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: CustomerPaymentModel) => this.loadPayment());
  }

  editPayment(model: CustomerPaymentModel) {
    const dialogRef = this._dialog.open(CustomerPaymentComponent, {
      minWidth: "50%",
      data: { id: model.id, customerId: this.id },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: CustomerPaymentModel) => this.loadPayment());
  }

  save() {
    if (!this.form.valid) {
      this._utilService.FormValidate(this.form);
      return;
    }

    let model = <CustomerModel>this.form.value;
    this._customerService
      .save(model)
      .toPromise()
      .then((resp: CustomerModel) => {
        if (resp != null) {
          this._snackBar.open(
            model.id > 0
              ? `Aluno atualizado com sucesso!`
              : `Aluno salvo com sucesso!`
          );
          this.hidenTabs = false;
          this.id = resp.id;
          this.loadCustomer();
          if (this.isNewSale) {
          }
        }
      })
      .catch((error) => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  cancel() {
    this._navigationService.customers();
  }

  searchCep(event) {
    let cep = event.target.value;
    if (cep.length === 9) {
      this._utilitariosService
        .BuscarCep(event.target.value)
        .toPromise()
        .then((ret) => {
          this.form.controls["city"].setValue(ret.localidade);
          this.form.controls["state"].setValue(ret.uf);
          this.form.controls["street"].setValue(ret.logradouro);
          this.form.controls["district"].setValue(ret.bairro);
          this.cepDetected = this.IsNullOrUndefined(ret.logradouro)
            ? false
            : true;
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

  modalUpload() {
    const dialogRef = this._dialog.open(ModalUploadCustomerComponent, {
      maxWidth: "50%",
      minWidth: "50%",
    });
    dialogRef.afterClosed().subscribe((result: CustomerModel) => {
      this._navigationService.customers();
    });
  }

  modalConfirmationRemove(id: number) {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, {
      minWidth: "50%",
      data: {
        title: "Deseja confirmar a exlusão?",
        subTitle: "Ao confirmar não será possível desfazer a acão.",
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.removeProductMethod(id);
      }
    });
  }

  modalConfirmationRemoveAward(id: number) {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, {
      minWidth: "50%",
      data: {
        title: "Deseja confirmar a exlusão?",
        subTitle: "Ao confirmar não será possível desfazer a acão.",
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.removeAwardMethod(id);
      }
    });
  }

  removeProductMethod(id: number) {
    this.loading = true;
    this._customerProductService
      .remove(id, this.id)
      .toPromise()
      .then((ret) => {
        this.loading = false;
        this._snackBar.open("Produto removido com sucesso!");
        this.loadProduct();
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  removeAwardMethod(id: number) {
    this.loading = true;
    this._customerAwardService
      .remove(id, this.id)
      .toPromise()
      .then((ret) => {
        this.loading = false;
        this._snackBar.open("Prêmio removido com sucesso!");
        this.loadAward();
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }
}
