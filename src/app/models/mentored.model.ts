import { MentoredCompanyModel } from "./mentored-company.model";

export class MentoredModel {
    id: number = null;
    name: string = null;
    email: string = null;
    rg: string = null;
    cpf: string = null;
    phoneNumber: string = null;
    birthDate: Date = null;
    zipCode: string = null;
    street: string = null;
    number: number = null;
    complement: string = null;
    district: string = null;
    city: string = null;
    state: string = null;
    status: number = null;
    statusDescription: string = null;
    createdAt: Date = null;
    note: string = null;
    partners: number[] = [];
    instagram: string = null;
    mentoredCompanies: MentoredCompanyModel[] = [];
    hasPaymentCompanyInAnalisys: boolean = null;
    hasPaymentCompanyConcluded: boolean = null;
    paymentDate: string = null;
    isPartner: boolean = false;

    // Apenas vizualização
    birthDateString: string = null;
}
