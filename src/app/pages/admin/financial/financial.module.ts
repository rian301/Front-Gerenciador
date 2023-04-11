import { NgModule } from '@angular/core';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxMaskModule } from 'ngx-mask';
import { ExpenseControlService } from 'src/app/services/admin/expense-control.service';
import { LaunchService } from 'src/app/services/admin/launcher.service';
import { PaymentMethodService } from 'src/app/services/admin/payment-method.service';
import { ProviderService } from 'src/app/services/admin/provider.service';
import { SharedAdminModule } from 'src/app/shared/shared-admin.module';
import { ExpenseControlListComponent } from './expense-control/expense-control-list/expense-control-list.component';
import { ExpenseControlComponent } from './expense-control/expense-control/expense-control.component';
import { FinancialRoutingModule } from './financial.routing';
import { PaymentMethodListComponent } from './payment-method/payment-method-list/payment-method-list.component';
import { PaymentMethodComponent } from './payment-method/payment-method/payment-method.component';
import { ProviderListComponent } from './provider/provider-list/provider-list.component';
import { ProviderComponent } from './provider/provider/provider.component';
import { ExpenseCategoryListComponent } from './expense-category/expense-category-list/expense-category-list.component';
import { ExpenseCategoryComponent } from './expense-category/expense-category/expense-category.component';
import { ExpenseCategoryService } from 'src/app/services/admin/expense-category.service';
import { ModalPdfComponent } from './expense-control/modal-pdf/modal-pdf.component';
import { SafePipe } from 'src/app/helpers/safe-pipe.helper';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DailyPaymentListComponent } from './daily-payment/daily-payment-list/daily-payment-list.component';
import { DailyPaymentComponent } from './daily-payment/daily-payment/daily-payment.component';
import { DailyPaymentService } from 'src/app/services/admin/daily-payment.service';
import { DailyPaymentDocComponent } from './daily-payment/daily-payment-doc/daily-payment-doc.component';
import { ModalViewComponent } from './expense-control/modal-view/modal-view.component';
import { DocumentListComponent } from './document/document-list/document-list.component';
import { DocumentComponent } from './document/document/document.component';
import { DocumentService } from 'src/app/services/admin/document.service';
import { PurchaseControlComponent } from './purchase-control/purchase-control/purchase-control.component';
import { PurchaseControlListComponent } from './purchase-control/purchase-control-list/purchase-control-list.component';
import { PurchaseControlService } from 'src/app/services/admin/purchase-control.service';
import { ModalDocPurchaseComponent } from './purchase-control/modal-doc-purchase/modal-doc-purchase.component';
import { PendencyComponent } from './pendency/pendency/pendency.component';
import { PendencyListComponent } from './pendency/pendency-list/pendency-list.component';
import { PendencyService } from 'src/app/services/admin/pedency.service';
import { PendencyDocComponent } from './pendency/pendency-doc/pendency-doc.component';
import { ApplicationListComponent } from './application/application-list/application-list.component';
import { ApplicationComponent } from './application/application/application.component';
import { ApplicationService } from 'src/app/services/admin/application.service';

@NgModule({
  imports: [
    SharedAdminModule,
    FinancialRoutingModule,
    NgxMaskModule.forRoot(),
    CurrencyMaskModule,
    PdfViewerModule,
  ],
  declarations: [
    ExpenseControlListComponent,
    ExpenseControlComponent,
    PaymentMethodComponent,
    PaymentMethodListComponent,
    ProviderListComponent,
    ProviderComponent,
    ExpenseCategoryListComponent,
    ExpenseCategoryComponent,
    DailyPaymentComponent,
    DailyPaymentListComponent,
    DailyPaymentDocComponent,
    ModalPdfComponent,
    SafePipe,
    ModalViewComponent,
    DocumentListComponent,
    DocumentComponent,
    PurchaseControlComponent,
    PurchaseControlListComponent,
    ModalDocPurchaseComponent,
    PendencyComponent,
    PendencyListComponent,
    PendencyDocComponent,
    ApplicationListComponent,
    ApplicationComponent
  ],
  providers: [
    ExpenseControlService,
    PaymentMethodService,
    ProviderService,
    ExpenseCategoryService,
    DailyPaymentService,
    DocumentService,
    PurchaseControlService,
    PendencyService,
    ApplicationService
  ]
})
export class FinancialModule { }
