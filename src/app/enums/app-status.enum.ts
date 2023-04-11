export enum SentStatusEnum {
  Sent = 1,
  InProgress = 2,
  Receiving = 3
}

export function TraduzirSentStatusTypeEnum(valor: SentStatusEnum): string {
  switch (valor) {
    case 1:
      return "Enviado";
    case 2:
      return "Pendente";
    case 3:
      return "Recebido";
  }
}

export function listaEnumSentType() {
  return [
      { type: 1, name: TraduzirSentStatusTypeEnum(1) },
      { type: 2, name: TraduzirSentStatusTypeEnum(2) },
      { type: 3, name: TraduzirSentStatusTypeEnum(3) },
  ];
}
