export class DoughnutChartModel {
    cores: string[];
    nome: string;
    valor: number;
    codigo: number;
    codigoPai: number;
    visualizacao: string;
    subs: DoughnutChartModel[];

    constructor(
        cores: string[] = [],
        nome: string = null,
        valor: number = null,
        codigo: number = null,
        codigoPai: number = null,
        subs: DoughnutChartModel[] = [],
        visualizacao: string = "Valor") {
        this.nome = nome;
        this.valor = valor;
        this.codigo = codigo;
        this.codigoPai = codigoPai;
        this.subs = subs;
        this.visualizacao = visualizacao;
        this.cores = cores;
    }
}