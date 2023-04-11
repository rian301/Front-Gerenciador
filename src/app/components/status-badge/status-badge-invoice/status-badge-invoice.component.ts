import { Component, Input } from "@angular/core";
import { InvoiceStatusEnum } from "src/app/enums";

@Component({
    selector: 'app-status-badge-invoice',
    templateUrl: './status-badge-invoice.component.html'    
  })
  export class StatusBadgeInvoiceComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof InvoiceStatusEnum = InvoiceStatusEnum;
  }