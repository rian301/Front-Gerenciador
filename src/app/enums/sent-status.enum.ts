export enum AppStatusEnum {
    Active = 1,
    Inactive = 2,
}

export function TraduzirAppStatusTypeEnum(valor: AppStatusEnum): string {
    switch (valor) {
        case 1:
            return "Ativo";
        case 2:
            return "Inativo";
    }
}
