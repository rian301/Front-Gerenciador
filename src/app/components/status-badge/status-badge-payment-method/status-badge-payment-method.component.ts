import { Component, Input } from "@angular/core";
import { PartnerStatusEnum } from "src/app/enums/partner.status.enum";
import { PaymentTypeStatusEnum } from "src/app/enums/payment-type.enum";

@Component({
    selector: 'app-status-badge-payment-method',
    templateUrl: './status-badge-payment-method.component.html'    
  })
  export class StatusBadgePaymentMethodComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof PaymentTypeStatusEnum = PaymentTypeStatusEnum;
  }