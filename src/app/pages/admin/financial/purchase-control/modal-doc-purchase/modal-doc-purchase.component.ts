import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from 'src/app/app.material';
import { DependentDocTypeEnumList } from 'src/app/enums/dependent-doc-type.enum';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { PurchaseControlDocModel } from 'src/app/models/purchase-control-doc.model';
import { UtilitariosService } from 'src/app/services';
import { PatrimonyService } from 'src/app/services/admin/patrimony.service';
import { PurchaseControlService } from 'src/app/services/admin/purchase-control.service';

@Component({
  selector: 'app-modal-doc-purchase',
  templateUrl: './modal-doc-purchase.component.html',
  styleUrls: ['./modal-doc-purchase.component.scss']
})
export class ModalDocPurchaseComponent  extends OnDestroySubscriptions implements OnInit {
  docTypes = DependentDocTypeEnumList();
  form: FormGroup;
  loading: boolean = false;
  companies: PurchaseControlDocModel[] = [];
  filterPeriodValue: any;
  companyId: number = null;
  multiple: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<ModalDocPurchaseComponent>,
    private _formBuilder: FormBuilder,
    private _utilitariosService: UtilitariosService,
    private _purchaseService: PurchaseControlService
  ) {
    super();
  }
  ngOnInit(): void {
    this.form = this._formBuilder.group({
      typeDoc: [1, [Validators.required]],
      files: ['', [Validators.required]],
      patrimonyId: [null]
    });

    this.subscriptions.add(this.form.controls.typeDoc.valueChanges.subscribe((value) => {
      this.form.controls.file.clearValidators();
      this.form.controls.file.updateValueAndValidity();
    }));
    this.load();
  }

  load() {
    this._purchaseService.getDocs(this.data.mentoredId)
      .toPromise()
      .then((ret: PurchaseControlDocModel[]) => {
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
      this._utilitariosService.SnackAlert('Verifique os campos obrigatórios para prosseguir.', "error");
      return;
    }
    this.loading = true;
    const type = this.form.controls.typeDoc.value.toString();
    const files = this.form.controls.files.value;

    let formData = new FormData();
    formData.append("type", type);
    formData.append("patrimonyId", this.form.value.patrimonyId);

    for (var i = 0; i <= files.files.length; i++) {
      formData.append("type", type);
      formData.append("files", files.files[i]);
    }

    this._purchaseService.uploadDoc(this.data.mentoredId, formData)
      .toPromise()
      .then(ret => {
        this.loading = false;
        this._utilitariosService.SnackAlert('Documento salvo com sucesso.', "success");
        this._dialogRef.close(ret);
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  onCompleteItem($event) {
  }
}
