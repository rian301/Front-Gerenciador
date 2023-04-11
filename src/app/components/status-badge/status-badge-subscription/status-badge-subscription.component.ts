import { Component, Input } from "@angular/core";
import { SubscriptionStatusEnum } from "src/app/enums";

@Component({
    selector: 'app-status-badge-subscription',
    templateUrl: './status-badge-subscription.component.html'    
  })
  export class StatusBadgeSubscriptionComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof SubscriptionStatusEnum = SubscriptionStatusEnum;
  }