import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatSelectChange, MatSnackBar, MAT_DIALOG_DATA } from 'src/app/app.material';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { CustomerLaunchModel } from 'src/app/models/customer-launch.model';
import { CustomerProductModel } from 'src/app/models/customer-product.model';
import { ProductModel } from 'src/app/models/product.model';
import { UtilitariosService } from 'src/app/services';
import { CustomerLauncService } from 'src/app/services/admin/customer-launch.service';
import { CustomerProductService } from 'src/app/services/admin/customer-product.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-customer-product',
  templateUrl: './customer-product.component.html',
  styleUrls: ['./customer-product.component.scss']
})
export class CustomerProductComponent extends OnDestroySubscriptions implements OnInit {
  form: FormGroup;
  startDate = new Date(2021, 0, 1);
  id: number = null;
  title: string = "Novo Produto";
  products: ProductModel[] = [];
  loading: boolean = false;
  productId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CustomerProductModel,
    private _dialogRef: MatDialogRef<CustomerProductComponent>,
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _service: CustomerProductService,
    private _utilitariosService: UtilitariosService,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _productervice: ProductService,
  ) {
    super();

    this.form = this._formbuilder.group(new CustomerProductModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
  }

  ngOnInit(): void {        
    this.loadProducts();
    if (this.data.id != null)
      this.load();

    if (this.data.customerId != null){}
      this.form.controls.customerId.setValue(this.data.customerId);
  }

  loadProducts() {
    this.loading = true;
    this._productervice
      .get()
      .toPromise()
      .then((resp: ProductModel[]) => {
        this.loading = false;
        this.products = resp;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  load() {
    this._service.findProductByCustomerById(this.data.customerId, this.data.id)
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
      this._utilService.FormValidate(this.form);
      return;
    }
    this.loading = true;
    this._service.save(this.form.value)
      .toPromise()
      .then((resp: CustomerProductModel) => {
        if (resp != null) {
          this.loading = false;
          this._snackBar.open(this.form.controls.id.value > 0 ? `Informações atualizada com sucesso!` : `Informações salvas com sucesso!`);
          this._dialogRef.close(resp);
        }
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  productSelect(item: MatSelectChange) {    
    if (item.value != null) {
      this.form.controls.name.setValue(this.products[item.value-1].name);
      this.form.controls.productId.setValue(this.products[item.value-1].id);
    }
  }

  cancel() {
    this._dialogRef.close();
  }
}
