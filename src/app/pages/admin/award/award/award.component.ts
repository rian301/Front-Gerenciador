import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from 'src/app/app.material';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { AwardModel } from 'src/app/models/award.model';
import { UtilitariosService } from 'src/app/services';
import { AwardService } from 'src/app/services/admin/award.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrls: ['./award.component.scss']
})
export class AwardComponent extends OnDestroySubscriptions implements OnInit {
  form: FormGroup;
  title: string = "Novo Prêmio";
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AwardModel,
    private _dialogRef: MatDialogRef<AwardComponent>,
    private _formbuilder: FormBuilder,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _awardService: AwardService,
  ) {
    super();

    this.form = this._formbuilder.group(new AwardModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
  }

  ngOnInit(): void {
    if (this.data?.id != null) {
      this.load()
    }
  }

  load() {
    this._awardService.find(this.data.id)
      .toPromise()
      .then((ret) => {
        this.form.patchValue(ret);
        this.title = "Editar Prêmio";
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
    let model = <AwardModel>this.form.value;
    this._awardService.save(model)
      .toPromise()
      .then((resp: AwardModel) => {
        if (resp != null) {
          this._dialogRef.close();
          this.loading = false;
          this._snackBar.open(model.id > 0 ? `Prêmio atualizado com sucesso!` : `Prêmio salvo com sucesso!`);
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
