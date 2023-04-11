export enum LogTypeEnum {
    None = 0,
    Create = 1,
    Update = 2,
    Delete = 3
}

export function traduzirEnumLogType(valor: LogTypeEnum): string {
    switch (valor) {
        case 1:
            return "Nenhum";
        case 2:
            return "Inserido";
        case 3:
            return "Alterado";
        case 4:
            return "Deletado";
    }
}

export function listaEnumLogType() {
    return [
        { type: 1, name: traduzirEnumLogType(1) },
        { type: 2, name: traduzirEnumLogType(2) },
        { type: 3, name: traduzirEnumLogType(3) },
        { type: 4, name: traduzirEnumLogType(4) },
    ];
}
