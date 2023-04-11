import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from 'src/app/app.material';
import { ExpenseCategoryModel } from 'src/app/models/expense-category.model';
import { UtilitariosService } from 'src/app/services';
import { ExpenseCategoryService } from 'src/app/services/admin/expense-category.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrls: ['./expense-category.component.scss']
})
export class ExpenseCategoryComponent implements OnInit {
  form: FormGroup;
  title: string = "Nova Categoria";
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ExpenseCategoryModel,
    private _dialogRef: MatDialogRef<ExpenseCategoryComponent>,
    private _formbuilder: FormBuilder,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _expenseService: ExpenseCategoryService,
  ) {

    this.form = this._formbuilder.group(new ExpenseCategoryModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
  }

  ngOnInit(): void {
    if (this.data?.id != null) {
      this.load()
    }
  }

  load() {
    this._expenseService.find(this.data.id)
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
    let model = <ExpenseCategoryModel>this.form.value;
    this._expenseService.save(model)
      .toPromise()
      .then((resp: ExpenseCategoryModel) => {
        if (resp != null) {
          this._dialogRef.close();
          this.loading = false;
          this._snackBar.open(model.id > 0 ? `Categoria atualizado com sucesso!` : `Categoria salvo com sucesso!`);
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