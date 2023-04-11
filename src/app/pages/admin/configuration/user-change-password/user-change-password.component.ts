import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangePasswordModel, UserModel } from 'src/app/models';
import { UserService } from 'src/app/services/admin/user.service';
import { UtilService } from 'src/app/services/admin/util.service';
import { FormValidators } from 'src/app/shared/common/form-validators';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.scss']
})
export class UserChangePasswordComponent implements OnInit {

  form: FormGroup;
  
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
    private _userService: UserService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.form = this._formbuilder.group({
      userId: [this.data?.id],
      name: [this.data?.name],
      newPassword: [null, [Validators.required, FormValidators.password]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  passwordChecker() {
    var password = this.form.controls.newPassword.value;
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

  salvar() {
    if (!this.form.valid) {
      this._utilService.FormValidate(this.form);
      return;
    }

    if (this.form.controls.newPassword.value != this.form.controls.confirmPassword.value) {
      this._snackBar.open("As senhas não coincidem.")
      return;
    }

    let ChangePasswordModel = <ChangePasswordModel>this.form.value;
    this._userService.changePasswordAdmin(ChangePasswordModel).toPromise().then((resp: boolean) => {
      if (resp != null) {
        this._snackBar.open(`Senha alterada com sucesso!`);
        this._dialogRef.close(resp);
      }
    });
  }
}
