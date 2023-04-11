import { Component, Input } from "@angular/core";
import { CustomerStatusEnum } from "src/app/enums/customer-status.enum";

@Component({
    selector: 'app-status-badge-customer',
    templateUrl: './status-badge-customer.component.html'    
  })
  export class StatusBadgeCustomerComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof CustomerStatusEnum = CustomerStatusEnum;
  }