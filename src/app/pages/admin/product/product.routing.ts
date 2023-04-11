import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { AuthGuard } from 'src/app/services/auth/auth.guard';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product/product.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.PRODUCT_VIEW },
    component: ProductListComponent
  },
  {
    path: 'novo',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.PRODUCT_ADD },
    component: ProductComponent
  },
  {
    path: ':id',
    canActivate: [AuthGuard],
    data: { permission: PermissionHelper.PRODUCT_ADD },
    component: ProductComponent
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

export class ProductRoutingModule {

}
