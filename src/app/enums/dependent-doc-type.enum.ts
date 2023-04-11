export enum DependentDocTypeEnum {
    CPF = 1,
    CONTRACT = 2,
    RECEIPT = 3,
    NOTE = 4,
    ADCTIVE = 5,
    BOLETO = 6,
    TERM = 7,
    REPORT = 8,
    DESCRITIVE = 9,
}

export function TraduzirEnumDependentDocTypeEnum(valor: DependentDocTypeEnum): string {
    switch (valor) {
        case 1:
            return 'Documento pessoal';
        case 2:
            return 'Contrato';
        case 3:
            return 'Recibo';
        case 4:
            return 'NF';
        case 5:
            return 'Aditivo';
        case 6:
            return 'Boleto';
        case 7:
            return 'Termo cessão de uso';
        case 8:
            return 'Relatório';
        case 9:
            return 'Descritivo';
    }
}

export function DependentDocTypeEnumList() {
    return [
        { type: 1, name: TraduzirEnumDependentDocTypeEnum(1) },
        { type: 2, name: TraduzirEnumDependentDocTypeEnum(2) },
        { type: 3, name: TraduzirEnumDependentDocTypeEnum(3) },
        { type: 4, name: TraduzirEnumDependentDocTypeEnum(4) },
        { type: 5, name: TraduzirEnumDependentDocTypeEnum(5) },
        { type: 6, name: TraduzirEnumDependentDocTypeEnum(6) },
        { type: 7, name: TraduzirEnumDependentDocTypeEnum(7) },
        { type: 8, name: TraduzirEnumDependentDocTypeEnum(8) },
        { type: 9, name: TraduzirEnumDependentDocTypeEnum(9) },
    ];
}
