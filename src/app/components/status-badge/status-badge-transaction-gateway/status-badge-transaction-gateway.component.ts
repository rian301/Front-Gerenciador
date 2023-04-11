import { Component, Input } from "@angular/core";
import { TransactionGatewayStatusEnum } from "src/app/enums/status-badge-transaction-gateway.component.enum";

@Component({
    selector: 'status-badge-transaction-gateway',
    templateUrl: './status-badge-transaction-gateway.component.html'    
  })
  export class StatusBadgeTransactionGatewayComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof TransactionGatewayStatusEnum = TransactionGatewayStatusEnum;
  }