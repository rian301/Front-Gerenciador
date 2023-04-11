export enum TransactionGatewayStatusEnum {
    Pending = 0,
    Authorized = 1,
    NotAuthorized = 2,
    PaymentConfirmed = 3,
    Canceled = 4,
    Error = 5
}

export function traduzirTransactionGatewayStatusEnum(valor: TransactionGatewayStatusEnum): string {
    switch (valor) {
        case 1:
            return "Pendente";
        case 2:
            return "Autorizado";
        case 3:
            return "Não Autorizado";
        case 4:
            return "Pagamento Confirmado";
        case 5:
            return "Cancelado";
        case 5:
            return "Erro";
    }
}

export function listaEnumInvoiStatus() {
    return [
        { type: 1, name: traduzirTransactionGatewayStatusEnum(1) },
        { type: 2, name: traduzirTransactionGatewayStatusEnum(2) },
        { type: 3, name: traduzirTransactionGatewayStatusEnum(3) },
        { type: 4, name: traduzirTransactionGatewayStatusEnum(4) },
        { type: 5, name: traduzirTransactionGatewayStatusEnum(5) },
        { type: 6, name: traduzirTransactionGatewayStatusEnum(6) },
    ];
}