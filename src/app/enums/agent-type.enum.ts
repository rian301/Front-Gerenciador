export enum AgentTypeEnum {
    Online = 1,
    OnlineInterno = 2,
    Reception = 3,
}

export function traduzirEnumAgentType(valor: AgentTypeEnum): string {
    switch (valor) {
        case 1:
            return "Online";
        case 2:
            return "Online Interno";
        case 3:
            return "Recepção";
    }
}

export function listaEnumAgentType() {
    return [
        { type: 1, name: traduzirEnumAgentType(1) },
        { type: 2, name: traduzirEnumAgentType(2) },
        { type: 3, name: traduzirEnumAgentType(3) },
    ];
}