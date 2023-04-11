import { NgModule } from '@angular/core';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxMaskModule } from 'ngx-mask';
import { EmployeeService } from 'src/app/services/admin/employee.service';
import { SharedAdminModule } from 'src/app/shared/shared-admin.module';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeComponent } from './employee/employee/employee.component';
import { ModalDocComponent } from './employee/modal-doc/modal-doc.component';
import { EmployeeRoutingModule } from './rh.routing';



@NgModule({
  imports: [
    SharedAdminModule,
    EmployeeRoutingModule,
    NgxMaskModule.forRoot(),
    CurrencyMaskModule
  ],
  declarations: [
    EmployeeListComponent,
    EmployeeComponent,
    ModalDocComponent
  ],
  providers: [
    EmployeeService
  ]
})
export class RhModule { }
