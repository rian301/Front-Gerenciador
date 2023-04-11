import { ProviderModel } from "./provider.model";

export class DailyPaymentModel {
    id: number = null;
    name: string = null;
    datePayment: Date = null;
    dateSchedulingPayment: Date = null;
    amount: number = null;
    document: string = null;
    bank: string = null;
    agency: string = null;
    acount: string = null;
    pix: string = null;
    note: string = null;
    providerId: number = null;
    providerName: string = null;
    categoryId: number = null;
    categoryName: string = null;

    // propriedades da lista (visualização)
    dateFuturePayment: string = null;
    dateSchedulingPaymentExport: string = null;
    datePaymentExport: string = null;
    typeDoc: number = null;
    files: any = null;
}
