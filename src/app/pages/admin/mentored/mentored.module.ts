import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { ExpenseControlService } from 'src/app/services/admin/expense-control.service';
import { MentoredCompanyService } from 'src/app/services/admin/mentored-company.service';
import { MentoredService } from 'src/app/services/admin/mentored.service';
import { SharedAdminModule } from 'src/app/shared/shared-admin.module';
import { MentoredListComponent } from './mentored-list/mentored-list.component';
import { MentoredRoutingModule } from './mentored.routing';
import { MentoredComponent } from './mentored/mentored.component';
import { MentoredCompanyComponent } from './mentored-company/mentored-company.component';
import { PaymentMethodService } from 'src/app/services/admin/payment-method.service';
import { MentoredContractComponent } from './mentored-contract/mentored-contract.component';
import { MentoredPaymentService } from 'src/app/services/admin/mentored-payment.service';
import { MentoredPaymentComponent } from './mentored-payment/mentored-payment.component';
import { MentoredSubscriptionComponent } from './mentored-subscription/mentored-subscription.component';
import { ProductService } from 'src/app/services/admin/product.service';
import { MentoredSubscriptionService } from 'src/app/services/admin/mentored-subscription.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { InvoiceService } from 'src/app/services/admin/invoice.service';
import { MentoredViewModalComponent } from './mentored-view-modal/mentored-view-modal.component';
import { CompanyService } from 'src/app/services/admin/company.service';
import { MentoredAwardComponent } from './mentored-award/mentored-award.component';
import { MentoredAwardService } from 'src/app/services/admin/mentored-award.service';
import { AwardService } from 'src/app/services/admin/award.service';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    SharedAdminModule,
    MentoredRoutingModule,
    NgxMaskModule.forRoot(),
    CurrencyMaskModule,
    DragDropModule,
  ],
  declarations: [
     MentoredListComponent,
     MentoredComponent,
     MentoredCompanyComponent,
     MentoredContractComponent,
     MentoredPaymentComponent,
     MentoredSubscriptionComponent,
     MentoredViewModalComponent,
     MentoredAwardComponent,
  ],
  providers: [
    MentoredService,
    MentoredCompanyService,
    PaymentMethodService,
    MentoredPaymentService,
    ProductService,
    MentoredSubscriptionService,
    InvoiceService,
    CompanyService,
    MentoredAwardService,
    AwardService,
  ]
})
export class  MentoredModule { }
