export class LineChartModel {
    titulo: string;
    cor: string;
    legendas: string[];
    valores: number[];

    constructor(
        titulo: string = null,
        cor: string = null,
        legendas: string[] = [],
        valores: number[] = []) {
        this.titulo = titulo;
        this.cor = cor;
        this.valores = valores;
        this.legendas = legendas;
    }
}