import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from 'src/app/app.material';
import { ChangePasswordModel, LoginModel } from 'src/app/models';
import { AutenticacaoService, UtilitariosService } from 'src/app/services';
import { UserService } from 'src/app/services/admin/user.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;

  constructor(
    private _authService: AutenticacaoService,
    private _usuarioService: UserService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _autenticacaoService: AutenticacaoService,
    private _utilService: UtilService,
    private _utilitariosService: UtilitariosService
  ) {
    this.gerarForm();
  }

  ngOnInit() {

  }

  gerarForm() {
    this.form = this._formBuilder.group({
      codigoUsuario: [this._authService.usuario.user_id],
      senhaAntiga: [null, Validators.required],
      novaSenha: [null, Validators.required],
      ConfirmacaoNovaSenha: [null, Validators.required],
    });
  }

  alterarSenha() {
    if (!this.form.valid) {
      this._utilService.FormValidate(this.form);
      return;
    }

    if (this.form.value.novaSenha == this.form.value.ConfirmacaoNovaSenha) {
      let model = new
        ChangePasswordModel(this.form.value.senhaAntiga, null, this.form.value.novaSenha, this.form.value.ConfirmacaoNovaSenha);

      this._usuarioService.changePassword(model).toPromise().then((retorno) => {
        if (retorno) {
          this._snackBar.open("Senha alterada com sucesso");

          let login = this._autenticacaoService.ObterFormUsuario();
          if (login != null)
            this._autenticacaoService.SalvarFormUsuario(new LoginModel(login.email, model.newPassword, login.rememberMe));

          this.form.reset();
          this.form.controls.senhaAntiga.setErrors(null);
          this.form.controls.novaSenha.setErrors(null);
          this.form.controls.ConfirmacaoNovaSenha.setErrors(null);
        }
        else
          this._snackBar.open("Senha antiga inválida");
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
            this._utilitariosService.SnackAlert(msg, 'error');
          });
      });
    }
    else
      this._snackBar.open('Nova senha e confirmação de nova senha não coincidem')
  }
}
