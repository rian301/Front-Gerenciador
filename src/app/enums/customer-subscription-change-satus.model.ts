export class CustomerSubscriptionChangeStatusModel {
    id: number = null;
    subscriptionId: number = null;
    motiveCanceled: string = null;
    status: number = null;
    cancelInvoicePending: boolean = false;

    constructor(id: number, subscriptionId: number, motiveCanceled: string, status: number, cancelInvoicePending: boolean){
        this.id = id;
        this.subscriptionId = subscriptionId;
        this.motiveCanceled = motiveCanceled;
        this.status = status;
        this.cancelInvoicePending = cancelInvoicePending;
    }
}