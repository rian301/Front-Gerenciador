import { Component, Input } from "@angular/core";
import { PartnerStatusEnum } from "src/app/enums/partner.status.enum";

@Component({
    selector: 'app-status-badge-partner',
    templateUrl: './status-badge-partner.component.html'    
  })
  export class StatusBadgePartnerComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof PartnerStatusEnum = PartnerStatusEnum;
  }