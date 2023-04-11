import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DependentDocTypeEnumList } from 'src/app/enums/dependent-doc-type.enum';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { UtilitariosService } from 'src/app/services';
import { DailyPaymentService } from 'src/app/services/admin/daily-payment.service';
import { PendencyService } from 'src/app/services/admin/pedency.service';

@Component({
  selector: 'app-pendency-doc',
  templateUrl: './pendency-doc.component.html',
  styleUrls: ['./pendency-doc.component.scss']
})
export class PendencyDocComponent extends OnDestroySubscriptions
  implements OnInit {

  docTypes = DependentDocTypeEnumList();
  form: FormGroup;
  loading: boolean = false;
  filterPeriodValue: any;
  companyId: number = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<PendencyDocComponent>,
    private _formBuilder: FormBuilder,
    private _utilitariosService: UtilitariosService,
    private _pendencyService: PendencyService
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

    this._pendencyService
      .uploadDoc(this.data.pendencyId, formData)
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
