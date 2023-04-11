import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from 'src/app/app.material';
import { DocumentModel } from 'src/app/models/document.model';
import { UtilitariosService } from 'src/app/services';
import { DocumentService } from 'src/app/services/admin/document.service';
import { UtilService } from 'src/app/services/admin/util.service';
import { ExpenseCategoryComponent } from '../../expense-category/expense-category/expense-category.component';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  form: FormGroup;
  title: string = "Novo Documento";
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DocumentModel,
    private _dialogRef: MatDialogRef<ExpenseCategoryComponent>,
    private _formbuilder: FormBuilder,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _documentService: DocumentService,
  ) {

    this.form = this._formbuilder.group(new DocumentModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
  }

  ngOnInit(): void {
    if (this.data?.id != null) {
      this.load()
    }
  }

  load() {
    this._documentService.find(this.data.id)
      .toPromise()
      .then((ret) => {
        this.form.patchValue(ret);
        this.title = "Editar Categoria";
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
    let model = <DocumentModel>this.form.value;
    this._documentService.save(model)
      .toPromise()
      .then((resp: DocumentModel) => {
        if (resp != null) {
          this._dialogRef.close();
          this.loading = false;
          this._snackBar.open(model.id > 0 ? `Documento atualizado com sucesso!` : `Documento salvo com sucesso!`);
        }
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