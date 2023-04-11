export class PendencyModel {
  id: number = null;
  name: string = null;
  includDate: Date = null;
  requester: string = null;
  responsible: string = null;
  description: string = null;
  resolveDate: Date = null;
  status: number = null;
  statusDescription: string = null;

  // Apenas leitura
  includDateExport: string = null;
  resolveDateExport: string = null;
  files: any = null;
}
