export enum AgentCompanyStatusEnum {
    InAnalisys = 1,
    Rejected = 2,
    Active = 3,
}

export function traduzirEnumAgentCompanyStatus(valor: AgentCompanyStatusEnum): string {
    switch (valor) {
        case 1:
            return "Em análise";
        case 2:
            return "Rejeitado";
        case 3:
            return "Ativo";
    }
}

export function listaEnumAgentStatus() {
    return [
        { type: 1, name: traduzirEnumAgentCompanyStatus(1) },
        { type: 2, name: traduzirEnumAgentCompanyStatus(2) },
        { type: 3, name: traduzirEnumAgentCompanyStatus(3) },
    ];
}

