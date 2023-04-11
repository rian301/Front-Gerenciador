export enum AgentDocTypeEnum {
    CPF = 1,
    Address = 2,
    Video = 3
}

export function TraduzirEnumAgentDocTypeEnum(valor: AgentDocTypeEnum): string {
    switch (valor) {
        case 1:
            return "Documento Pessoal";
        case 2:
            return "Comprovante de Residência";
        case 3:
            return "Vídeo";
    }
}

export function AgentDocTypeEnumList() {
    return [
        { type: 1, name: TraduzirEnumAgentDocTypeEnum(1) },
        { type: 2, name: TraduzirEnumAgentDocTypeEnum(2) },
        { type: 3, name: TraduzirEnumAgentDocTypeEnum(3) }        
    ];
}