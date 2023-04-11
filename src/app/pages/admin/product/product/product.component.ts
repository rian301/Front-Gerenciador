import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from 'src/app/app.material';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { ProductModel } from 'src/app/models/product.model';
import { UtilitariosService, NavigationService } from 'src/app/services';
import { ProductService } from 'src/app/services/admin/product.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent extends OnDestroySubscriptions implements OnInit {
  form: FormGroup;
  title: string = "Novo Produto";
  loading: boolean = false;
  startDate = new Date(1990, 0, 1);
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProductModel,
    private _dialogRef: MatDialogRef<ProductComponent>,
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _productService: ProductService
  ) { 
    super();

    this.form = this._formbuilder.group(new ProductModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["quantityCustomers"].clearValidators();
  }

  ngOnInit(): void {   
    if (this.data.id != null) {
      this.load();
    }
  }

  load() {
    this._productService.find(this.data.id)
      .toPromise()
      .then((ret) => {
        this.form.patchValue(ret);
        this.title = "Editar Produto";
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
    let model = <ProductModel>this.form.value;
    this._productService.save(model)
      .toPromise()
      .then((resp: ProductModel) => {
        if (resp != null) {
          this._dialogRef.close();
          this.loading = false;
          this._snackBar.open(model.id > 0 ? `Produto atualizado com sucesso!` : `Produto salvo com sucesso!`);
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
