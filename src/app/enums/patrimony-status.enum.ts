export enum PatrimonyStatusEnum {
    Active = 1,
    Inactive = 2,
    Used = 3,
    Returned = 4,
    GiveAway = 5
}

export function TraduzirPatrimonyStatusTypeEnum(valor: PatrimonyStatusEnum): string {
    switch (valor) {
        case 1:
            return "Ativo";
        case 2:
            return "Inativo";
        case 3:
            return "Cessão de Uso";
        case 4:
            return "Devolvido";
        case 5:
            return "Doado";
    }
}

export function listaEnumPatrimonyStatus() {
    return [
        { type: 1, name: TraduzirPatrimonyStatusTypeEnum(1) },
        { type: 2, name: TraduzirPatrimonyStatusTypeEnum(2) },
        { type: 3, name: TraduzirPatrimonyStatusTypeEnum(3) },
        { type: 4, name: TraduzirPatrimonyStatusTypeEnum(4) },
        { type: 5, name: TraduzirPatrimonyStatusTypeEnum(5) },
    ];
}
