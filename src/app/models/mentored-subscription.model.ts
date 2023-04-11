import { InvoiceModel } from "./mentored-payment.model";

export class MentoredSubscriptionModel {
  id: number = null;
  productId: number = null;
  productName: string = null;
  mentoredId: number = null;
  mentoredName: string = null;
  mentoredCompanyId: number = null;
  partnerId: number = null;
  canceledDate: Date = null;
  subscriptionDate: Date = null;
  dueDate: Date = null;
  currentPeriodId: number = null;
  motiveCanceled: string = null;
  overdueSince: number = null;
  requestCancelDate: Date = null;
  requestCancelMotive: Date = null;
  endSubscriptionDate: Date = null;
  initialAmount: number = null;
  totalAmount: number = null;
  discountAmount: number = null;
  installments: number = null;
  status: number = null;
  statusDescription: string = null;
  invoices: InvoiceModel[] = null;
  // propriedades da lista (visualização)
  statusDescriptionCustom: any = null;
  subscriptionDateString: string = null;
  endSubscriptionDateString: string = null;
}
