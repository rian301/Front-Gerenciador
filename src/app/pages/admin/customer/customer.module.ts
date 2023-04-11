import { NgModule } from "@angular/core";
import { NgxMaskModule } from "ngx-mask";
import { CustomerService } from "src/app/services/admin/customer.service";
import { SharedAdminModule } from "src/app/shared/shared-admin.module";
import { CustomerListComponent } from "./customer-list/customer-list.component";
import { CustomerRoutingModule } from "./customer.routing";
import { CustomerComponent } from "./customer/customer.component";
import { ModalUploadCustomerComponent } from './modal-upload-customer/modal-upload-customer.component';
import { CustomerLaunchComponent } from './customer-launch/customer-launch.component';
import { CustomerLauncService } from "src/app/services/admin/customer-launch.service";
import { CustomerProductService } from "src/app/services/admin/customer-product.service";
import { CustomerProductComponent } from './customer-product/customer-product.component';
import { ProductService } from "src/app/services/admin/product.service";
import { CustomerAwardComponent } from './customer-award/customer-award.component';
import { CustomerAwardService } from "src/app/services/admin/customer-award.service";
import { AwardService } from "src/app/services/admin/award.service";
import { CustomerPaymentService } from "src/app/services/admin/customer-payment.service";
import { CustomerPaymentComponent } from './customer-payment/customer-payment.component';
import { PaymentMethodService } from "src/app/services/admin/payment-method.service";

@NgModule({
    imports: [
        SharedAdminModule,
        CustomerRoutingModule,
        NgxMaskModule.forRoot()
    ],
    declarations: [
        CustomerListComponent,
        CustomerComponent,
        ModalUploadCustomerComponent,
        CustomerLaunchComponent,
        CustomerProductComponent,
        CustomerAwardComponent,
        CustomerPaymentComponent,
    ],
    providers: [
        CustomerService,
        CustomerLauncService,
        CustomerProductService,
        ProductService,
        CustomerAwardService,
        AwardService,
        CustomerPaymentService,
        PaymentMethodService
    ]
})
export class CustomerModule { }
