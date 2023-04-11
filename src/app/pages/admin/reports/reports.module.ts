import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { MatTooltipModule } from 'src/app/app.material';
import { ReportService } from 'src/app/services/admin/reports.service';
import { SharedAdminModule } from 'src/app/shared/shared-admin.module';
import { ReportMentoredComponent } from './report-mentored/report-mentored.component';
import { ReportsRoutingModule } from './reports.routing';
import { ReportMentoredContractComponent } from './report-mentored-contract/report-mentored-contract.component';
import { ReportExpenseControlComponent } from './report-expense-control/report-expense-control.component';
import { ExpenseCategoryService } from 'src/app/services/admin/expense-category.service';

@NgModule({
  declarations: [
    ReportMentoredComponent,
    ReportMentoredContractComponent,
    ReportExpenseControlComponent
  ],
  imports: [
    SharedAdminModule,
    ReportsRoutingModule,
    NgxMaskModule.forRoot(),
    MatTooltipModule,
  ],
  providers: [
    ReportService,
    ExpenseCategoryService
  ]
})
export class ReportsModule { }
