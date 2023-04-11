import { Component, Input } from "@angular/core";
import { PatrimonyStatusEnum } from "src/app/enums/patrimony-status.enum";

@Component({
    selector: 'app-status-badge-patrimony',
    templateUrl: './status-badge-patrimony.component.html'    
  })
  export class StatusBadgePatrimonyComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof PatrimonyStatusEnum = PatrimonyStatusEnum;
  }