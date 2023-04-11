import { Component, Input } from "@angular/core";
import { PendencyStatusEnum } from "src/app/enums/pendency-status.enum.ts";

@Component({
    selector: 'app-status-badge-pendency',
    templateUrl: './status-badge-pendency.component.html'
  })
  export class StatusBadgePendencyComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof PendencyStatusEnum = PendencyStatusEnum;
  }
