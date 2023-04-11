export class PatrimonyModel {
    id: number = null;
    tag: string = null;
    description: string = null;;
    brand: string = null;
    nf: string = null;
    providerId: null = null;
    assetsCategoryId: number = null;
    numberSerie: string = null;
    purchaseDate: Date = null;
    value: number = null;
    status: number = null;
    statusDescription: string = null;
    note: string = null;

    // Apenas leitura
    providerName: string = null;
    categoryName: string = null;
}