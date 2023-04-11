export enum ResponsableEnum {
    Humberto = 1,
    Leandro = 2,
}

export function traduzirEnumResponsable(valor: ResponsableEnum): string {
    switch (valor) {
        case 1:
            return "Humberto";
        case 2:
            return "Leandro";
    }
}

export function listaEnumResponsable() {
    return [
        { type: 1, name: traduzirEnumResponsable(1) },
        { type: 2, name: traduzirEnumResponsable(2) },
    ];
}
