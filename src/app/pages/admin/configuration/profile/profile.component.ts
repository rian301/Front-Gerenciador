import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DinamicTableItemModel, DinamicTableModel } from 'src/app/components/dinamic-table/dinamic-table.model';
import { PermissionModel, ProfileModel } from 'src/app/models';
import { UtilitariosService } from 'src/app/services';
import { ProfileService } from 'src/app/services/admin/profile.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  form: FormGroup;
  permissoes: PermissionModel[] = [];

  sourceConta: DinamicTableModel;
  sourcePermissoes: DinamicTableModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProfileModel,
    private _dialogRef: MatDialogRef<ProfileComponent>,
    private _formbuilder: FormBuilder,
    private _profileService: ProfileService,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService
  ) { }

  ngOnInit(): void {
    this.form = this._formbuilder.group({
      id: [this.data?.id || 0],
      name: [this.data?.name || null, [Validators.required]],
    });

    this.buscarComplementos();
  }

  buscarComplementos() {
    if (this.data != null) {
      this._profileService.find(this.data.id).toPromise().then((model: ProfileModel) => {
        if (model.permissions != null)
          this.data.permissions = model.permissions;

        this.obterListaPermissoes();
      })
        .catch(error => {
          this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
            this._utilitariosService.SnackAlert(msg, 'error');
          });
        });
    }
    else {
      this.obterListaPermissoes();
    }
  }

  salvar() {
    if (!this.form.valid) {
      this._utilService.FormValidate(this.form);
      return;
    }

    let profile = <ProfileModel>this.form.value;
    profile.permissions = [];
    this.permissoes.filter(x => x.permitido == true).forEach(permission => {
      var newPermission = new PermissionModel();
      newPermission.userProfileId = profile.id;
      newPermission.permissionId = permission.id;
      profile.permissions.push(newPermission);
    });

    this._profileService.save(profile).toPromise().then((resp: ProfileModel) => {
      if (resp != null) {
        this._snackBar.open(profile.id > 0 ? `Perfil atualizado com sucesso!` : `Perfil salvo com sucesso!`);
        this._dialogRef.close(resp);
      }
    })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  obterListaPermissoes() {
    this._profileService
      .getPermissions()
      .toPromise()
      .then((resp: PermissionModel[]) => {
        if (this.data != null && this.data.permissions != null)
          this.data.permissions.forEach(permission => {
            resp.find(x => x.id == permission.permissionId).permitido = true;
          });

        this.permissoes = resp;
        this.sourcePermissoes = new DinamicTableModel([new DinamicTableItemModel('name', 'Nome')], resp);
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  atualizarStatusPermissao(item: PermissionModel) {
    item.permitido = !item.permitido;
  }
}
