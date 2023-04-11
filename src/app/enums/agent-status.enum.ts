export enum AgentStatusEnum {
    New = 1,
    InAnalisys = 2,
    Active = 3,
    Rejected = 4,
    Inactive = 5
}

export function traduzirEnumAgentStatus(valor: AgentStatusEnum): string {
    switch (valor) {
        case 1:
            return "Novo";
        case 2:
            return "Em análise";
        case 3:
            return "Ativo";
        case 4:
            return "Rejeitado";
        case 5:
            return "Inativo";
    }
}

export function listaEnumAgentStatus() {
    return [
        { type: 1, name: traduzirEnumAgentStatus(1) },
        { type: 2, name: traduzirEnumAgentStatus(2) },
        { type: 3, name: traduzirEnumAgentStatus(3) },
        { type: 4, name: traduzirEnumAgentStatus(4) },
        { type: 5, name: traduzirEnumAgentStatus(5) },
    ];
}