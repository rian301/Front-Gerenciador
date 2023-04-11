import { Component, Input } from "@angular/core";
import { AgentCompanyStatusEnum } from "src/app/enums/agent-company-status.enum";

@Component({
    selector: 'app-status-badge-agent-company',
    templateUrl: './status-badge-agent-company.component.html'    
  })
  export class StatusBadgeAgentCompanyComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof AgentCompanyStatusEnum = AgentCompanyStatusEnum;
  }