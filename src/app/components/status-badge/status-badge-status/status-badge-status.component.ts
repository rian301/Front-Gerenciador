import { Component, Input } from "@angular/core";
import { AgentStatusEnum } from "src/app/enums";
import { StatusTypeEnum } from "src/app/enums/status.enum";

@Component({
    selector: 'app-status-badge-status',
    templateUrl: './status-badge-status.component.html'    
  })
  export class StatusBadgeStatusComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof StatusTypeEnum = StatusTypeEnum;
  }