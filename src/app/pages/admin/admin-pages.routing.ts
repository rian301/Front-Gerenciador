import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from '../../layouts/admin/admin.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthGuard } from 'src/app/services';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'alterar-senha',
        component: ChangePasswordComponent
      },
      {
        path: 'configuracao',
        loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule)
      },
      {
        path: 'alunos',
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
      },
      {
        path: 'lancamentos',
        loadChildren: () => import('./launches/launch.module').then(m => m.LaunchModule)
      },
      {
        path: 'produtos',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'premiacao',
        loadChildren: () => import('./award/award.module').then(m => m.AwardModule)
      },
      {
        path: 'auloes',
        loadChildren: () => import('./class/class.module').then(m => m.ClassModule)
      },
      {
        path: 'financeiro',
        loadChildren: () => import('./financial/financial.module').then(m => m.FinancialModule)
      },
      {
        path: 'rh',
        loadChildren: () => import('./rh/rh.module').then(m => m.RhModule)
      },
      {
        path: 'patrimonio',
        loadChildren: () => import('./patrimony/patrimony.module').then(m => m.PatrimonyModule)
      },
      {
        path: 'mentoria',
        loadChildren: () => import('./mentored/mentored.module').then(m => m.MentoredModule)
      },
      {
        path: 'relatorios',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      },
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

export class AdminRoutingModule {

}
