import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from 'src/app/app.material';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { LaunchModel } from 'src/app/models/launch.model';
import { UtilitariosService, NavigationService } from 'src/app/services';
import { LaunchService } from 'src/app/services/admin/launcher.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.scss']
})
export class LaunchComponent extends OnDestroySubscriptions implements OnInit {
  form: FormGroup;
  id: number = null;
  title: string = "Novo Lançamento";
  startDate = new Date(2021, 0, 1);

  loading: boolean = false;

  constructor(
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _navigationService: NavigationService,
    private _lauchService: LaunchService,
  ) {
    super();

    this.form = this._formbuilder.group(new LaunchModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["topCriative"].clearValidators();
    this.form.controls["note"].clearValidators();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id != null) {
          this.load();
        }
      })
    );   
  }

  load() {
    this._lauchService.find(this.id)
      .toPromise()
      .then((ret) => {
        this.form.patchValue(ret);
        this.title = "Editar Lançamento";
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
    let model = <LaunchModel>this.form.value;
    this._lauchService.save(model)
      .toPromise()
      .then((resp: LaunchModel) => {
        if (resp != null) {
          this._navigationService.lauchList();
          this.loading = false;
          this._snackBar.open(model.id > 0 ? `Lançamento atualizado com sucesso!` : `Lançamento salvo com sucesso!`);
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
    this._navigationService.lauchList();
  }

}
