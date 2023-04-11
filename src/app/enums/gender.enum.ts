export enum GenderEnum {
    Man = 1,
    Woman = 2,
    Other = 3,
}

export function traduzirEnumGender(valor: GenderEnum): string {
    switch (valor) {
        case 1:
            return "Masculino";
        case 2:
            return "Feminino";
        case 3:
            return "Outro";
    }
}

export function listaEnumGender() {
    return [
        { type: 1, name: traduzirEnumGender(1) },
        { type: 2, name: traduzirEnumGender(2) },
        { type: 3, name: traduzirEnumGender(3) },
    ];
}