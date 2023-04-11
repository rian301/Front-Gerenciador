import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PermissionConsts } from "src/app/consts";
import { PermissionHelper } from "src/app/helpers/permission.helper";
import { AuthGuard } from "src/app/services";
import { ReportExpenseControlComponent } from "./report-expense-control/report-expense-control.component";
import { ReportMentoredContractComponent } from "./report-mentored-contract/report-mentored-contract.component";
import { ReportMentoredComponent } from "./report-mentored/report-mentored.component";

export const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        redirectTo: "faturas",
        pathMatch: "full",
      },
      {
        path: "faturas-mentoria",
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.REPORT_INVOICE_VIEW_MENTORED },
        component: ReportMentoredComponent,
      },
      {
        path: "contratos-mentoria",
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.REPORT_INVOICE_VIEW_MENTORED },
        component: ReportMentoredContractComponent,
      },
      {
        path: "gastos-externos",
        canActivate: [AuthGuard],
        data: { permission: PermissionHelper.REPORT_INVOICE_VIEW_MENTORED },
        component: ReportExpenseControlComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
