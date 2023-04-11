export enum PendencyStatusEnum {
    Resolved = 1,
    InProgress = 2,
}

export function TraduzirPendencyStatusTypeEnum(valor: PendencyStatusEnum): string {
    switch (valor) {
        case 1:
            return "Resolvido";
        case 2:
            return "Em Andamento";
    }
}
