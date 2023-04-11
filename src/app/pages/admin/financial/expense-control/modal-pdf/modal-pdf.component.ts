import { Component, Inject, OnInit, SecurityContext } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "src/app/app.material";
import { DomSanitizer } from "@angular/platform-browser";
import { Pipe, PipeTransform } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UtilitariosService } from "src/app/services";
import { DailyPaymentService } from "src/app/services/admin/daily-payment.service";
import { DailyPaymentDocComponent } from "../../daily-payment/daily-payment-doc/daily-payment-doc.component";
import { OnDestroySubscriptions } from "src/app/helpers/detroy-subscriptions.helper";
import { ExpenseControlService } from "src/app/services/admin/expense-control.service";
import { DependentDocTypeEnumList } from "src/app/enums/dependent-doc-type.enum";

@Component({
  selector: "app-modal-pdf",
  templateUrl: "./modal-pdf.component.html",
  styleUrls: ["./modal-pdf.component.scss"],
})
export class ModalPdfComponent
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
    private _dialogRef: MatDialogRef<ModalPdfComponent>,
    private _formBuilder: FormBuilder,
    private _utilitariosService: UtilitariosService,
    private _espenseService: ExpenseControlService
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

    for (var i = 0; i <= files.files.length; i++) {
      formData.append("type", type);
      formData.append("files", files.files[i]);
    }

    this._espenseService
      .uploadDoc(this.data.id, formData)
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
