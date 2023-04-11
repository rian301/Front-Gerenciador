export class CustomerPaymentModel {
    id: number = null;
     paymentMethodId: number = null;
     signatureDate: Date = null;
     cancelDate: Date = null;
     installments : number = null;
     note: string = null; 
     statusDescriptionCustom: string = null;
     statusDescription: string = null; 
     customerId: number = null;
}