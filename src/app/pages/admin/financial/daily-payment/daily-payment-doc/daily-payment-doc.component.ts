import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatSelectChange,
} from "src/app/app.material";
import { DependentDocTypeEnumList } from "src/app/enums/dependent-doc-type.enum";
import { OnDestroySubscriptions } from "src/app/helpers/detroy-subscriptions.helper";
import { MentoredCompanyModel } from "src/app/models/mentored-company.model";
import { UtilitariosService } from "src/app/services";
import { DailyPaymentService } from "src/app/services/admin/daily-payment.service";
import { MentoredCompanyService } from "src/app/services/admin/mentored-company.service";

@Component({
  selector: "app-daily-payment-doc",
  templateUrl: "./daily-payment-doc.component.html",
  styleUrls: ["./daily-payment-doc.component.scss"],
})
export class DailyPaymentDocComponent
  extends OnDestroySubscriptions
  implements OnInit
{
  docTypes = DependentDocTypeEnumList();
  form: FormGroup;
  loading: boolean = false;
  filterPeriodValue: any;
  companyId: number = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<DailyPaymentDocComponent>,
    private _formBuilder: FormBuilder,
    private _utilitariosService: UtilitariosService,
    private _dailyService: DailyPaymentService
  ) {
    super();
  }
  ngOnInit(): void {
    this.form = this._formBuilder.group({
      typeDoc: [1, [Validators.required]],
      files: ["", [Validators.required]],
      mentoredCompanyId: [null],
    });

    this.subscriptions.add(
      this.form.controls.typeDoc.valueChanges.subscribe((value) => {
        this.form.controls.file.clearValidators();
        this.form.controls.file.updateValueAndValidity();
      })
    );
  }

  save() {
    if (!this.form.valid) {
      this._utilitariosService.SnackAlert(
        "Verifique os campos obrigatórios para prosseguir.",
        "error"
      );
      return;
    }
    this.loading = true;
    const type = this.form.controls.typeDoc.value.toString();
    const files = this.form.controls.files.value;

    let formData = new FormData();
    formData.append("type", type);
    formData.append("mentoredCompanyId", this.form.value.mentoredCompanyId);

    for (var i = 0; i <= files.files.length; i++) {
      formData.append("type", type);
      formData.append("files", files.files[i]);
    }

    this._dailyService
      .uploadDoc(this.data.mentoredId, formData)
      .toPromise()
      .then((ret) => {
        this.loading = false;
        this._utilitariosService.SnackAlert(
          "Documento salvo com sucesso.",
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
}
