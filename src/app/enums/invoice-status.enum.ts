export enum InvoiceStatusEnum {
    Pending = 1,
    Approved = 2,
    Canceled = 3,
    PendingManualApproval = 4
}

export function traduzirEnumStatusInvoice(valor: InvoiceStatusEnum): string {
    switch (valor) {
        case 1:
            return "Aguardando Pagamento";
        case 2:
            return "Pago";
        case 3:
            return "Cancelado";
        case 4:
            return "Pendente de Aprovação";
    }
}

export function listaEnumInvoiceStatus() {
    return [
        { type: 1, name: traduzirEnumStatusInvoice(1) },
        { type: 2, name: traduzirEnumStatusInvoice(2) },
        { type: 3, name: traduzirEnumStatusInvoice(3) },
        { type: 4, name: traduzirEnumStatusInvoice(4) },
    ];
}
