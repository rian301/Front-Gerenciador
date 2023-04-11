import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { AuthGuard } from 'src/app/services/auth/auth.guard';
import { ApplicationListComponent } from './application/application-list/application-list.component';
import { ApplicationComponent } from './application/application/application.component';
import { DailyPaymentListComponent } from './daily-payment/daily-payment-list/daily-payment-list.component';
import { DailyPaymentComponent } from './daily-payment/daily-payment/daily-payment.component';
import { DocumentListComponent } from './document/document-list/document-list.component';
import { DocumentComponent } from './document/document/document.component';
import { ExpenseCategoryListComponent } from './expense-category/expense-category-list/expense-category-list.component';
import { ExpenseControlListComponent } from './expense-control/expense-control-list/expense-control-list.component';
import { ExpenseControlComponent } from './expense-control/expense-control/expense-control.component';
import { PaymentMethodListComponent } from './payment-method/payment-method-list/payment-method-list.component';
import { PendencyListComponent } from './pendency/pendency-list/pendency-list.component';
import { PendencyComponent } from './pendency/pendency/pendency.component';
import { ProviderListComponent } from './provider/provider-list/provider-list.component';
import { ProviderComponent } from './provider/provider/provider.component';
import { PurchaseControlListComponent } from './purchase-control/purchase-control-list/purchase-control-list.component';
import { PurchaseControlComponent } from './purchase-control/purchase-control/purchase-control.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'gastos-externos',
        pathMatch: 'full'
      },
      {
        path: 'gastos-externos',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.EXPANSE_CONTROL_VIEW },
        component: ExpenseControlListComponent
      },
      {
        path: 'forma-pagamento',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.PAYMENT_METHOD_ADD },
        component: PaymentMethodListComponent
      },
      {
        path: 'fornecedor',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.PROVIDER_ADD },
        component: ProviderListComponent
      },
      {
        path: 'fornecedor/novo',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.PROVIDER_ADD },
        component:  ProviderComponent
      },
      {
        path: 'fornecedor/:id',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.PROVIDER_ADD },
        component:  ProviderComponent
      },
      {
        path: 'categoria',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.EXPENSE_CATEGORY_VIEW },
        component: ExpenseCategoryListComponent
      },
      {
        path: 'gastos-externos',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.EXPANSE_CONTROL_VIEW },
        component: ExpenseControlListComponent
      },
      {
        path: 'gastos-externos/novo',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.EXPANSE_CONTROL_ADD },
        component:  ExpenseControlComponent
      },
      {
        path: 'gastos-externos/:id',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.EXPANSE_CONTROL_ADD },
        component:  ExpenseControlComponent
      },
      {
        path: 'pagamento-diario',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.DAILY_PAYMENT_VIEW },
        component: DailyPaymentListComponent
      },
      {
        path: 'pagamento-diario/novo',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.DAILY_PAYMENT_ADD },
        component:  DailyPaymentComponent
      },
      {
        path: 'pagamento-diario/:id',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.DAILY_PAYMENT_ADD },
        component:  DailyPaymentComponent
      },
      {
        path: 'documento',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.DAILY_PAYMENT_VIEW },
        component: DocumentListComponent
      },
      {
        path: 'documento/novo',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.DAILY_PAYMENT_ADD },
        component:  DocumentComponent
      },
      {
        path: 'documento/:id',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.DAILY_PAYMENT_ADD },
        component:  DocumentComponent
      },
      {
        path: 'controle-compras',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.PURCHASE_CONTROL_VIEW },
        component: PurchaseControlListComponent
      },
      {
        path: 'controle-compras/novo',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.PURCHASE_CONTROL_ADD },
        component:  PurchaseControlComponent
      },
      {
        path: 'controle-compras/:id',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.PURCHASE_CONTROL_ADD },
        component:  PurchaseControlComponent
      },
      {
        path: 'pendencias',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.PENDENCY_VIEW },
        component: PendencyListComponent
      },
      {
        path: 'pendencia/novo',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.PENDENCY_ADD },
        component:  PendencyComponent
      },
      {
        path: 'pendencia/:id',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.PENDENCY_ADD },
        component:  PendencyComponent
      },
      {
        path: 'app',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.APP_VIEW },
        component: ApplicationListComponent
      },
      {
        path: 'app/novo',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.APP_ADD },
        component:  ApplicationComponent
      },
      {
        path: 'app/:id',
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.APP_ADD },
        component:  ApplicationComponent
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

export class FinancialRoutingModule {

}
