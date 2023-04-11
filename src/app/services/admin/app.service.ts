import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class AppService {

    loading: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    limparContexto() {
    }
}
