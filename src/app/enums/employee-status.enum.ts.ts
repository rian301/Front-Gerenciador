export enum EmployeeStatusEnum {
    Active = 1,
    Inactive = 2,
}

export function TraduzirEmployeeStatusTypeEnum(valor: EmployeeStatusEnum): string {
    switch (valor) {
        case 1:
            return "Ativo";
        case 2:
            return "Inativo";
    }
}
