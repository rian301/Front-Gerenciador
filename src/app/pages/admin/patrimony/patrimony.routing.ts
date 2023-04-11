import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { AuthGuard } from 'src/app/services/auth/auth.guard';
import { CategoryBensListComponent } from './category-bens-list/category-bens-list.component';
import { CategoryBensComponent } from './category-bens/category-bens.component';
import { PatrimonyListComponent } from './patrimony-list/patrimony-list.component';
import { PatrimonyComponent } from './patrimony/patrimony.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'patrimonios',
        pathMatch: 'full'
      },
      {
        path: 'patrimonios',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.PATRIMONY_VIEW },
        component: PatrimonyListComponent        
      },
      {
        path: 'patrimonios/novo',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.PATRIMONY_VIEW },
        component: PatrimonyComponent        
      },
      {
        path: 'patrimonios/:id',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.PATRIMONY_VIEW },
        component: PatrimonyComponent        
      },
      {
        path: 'categoria-bens',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.CATEGORY_BENS_VIEW },
        component: CategoryBensListComponent        
      },
      {
        path: 'categoria-bens/novo',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.CATEGORY_BENS_ADD },
        component:  CategoryBensComponent
      },
      {
        path: 'categoria-bens/:id',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.CATEGORY_BENS_ADD },
        component:  CategoryBensComponent
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

export class PatrimonyRoutingModule {

}
