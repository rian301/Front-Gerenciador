export enum PaymentTypeStatusEnum {
    Other = 1,
    CreditCard = 2,
    Boleto = 3,
    Cash = 4,
    Pix = 5,
    DebitCard = 6
}

export function traduzirEnumPaymentTypeStatus(valor: PaymentTypeStatusEnum): string {
    switch (valor) {
        case 1:
            return "Outro";
        case 2:
            return "Cartão de crédito";
        case 3:
            return "Boleto";
        case 4:
            return "Dinheiro";
        case 5:
            return "Pix";
        case 6:
            return "Cartão de débito";
    }
}

export function listaEnumPaymentTypeStatus() {
    return [
        { type: 1, name: traduzirEnumPaymentTypeStatus(1) },
        { type: 2, name: traduzirEnumPaymentTypeStatus(2) },
        { type: 3, name: traduzirEnumPaymentTypeStatus(3) },
        { type: 3, name: traduzirEnumPaymentTypeStatus(4) },
        { type: 3, name: traduzirEnumPaymentTypeStatus(5) },
        { type: 3, name: traduzirEnumPaymentTypeStatus(6) },
    ];
}

