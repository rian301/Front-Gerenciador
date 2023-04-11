export enum EmployeeTypeEnum {
    CLT = 1,
    PJ = 2,
    FREE_LANCER = 3
}

export function TraduzirEmployeeTypeTypeEnum(valor: EmployeeTypeEnum): string {
    switch (valor) {
        case 1:
            return "CLT";
        case 2:
            return "PJ";
        case 3:
            return "Free-lancer"
    }
}

export function listaEnumType() {
    return [
        { type: 1, name: TraduzirEmployeeTypeTypeEnum(1) },
        { type: 2, name: TraduzirEmployeeTypeTypeEnum(2) },
        { type: 3, name: TraduzirEmployeeTypeTypeEnum(3) },
    ];
}
