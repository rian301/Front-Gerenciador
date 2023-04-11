import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutenticacaoService, NavigationService, UtilitariosService } from 'src/app/services';
import { MatButton } from 'src/app/app.material';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html'	
})
export class ForgotPasswordComponent implements OnInit {
	@ViewChild(MatButton) submitButton: MatButton;
	form: FormGroup;

	constructor(
		private _autenticacaoService: AutenticacaoService,
		private _navigationService: NavigationService,
		private _utilitariosService: UtilitariosService,
		private _formBuilder: FormBuilder
		
	) {
	}

	ngOnInit() {
		this.form = this._formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
		});
	}

	submitEmail() {
		if (this.form.valid) {
			this.submitButton.disabled = true;
			
			this._autenticacaoService.ForgotPassword(this.form.value.email)
				.toPromise()
				.then(ret => {
					this._utilitariosService.SnackAlert(ret.message, "success");
					this._navigationService.login();
				})
				.catch((error) => {
					this.submitButton.disabled = false;
					this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
						this._utilitariosService.SnackAlert(msg, 'error');
					});
				});
		}
	}

}
