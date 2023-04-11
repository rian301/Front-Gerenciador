import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { AuthGuard } from 'src/app/services/auth/auth.guard';
import { MentoredListComponent } from './mentored-list/mentored-list.component';
import { MentoredComponent } from './mentored/mentored.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.MENTORED_VIEW },
    component: MentoredListComponent
  },
  {
    path: 'novo',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.MENTORED_ADD },
    component: MentoredComponent
  },
  {
    path: ':id',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.MENTORED_ADD },
    component: MentoredComponent
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

export class MentoredRoutingModule {

}
