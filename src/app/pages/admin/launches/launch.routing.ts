import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { AuthGuard } from 'src/app/services/auth/auth.guard';
import { LaunchListComponent } from './launch-list/launch-list.component';
import { LaunchComponent } from './launch/launch.component';

export const routes: Routes = [
  {
    path: '',
    component: LaunchListComponent
  },
  {
    path: 'novo',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.LAUNCH_VIEW },
    component: LaunchComponent
  },
  {
    path: ':id',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.LAUNCH_ADD },
    component: LaunchComponent
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

export class LaunchRoutingModule {

}
