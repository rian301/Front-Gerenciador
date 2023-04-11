export class JsonRetornoModel<T> {
    errors: JsonRetornoErro[] = null;
}

export class JsonRetornoErro {
    property: string = null;
    message: string = null;
}