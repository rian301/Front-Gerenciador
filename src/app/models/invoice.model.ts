export class InvoiceModel {
    id: number = null;
    mentoredId: number = null;
    subscriptionId: number = null;
    mentoredCompanyId: number = null;
    amount: number = null;
    status: number = null;
    paidDate: Date = null;
    expirationDate: Date = null;
    canceledDate: Date = null;
    nextAttempt: Date = null;
    attemptCount: number = null;
}