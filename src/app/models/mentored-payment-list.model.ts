import { InvoiceModel } from "./mentored-payment.model";
import { MentoredSubscriptionModel } from "./mentored-subscription.model";

export class MentoredPaymentList {
    subscription: MentoredSubscriptionModel = null;
    invoices: InvoiceModel[] = [];
}