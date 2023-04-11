export class CustomerListModel {
    id: number = null;
    name: string = null;
    email: string = null;
    birthDate: Date = null;
    zipCode: string = null;
    street: string = null;
    number: string = null;
    complement: string = null;
    district: string = null;
    city: string = null;
    state: string = null;
    status: number = null;
    statusDescription: string = null;
    hasDependentsInAnalisys: boolean = null;

    // propriedades da lista (visualização)
    statusDescriptionCustom: any = null;    
}