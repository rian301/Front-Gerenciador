import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileModel, UserModel } from 'src/app/models';
import { UtilitariosService } from 'src/app/services';
import { ProfileService } from 'src/app/services/admin/profile.service';
import { UserService } from 'src/app/services/admin/user.service';
import { UtilService } from 'src/app/services/admin/util.service';
import { FormValidators } from 'src/app/shared/common/form-validators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  form: FormGroup;
  perfis: ProfileModel[] = [];

  password: any = '';
  minCharacter: number = 8;
  hasUpperCase: boolean = false;
  hasNumber: boolean = false;
  hasSpecial: boolean = false;
  hasMinCharacters: boolean = false;
  passwordValidate: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserModel,
    private _dialogRef: MatDialogRef<UserComponent>,
    private _formbuilder: FormBuilder,
    private _utilService: UtilService,
    private _profileService: ProfileService,
    private _userService: UserService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService
  ) { }

  ngOnInit(): void {
    this.form = this._formbuilder.group({
      id: [this.data?.id || 0],
      name: [this.data?.name || null, [Validators.required]],
      email: [this.data?.email || null, [Validators.required]],      
      userProfileId: [this.data?.userProfileId || null, [Validators.required]],
      active: [this.data?.active || false, [Validators.required]],
    });

    if(this.data == null) {
      this.form.addControl('password', new FormControl(null, FormValidators.password));
      this.form.addControl('confirmPassword', new FormControl(null));
    }

    this.obterListaPerfis();
    this.buscarCpf();
  }

  passwordChecker() {
    var password = this.form.controls.password.value;
    // this.hasUpperCase = password.match(/[a-z]/g) && password.match(/[A-Z]/g) ? true : false;
    // this.hasNumber = password.match(/[0-9]/g) ? true : false;
    // this.hasSpecial = password.match(/[^A-Za-z0-9]/g) ? true : false;
    this.hasMinCharacters = password.length >= this.minCharacter ? true : false;
    if (
      // this.hasUpperCase &&
      // this.hasNumber &&
      // this.hasSpecial &&
      this.hasMinCharacters
    ) {
      this.passwordValidate = true;
    }
    else
      this.passwordValidate = false;
  }


  buscarCpf() {
    if (this.data != null)
      this._userService.find(this.data.id).toPromise().then((model: UserModel) => this.form.controls.cpf.setValue(model.cpf));
  }

  obterListaPerfis() {
    this._profileService
      .get()
      .toPromise()
      .then((resp: ProfileModel[]) => this.perfis = resp);
  }

  salvar() {
    if (!this.form.valid) {
      this._utilService.FormValidate(this.form);
      return;
    }

    if (this.data == null) {
      
      if (!this.passwordValidate)
        return this._utilitariosService.SnackAlert('Senha não possui critérios mínimos', 'error');
  
      if (this.form.controls.password.value != this.form.controls.confirmPassword.value) {
        this._snackBar.open("As senhas não coincidem.")
        return;
      }
    }

    let user = <UserModel>this.form.value;
    this._userService.save(user).toPromise().then((resp: UserModel) => {
      if (resp != null) {
        this._snackBar.open(user.id > 0 ? `Usuário atualizado com sucesso!` : `Usuário salvo com sucesso!`);
        this._dialogRef.close(resp);
      }
    });
  }
}
