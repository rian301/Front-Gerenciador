export enum StatusTypeEnum {
    Active = 1,
    Inactive = 2,
}

export function traduzirEnumStatusType(valor: StatusTypeEnum): string {
    switch (valor) {
        case 1:
            return "Ativo";
        case 2:
            return "Inativo";
    }
}

export function listaEnumStatus() {
    return [
        { type: 1, name: traduzirEnumStatusType(1) },
        { type: 2, name: traduzirEnumStatusType(2) },
    ];
}

