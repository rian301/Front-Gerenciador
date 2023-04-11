import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from 'src/app/app.material';
import { CustomerModel } from 'src/app/models';
import { CustomerService } from 'src/app/services/admin/customer.service';
import { ImportExcelService } from 'src/app/services/common/import-excel/import-exel.service';
import { UtilitariosService } from 'src/app/services/common/utilitarios.service';

@Component({
  selector: 'app-modal-upload-customer',
  templateUrl: './modal-upload-customer.component.html',
  styleUrls: ['./modal-upload-customer.component.scss']
})
export class ModalUploadCustomerComponent implements OnInit {
  title: string = "Importação em massa";
  loading: boolean = false;
  form: FormGroup;
  arrayBuffer: any;
  file: File;

  constructor(
    private _dialogRef: MatDialogRef<ModalUploadCustomerComponent>,
    private _importExel: ImportExcelService,
    private _formbuilder: FormBuilder,
    private _utilitariosService: UtilitariosService,
    private _customerService: CustomerService,
  ) {
    this.form = this._formbuilder.group({
      file: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  upload() {
    // var ret = this._importExel.upload(this.arrayBuffer, this.file).toPromise()
    //   .then((ret) => {
    //     console.log("Retorno aqui", ret);
    //   })

  }

  save() {
    if (!this.form.valid) {
      console.log(this.form);
      
      this._utilitariosService.SnackAlert('Verifique os campos obrigatórios para prosseguir.', "error");
      return;
    }

    const file = this.form.controls.file.value;

    let formData = new FormData();
    this.loading = true;
    if (file != null && file.files != null)
      formData.append("file", file.files[0]);

    this._customerService.uploadDoc(formData)
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

  cancel() {
    this._dialogRef.close();
  }
}
