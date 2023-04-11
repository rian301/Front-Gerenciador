export class DinamicTableModel {
    titles: DinamicTableItemModel[];
    lista: any[];

    constructor(titles: DinamicTableItemModel[], lista: any[]) {
        this.titles = titles;
        this.lista = lista;
    }
}

export class DinamicTableItemModel {
    prop: string;
    alias: string;
    customProp: string;

    constructor(prop: string, alias: string = null, customProp: string = null) {
        this.prop = prop;
        this.alias = alias != null ? alias : prop;
        this.customProp = customProp != null ? customProp : prop;
    }
}