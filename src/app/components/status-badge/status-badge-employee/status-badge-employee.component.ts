import { Component, Input } from "@angular/core";
import { EmployeeStatusEnum } from "src/app/enums/employee-status.enum.ts";

@Component({
    selector: 'app-status-badge-employee',
    templateUrl: './status-badge-employee.component.html'    
  })
  export class StatusBadgeEmployeeComponent {
    @Input()
    statusDescription: string = null;
    @Input()
    value: any = null;
    StatusEnum: typeof EmployeeStatusEnum = EmployeeStatusEnum;
  }