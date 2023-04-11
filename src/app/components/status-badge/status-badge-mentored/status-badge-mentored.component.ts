import { Component, Input } from "@angular/core";
import { MentoredStatusEnum } from "src/app/enums/mentored-status.enum";

@Component({
    selector: 'app-status-badge-mentored',
    templateUrl: './status-badge-mentored.component.html'
  })
  export class StatusBadgeMentoredComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof MentoredStatusEnum = MentoredStatusEnum;
  }
