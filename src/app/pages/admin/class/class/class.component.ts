import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from 'src/app/app.material';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { ClassModel } from 'src/app/models/class.model';
import { ProductModel } from 'src/app/models/product.model';
import { UtilitariosService, NavigationService } from 'src/app/services';
import { ClassService } from 'src/app/services/admin/class.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent extends OnDestroySubscriptions implements OnInit {
  form: FormGroup;
  title: string = "Novo Aulão";
  loading: boolean = false;
  startDate = new Date(2021, 0, 1);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ClassModel,
    private _dialogRef: MatDialogRef<ClassComponent>,
    private _formbuilder: FormBuilder,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _classService: ClassService,
  ) {
    super();

    this.form = this._formbuilder.group(new ClassModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["linkClass"].clearValidators();
    this.form.controls["linkInfo"].clearValidators();
    this.form.controls["linkCopy"].clearValidators();
    this.form.controls["linkCreative"].clearValidators();
    this.form.controls["linkTraffic"].clearValidators();
    this.form.controls["linkRegister"].clearValidators();
  }

  ngOnInit(): void {
    if (this.data?.id != null) {
      this.load()
    }
  }

  load() {
    this._classService.find(this.data.id)
      .toPromise()
      .then((ret) => {
        this.form.patchValue(ret);
        this.title = "Editar Aulão";
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
    let model = <ClassModel>this.form.value;
    this._classService.save(model)
      .toPromise()
      .then((resp: ClassModel) => {
        if (resp != null) {
          this._dialogRef.close();
          this.loading = false;
          this._snackBar.open(model.id > 0 ? `Aulão atualizado com sucesso!` : `Aulão salvo com sucesso!`);
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
