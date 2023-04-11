export enum LegalDocumentsStatusEnum {
    Terms = 1,
    ContractCompany = 2,
}

export function traduzirEnumDocumentoStatus(valor: LegalDocumentsStatusEnum): string {
    switch (valor) {
        case 1:
            return "Termos Agente";
        case 2:
            return "Contrato Empresa Agente";
    }
}

export function listaEnumDocumentoStatus() {
    return [
        { type: 1, name: traduzirEnumDocumentoStatus(1) },
        { type: 2, name: traduzirEnumDocumentoStatus(2) },
    ];
}