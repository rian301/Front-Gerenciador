export class ApplicationModel {
  id: number = null;
  name: string = null;
  datePurchase: Date = null;
  requester: string = null;
  value: number = null;
  signature: string = null;
  description: string = null;
  responsible: string = null;
  dateCanceled: Date = null;
  motiveCancel: string = null;
  status: number = null;
  note: string = null;

  statusDescription: string = null;
  datePurchaseExport: string = null;
  dateCanceledExport: string = null;
}
