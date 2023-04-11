import { Component, Input } from "@angular/core";
import { AppStatusEnum } from "src/app/enums/sent-status.enum";

@Component({
    selector: 'app-status-badge-app',
    templateUrl: './status-badge-app.component.html'
  })
  export class StatusBadgeAppComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof AppStatusEnum = AppStatusEnum;
  }
