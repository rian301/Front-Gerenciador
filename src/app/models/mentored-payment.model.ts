export class InvoiceModel {
  id: number = null;
  mentoredId: number = null;
  mentoredName: string = null;
  subscriptionId: number = null;
  mentoredCompanyId: number = null;
  amount: number = null;
  status: number = null;
  paidDate: Date = null;
  createdAt: Date = null;
  expirationDate: Date = null;
  canceledDate: Date = null;
  nextAttempt: Date = null;
  overdueSince: Date = null;
  statusDescription: string = null;

  // Apenas vizualização
  createdAtString: string = null;
  paidDateString: string = null;
  expirationDateString: string = null;

  constructor(amount: number = null) {
    this.amount = amount;
  }
}
