export enum MentoredStatusEnum {
  Active = 1,
  Inactive = 2,
  Off = 3
}

export function TraduzirMentoredStatusTypeEnum(valor: MentoredStatusEnum): string {
  switch (valor) {
    case 1:
      return "Ativo";
    case 2:
      return "Inativo";
    case 3:
      return "Desligado";
  }
}
