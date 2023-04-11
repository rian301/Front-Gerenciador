import { Injectable, EventEmitter } from "@angular/core";
import { Subscription } from "rxjs";
import { UserPermissionModel } from "src/app/models";
import { AutenticacaoService } from "../auth/autenticacao.service";

@Injectable()
export class PermissionService {
	private permissions: UserPermissionModel[] = [];
	permissionsChanged: EventEmitter<boolean>;
	isLoaded: boolean = false;
	private permissionChangedSubscription: Subscription;

	constructor(
		private _loginService: AutenticacaoService
	) {
		this.permissionsChanged = new EventEmitter<boolean>();
		if (this._loginService.isLogado)
			this.loadPermissions();
	}

	loadPermissions() {
		return new Promise((resolve, reject) => {
			this._loginService
				.loadUserPermissions()
				.toPromise()
				.then(ret => {
					this.permissions = ret
					this.isLoaded = true;
					this.permissionsChanged.emit(true);
					resolve(ret);
				})
				.catch(error => reject(error));
		});
	}

	isValid(permission: string) {		
		var existPermission = this.permissions.find(x => x.constPermission == permission) == null ? false : true;		
		return existPermission;
	}

	isValidAsync(permission: string) {
		return new Promise<boolean>((resolve, reject) => {
			if (this.isLoaded) {
				resolve(this.isValid(permission));
			}
			else {
				this.permissionChangedSubscription = this.permissionsChanged.subscribe(ret => {
					resolve(this.isValid(permission));
					this.permissionChangedSubscription.unsubscribe();
				})
			}
		});
	}
}

