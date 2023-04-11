import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { AuthGuard } from 'src/app/services/auth/auth.guard';
import { ClassListComponent } from './class-list/class-list.component';
import { ClassComponent } from './class/class.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.CLASS_VIEW },
    component: ClassListComponent
  },
  {
    path: 'novo',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.CLASS_ADD },
    component: ClassComponent
  },
  {
    path: ':id',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.CLASS_ADD },
    component: ClassComponent
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

export class ClassRoutingModule {

}
