import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutenticacaoService, NavigationService, UtilitariosService } from 'src/app/services';
import { MatButton } from 'src/app/app.material';
import { ActivatedRoute } from '@angular/router';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html'	
})
export class ResetPasswordComponent extends OnDestroySubscriptions implements OnDestroy {
	@ViewChild(MatButton) submitButton: MatButton;
	form: FormGroup;
	private code: string;
	email: string;

	constructor(
		private _autenticacaoService: AutenticacaoService,
		private _navigationService: NavigationService,
		private _utilitariosService: UtilitariosService,
		private _formBuilder: FormBuilder,
		private _activatedRoute: ActivatedRoute
		
	) {
		super();

		this.form = this._formBuilder.group({			
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			code: ['']
		});

		this.form.controls.email.disable();		

		let sub = this._activatedRoute.queryParams
			.subscribe(param => {
				if (param['code'] != undefined)
					this.code = param['code'];
				else
					this._navigationService.login();

				if (param['email'] != undefined)
					this.form.controls.email.setValue(param['email']);
			});

		this.subscriptions.add(sub);
	}

	ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	submitEmail() {
		if (this.form.valid) {
			this.submitButton.disabled = true;
						
			this.form.controls.code.setValue(this.code);
			let data = this.form.value;
			data.email = this.form.controls.email.value;

			this._autenticacaoService.ResetPassword(data)
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
