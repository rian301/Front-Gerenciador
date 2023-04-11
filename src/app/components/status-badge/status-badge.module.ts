import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeInvoiceComponent } from './status-badge-invoice/status-badge-invoice.component';
import { StatusBadgeSubscriptionComponent } from './status-badge-subscription/status-badge-subscription.component';
import { StatusBadgeAgentComponent } from './status-badge-agent/status-badge-agent.component';
import { StatusBadgeAgentCompanyComponent } from './status-badge-agent-company/status-badge-agent-company.component';
import { StatusBadgePartnerComponent } from './status-badge-partner/status-badge-partner.component';
import { StatusBadgeTransactionGatewayComponent } from './status-badge-transaction-gateway/status-badge-transaction-gateway.component';
import { StatusBadgeStatusComponent } from './status-badge-status/status-badge-status.component';
import { StatusBadgeCustomerComponent } from './status-badge-customer/status-badge-customer.component';
import { StatusBadgeEmployeeComponent } from './status-badge-employee/status-badge-employee.component';
import { StatusBadgePatrimonyComponent } from './status-badge-patrimony/status-badge-patrimony.component';
import { StatusBadgeMentoredComponent } from './status-badge-mentored/status-badge-mentored.component';
import { StatusBadgePendencyComponent } from './status-badge-pendency/status-badge-pendency.component';
import { StatusBadgeSentComponent } from './status-badge-sent/status-badge-sent.component';
import { StatusBadgeAppComponent } from './status-badge-app/status-badge-app.component';

@NgModule({
  declarations: [
    StatusBadgeInvoiceComponent,
    StatusBadgeSubscriptionComponent,
    StatusBadgeAgentComponent,
    StatusBadgeAgentCompanyComponent,
    StatusBadgePartnerComponent,
    StatusBadgeTransactionGatewayComponent,
    StatusBadgeStatusComponent,
    StatusBadgeCustomerComponent,
    StatusBadgeEmployeeComponent,
    StatusBadgePatrimonyComponent,
    StatusBadgeMentoredComponent,
    StatusBadgePendencyComponent,
    StatusBadgeSentComponent,
    StatusBadgeAppComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StatusBadgeInvoiceComponent,
    StatusBadgeSubscriptionComponent,
    StatusBadgeAgentComponent,
    StatusBadgeAgentCompanyComponent,
    StatusBadgePartnerComponent,
    StatusBadgeTransactionGatewayComponent,
    StatusBadgeStatusComponent,
    StatusBadgeCustomerComponent,
    StatusBadgeEmployeeComponent,
    StatusBadgePatrimonyComponent,
    StatusBadgeMentoredComponent,
    StatusBadgePendencyComponent,
    StatusBadgeSentComponent,
    StatusBadgeAppComponent
  ],
})

export class StatusBadgeModule { }
