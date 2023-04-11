import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectChange } from 'src/app/app.material';
import { DependentDocTypeEnumList } from 'src/app/enums/dependent-doc-type.enum';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { MentoredCompanyModel } from 'src/app/models/mentored-company.model';
import { UtilitariosService } from 'src/app/services';
import { MentoredCompanyService } from 'src/app/services/admin/mentored-company.service';

@Component({
  selector: 'app-mentored-contract',
  templateUrl: './mentored-contract.component.html',
  styleUrls: ['./mentored-contract.component.scss']
})
export class MentoredContractComponent extends OnDestroySubscriptions implements OnInit {
  docTypes = DependentDocTypeEnumList();
  form: FormGroup;
  loading: boolean = false;
  companies: MentoredCompanyModel[] = [];
  filterPeriodValue: any;
  companyId: number = null;
  multiple: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<MentoredContractComponent>,
    private _formBuilder: FormBuilder,
    private _utilitariosService: UtilitariosService,
    private _mentoredCompanyService: MentoredCompanyService
  ) {
    super();
  }
  ngOnInit(): void {
    this.form = this._formBuilder.group({
      typeDoc: [1, [Validators.required]],
      files: ['', [Validators.required]],
      mentoredCompanyId: [null]
    });

    this.subscriptions.add(this.form.controls.typeDoc.valueChanges.subscribe((value) => {
      this.form.controls.file.clearValidators();
      this.form.controls.file.updateValueAndValidity();
    }));
    this.loadCompany();
  }

  loadCompany() {
    this._mentoredCompanyService.findCompanyByMentored(this.data.mentoredId)
      .toPromise()
      .then((ret: MentoredCompanyModel[]) => {
        this.companies = ret;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  onChange(fileList: any[]): void {

    console.log('fileList ', fileList);
    var t = fileList.sort((one, two) => (one > two ? -1 : 1));

    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onloadend = function (x) {
      console.log('file reader ', fileReader.result);
    }
    fileReader.readAsText(file);
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
    formData.append("mentoredCompanyId", this.form.value.mentoredCompanyId);

    for (var i = 0; i <= files.files.length; i++) {
      formData.append("type", type);
      formData.append("files", files.files[i]);
    }

    this._mentoredCompanyService.uploadDoc(this.data.mentoredId, formData)
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
