export class BarChartModel {
    titulo: string;
    cor: string;
    valor: number;
    horizontal: boolean;

    constructor(
        titulo: string = null,
        cor: string = null,
        valor: number = null,
        horizontal: boolean = false) {
        this.titulo = titulo;
        this.cor = cor;
        this.valor = valor;
        this.horizontal = horizontal;
    }
}