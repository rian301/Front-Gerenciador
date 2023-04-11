export class ExpenseControlModel {
  id: number = null;
  description: string = null;
  providerId: number = null;
  expenseCategoryId: number = null;
  value: number = null;
  date: Date = null;
  paymentDate: Date = null;
  status: number = null;
  statusDescription: string = null;
  expenseCategoryName: string = null;
  providerName: string = null;
  imageUpload: string = null;
  fileName: string = null;
  note: string = null;
  // Apenas vizualização
  paymentDateString: string = null;
  dateString: string = null;
}
