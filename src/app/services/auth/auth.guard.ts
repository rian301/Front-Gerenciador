import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AutenticacaoService } from './autenticacao.service';
import { NavigationService } from '../common/navigation.service';
import { PermissionService } from '../admin/permission.service';
import { UtilitariosService } from '../common/utilitarios.service';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private router: Router,
		private _utilitariosService: UtilitariosService,
		private _autenticacaoService: AutenticacaoService,
		private _permissionService: PermissionService,
		private _navigationService: NavigationService) { }


	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return new Promise((resolve) => {			
			if (route.data.permission != null) {
				var dataPermission = route.data.permission;
				this._permissionService.isValidAsync(dataPermission)
					.then(permission => {
						this.validateIslogged(resolve, permission);
					});
			} else {
				this.validateIslogged(resolve, true);
			}
		});
	}

	private validateIslogged(resolve: (value?: boolean | PromiseLike<boolean>) => void, permission: boolean) {
		if (this._autenticacaoService.isLogado) {
			if (permission == false) {
				this._utilitariosService.SnackAlert(`Suas permissões não lhe dão acesso ao recurso solicitado.`, 'error');
				this.router.navigate(['/dashboard']);
				resolve(false);
			} else
				resolve(true);
		}
		else {
			this._navigationService.login();
			resolve(false);
		}
	}
}
