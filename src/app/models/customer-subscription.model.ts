export class CustomerSubscriptionModel {
    id: number = null;
    amount: number = null;
    status: number = null;
    statusDescription: string = null;
    expirationDate: Date = null;
    plan: CustomerSubscriptionPlanModel = null;
    agentIndication: CustomerSubscriptionAgentIndicationModel = null;
    invoices: CustomerSubscriptionInvoiceModel[] = null; 
}

export class CustomerSubscriptionPlanModel {
    name: string = null;
    id: number = null;    
}

export class CustomerSubscriptionAgentIndicationModel {
    name: string = null;
    id: number = null;
}

export class CustomerSubscriptionInvoiceModel {
    id: number = null;
    subscriptionId: number = null;
    amount: number = null;
    status: number = null;
    statusDescription: string = null;
    expirationDate: Date = null;
    paidDate: Date = null;
    boletoUrl: string = null;
}
