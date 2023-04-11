export enum PartnerStatusEnum {
    Active = 1,
    Inative = 2,
}

export function traduzirEnumPartnerStatus(valor: PartnerStatusEnum): string {
    switch (valor) {
        case 1:
            return "Ativo";
        case 2:
            return "Inativo";
    }
}

export function listaEnumPartnerStatus() {
    return [
        { type: 1, name: traduzirEnumPartnerStatus(1) },
        { type: 2, name: traduzirEnumPartnerStatus(2) }
    ];
}