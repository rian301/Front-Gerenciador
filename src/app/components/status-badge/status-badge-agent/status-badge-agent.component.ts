import { Component, Input } from "@angular/core";
import { AgentStatusEnum } from "src/app/enums";

@Component({
    selector: 'app-status-badge-agent',
    templateUrl: './status-badge-agent.component.html'    
  })
  export class StatusBadgeAgentComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof AgentStatusEnum = AgentStatusEnum;
  }