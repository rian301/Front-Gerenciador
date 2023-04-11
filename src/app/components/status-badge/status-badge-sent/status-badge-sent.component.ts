import { Component, Input } from "@angular/core";
import { SentStatusEnum } from "src/app/enums/app-status.enum";

@Component({
    selector: 'app-status-badge-sent',
    templateUrl: './status-badge-sent.component.html'
  })
  export class StatusBadgeSentComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof SentStatusEnum = SentStatusEnum;
  }
