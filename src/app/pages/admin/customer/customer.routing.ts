import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { AuthGuard } from 'src/app/services/auth/auth.guard';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerComponent } from './customer/customer.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.CUSTOMER_VIEW },
    component: CustomerListComponent
  },
  {
    path: 'novo',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.CUSTOMER_ADD },
    component: CustomerComponent
  },
  {
    path: ':id',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.CUSTOMER_ADD },
    component: CustomerComponent
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

export class CustomerRoutingModule {

}
