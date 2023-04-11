// import { Injectable } from '@angular/core';
// import { PermissionService } from '../admin/permission.service';
// import { NavigationService } from './navigation.service';
// import { UtilitariosService } from './utilitarios.service';

// @Injectable()
// export class ValidPermissionService {

//   constructor(
//     private _permissionService: PermissionService,
//     private _navigationService: NavigationService,
//     private _utilitariosService: UtilitariosService
//   ) { }


//   hasPermission(permission: string): boolean {
//     const permissions = this._permissionService.readPermissions();
//     var valid = permissions?.filter((perm) => perm.constPermission === permission)[0] != null;
//     if (!valid) {
//       this._navigationService.dashboard();
//       this._utilitariosService.SnackAlert('Você não tem permissão para acessar esta rotina. Contate um administrador.', 'error');
//     }
//     return valid;
//   }
// }
