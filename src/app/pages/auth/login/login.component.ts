import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LoadingService, AutenticacaoService, NavigationService, UtilitariosService, PermissionService } from 'src/app/services';
import { LoginModel } from 'src/app/models';
import { MatSnackBar } from 'src/app/app.material';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	formLogin: FormGroup;

	constructor(
		private _autenticacaoService: AutenticacaoService,
		private _loadingService: LoadingService,
		private _navigationService: NavigationService,
		private _utilitariosService: UtilitariosService,
		private _formBuilder: FormBuilder,
		private _snackBar: MatSnackBar,
		private _permissionService: PermissionService
	) {
	}

	ngOnInit() {
		this.formLogin = this._formBuilder.group(this._autenticacaoService.isFormularioSalvo ? this._autenticacaoService.ObterFormUsuario() : new LoginModel());
		Object.keys(this.formLogin.controls).forEach(prop => this.formLogin.controls[prop].setValidators(Validators.required));
	}

	entrar() {
		if (this.formLogin.valid) {
			this._loadingService.loginLoading = true;

			this._autenticacaoService.getToken(this.formLogin.value)
				.toPromise()
				.then(async ret => {

					if (ret != null) {
						this._autenticacaoService.AdicionarSessao(ret);

						if (this.formLogin.controls.rememberMe.value)
							this._autenticacaoService.SalvarFormUsuario(this.formLogin.value);

						await this._permissionService.loadPermissions();
						this._navigationService.dashboard();
					}
					else {
						this._loadingService.loginLoading = false;
						this._snackBar.open("Login ou senha inválido(s).");
					}
				})
				.catch((error) => {
					this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
						this._utilitariosService.SnackAlert(msg, 'error');
						this._loadingService.loginLoading = false;
					});
				});
		}
	}

}
