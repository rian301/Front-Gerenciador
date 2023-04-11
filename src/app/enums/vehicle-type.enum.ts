export enum VehicleTypeEnum {
    CargoTransport = 1,
    Others = 2
}

export function traduzirEnumVehicleType(valor: VehicleTypeEnum): string {
    switch (valor) {
        case 1:
            return "Transporte de carga";
        case 2:
            return "Outros";        
    }
}

export function listaEnumVehicleType() {
    return [
        { type: 1, name: traduzirEnumVehicleType(1) },
        { type: 2, name: traduzirEnumVehicleType(2) }
    ];
}