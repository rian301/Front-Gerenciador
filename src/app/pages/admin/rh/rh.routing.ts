import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { AuthGuard } from 'src/app/services/auth/auth.guard';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeComponent } from './employee/employee/employee.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'colaboradores',
        pathMatch: 'full'
      },
      {
        path: 'colaboradores',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.EMPLOYEE_VIEW },
        component: EmployeeListComponent        
      },
      {
        path: 'colaboradores/novo',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.EMPLOYEE_ADD },
        component:  EmployeeComponent
      },
      {
        path: 'colaboradores/:id',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.EMPLOYEE_ADD },
        component:  EmployeeComponent
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

export class EmployeeRoutingModule {

}
