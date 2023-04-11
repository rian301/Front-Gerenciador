import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'cpfcnpj'
})
export class CpfCnpjPipe implements PipeTransform {
    transform(value: string): string {

        if (value == undefined || value == null) {
            return value;
        }

        let newvalue: string = value;

        value = value.replace(/[^\d]/, '');

        if (value.length == 11) {
            return value.substr(0, 3) + '.' + value.substr(3, 3) + '.' + value.substr(6, 3) + '-' + value.substr(9, 2);
        }
        else if (value.length > 11 && value.length < 14) {
            value = value.replace(/[.-]/g, '').replace("/", "");
            return value;
        }
        else if (value.length == 14) {
            return value.substr(0, 2) + '.' + value.substr(2, 3) + '.' + value.substr(5, 3) + '/' + value.substr(8, 4) + '-' + value.substr(12, 2);
        }
        else {
            value = "<span class='text-danger'>Inconformidade, atualizar cadastro</span>";
            return value;
        }
    }
}
