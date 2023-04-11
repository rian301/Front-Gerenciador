import { DecimalPipe } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  MatDialogRef,
  MatSnackBar,
  MAT_DIALOG_DATA,
} from "src/app/app.material";
import { OnDestroySubscriptions } from "src/app/helpers/detroy-subscriptions.helper";
import { MentoredCompanyModel } from "src/app/models/mentored-company.model";
import { PaymentMethodModel } from "src/app/models/payment-method.model";
import { UtilitariosService } from "src/app/services";
import { MentoredCompanyService } from "src/app/services/admin/mentored-company.service";
import { PaymentMethodService } from "src/app/services/admin/payment-method.service";
import { UtilService } from "src/app/services/admin/util.service";

@Component({
  selector: "app-mentored-company",
  templateUrl: "./mentored-company.component.html",
  styleUrls: ["./mentored-company.component.scss"],
})
export class MentoredCompanyComponent
  extends OnDestroySubscriptions
  implements OnInit
{
  form: FormGroup;
  startDate = new Date();
  id: number = null;
  title: string = "Novo Pêmio";
  companies: MentoredCompanyModel[] = [];
  methods: PaymentMethodModel[] = [];
  installments = [];
  loading: boolean = false;
  productId: number;
  cepDetected: boolean;
  installmentsRequired: boolean = false;
  disableSelect = new FormControl(true);
  disabledAll: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<MentoredCompanyComponent>,
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _utilitariosService: UtilitariosService,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _companyService: MentoredCompanyService,
    private _paymentService: PaymentMethodService,
    private _decimalPipe: DecimalPipe
  ) {
    super();

    this.form = this._formbuilder.group(new MentoredCompanyModel());
    Object.keys(this.form.controls).forEach((prop) =>
      this.form.controls[prop].setValidators(Validators.required)
    );
    this.form.controls["id"].clearValidators();
    this.form.controls["companyId"].clearValidators();
    this.form.controls["note"].clearValidators();
    this.form.controls["complement"].clearValidators();
    this.form.controls["district"].clearValidators();
    this.form.controls["statusDescription"].clearValidators();
    this.form.controls["createdAt"].clearValidators();
    this.form.controls["note"].clearValidators();
    this.form.controls["status"].clearValidators();
    this.form.controls["instagram"].clearValidators();
    this.form.controls["email"].clearValidators();
    this.form.controls["phone"].clearValidators();
  }

  ngOnInit(): void {
    if (this.data.mentoredId != null) {
      this.form.controls.mentoredId.setValue(this.data.mentoredId);
      this.loadPaymentsMethods();
    }

    if (this.data.companyId != null) this.loadCompany();

    if (this.data.readonly) this.disabledAll = true;
  }

  loadCompany() {
    this.loading = true;
    this._companyService
      .findCompanyById(this.data.mentoredId, this.data.companyId)
      .toPromise()
      .then((resp: MentoredCompanyModel[]) => {
        this.form.patchValue(resp);
        this.loading = false;
        this.companies = resp;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
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
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
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
    this._companyService
      .save(this.form.value)
      .toPromise()
      .then((resp: MentoredCompanyModel) => {
        if (resp != null) {
          this.loading = false;
          this._snackBar.open(
            this.form.controls.id.value > 0
              ? `Informações atualizada com sucesso!`
              : `Informações salvas com sucesso!`
          );
          this._dialogRef.close(this.form.value);
        }
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  cancel() {
    this._dialogRef.close(this.form.value);
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
}
