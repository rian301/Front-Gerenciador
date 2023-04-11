export enum ExpenseReportTypeEnum {
  All = 1,
  Category = 2,
  Customized = 3
}

export function traduzirTypeReportExpenseEnum(valor: ExpenseReportTypeEnum): string {
  switch (valor) {
    case 1:
      return "Geral";
    case 2:
      return "Por Categoria";
    case 3:
      return "Customizado"
  }
}

export function listaExpenseReportTypeEnum() {
  return [
    { type: 1, name: traduzirTypeReportExpenseEnum(1) },
    { type: 2, name: traduzirTypeReportExpenseEnum(2) },
    { type: 3, name: traduzirTypeReportExpenseEnum(3) },
  ];
}
