import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { AuthGuard } from 'src/app/services/auth/auth.guard';
import { ProfileListComponent } from './profile-list/profile-list.component';
import { UserListComponent } from './user-list/user-list.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'perfil',
        pathMatch: 'full'
      },
      {
        path: 'perfil',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.USER_PROFILE_VIEW },
        component: ProfileListComponent        
      },
      {
        path: 'usuarios',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.USER_VIEW },
        component: UserListComponent        
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class ConfigurationRoutingModule {

}
