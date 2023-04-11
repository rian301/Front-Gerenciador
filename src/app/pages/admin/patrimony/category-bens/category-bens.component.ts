import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from 'src/app/app.material';
import { AssetsCategoryModel } from 'src/app/models/assets-category.model';
import { UtilitariosService } from 'src/app/services';
import { AssetsCategoryService } from 'src/app/services/admin/assets-category.service';
import { ExpenseCategoryService } from 'src/app/services/admin/expense-category.service';
import { UtilService } from 'src/app/services/admin/util.service';
import { ExpenseCategoryComponent } from '../../financial/expense-category/expense-category/expense-category.component';

@Component({
  selector: 'app-category-bens',
  templateUrl: './category-bens.component.html',
  styleUrls: ['./category-bens.component.scss']
})
export class CategoryBensComponent implements OnInit {

  form: FormGroup;
  title: string = "Nova Categoria de Bens";
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AssetsCategoryModel,
    private _dialogRef: MatDialogRef<CategoryBensComponent>,
    private _formbuilder: FormBuilder,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _assetsService: AssetsCategoryService,
  ) {

    this.form = this._formbuilder.group(new AssetsCategoryModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
  }

  ngOnInit(): void {
    if (this.data?.id != null) {
      this.load()
    }
  }

  load() {
    this._assetsService.find(this.data.id)
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
    let model = <AssetsCategoryModel>this.form.value;
    this._assetsService.save(model)
      .toPromise()
      .then((resp: AssetsCategoryModel) => {
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