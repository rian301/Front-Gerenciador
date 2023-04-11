import { AbstractControl, FormControl } from "@angular/forms";

export class FormValidators {
    static password(ac: AbstractControl) {
        //let PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        let PASSWORD_REGEXP = /^[A-Za-z\d@$!%*?&]{8,}$/;
        return PASSWORD_REGEXP.test(ac.value) ? null : { invalidPassword: true };
    }

    static email(ac: AbstractControl) {
        let EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return EMAIL_REGEXP.test(ac.value) ? null : { invalidEmail: true };
    }

    static validEmail(ac: string) {
        let EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return EMAIL_REGEXP.test(ac);
    }

    static cpfCnpj(c: FormControl) {
        var value = String(c.value);

        if (value.length < 14) {
            while (value.indexOf('.') > -1 || value.indexOf('-') > -1) {
                value = value.replace('.', '').replace('-', '');
            }

            return ValidarCPF(value) ? null : { cpf: true };
        }
        else {
            while (value.indexOf('.') > -1 || value.indexOf('-') > -1 || value.indexOf('/') > -1) {
                value = value.replace('.', '').replace('-', '').replace('/', '');
            }

            return ValidarCNPJ(value) ? null : { cnpj: true };
        }
    }

    static cpf(c: FormControl) {
        var cpf = String(c.value);
        while (cpf.indexOf('.') > -1 || cpf.indexOf('-') > -1) {
            cpf = cpf.replace('.', '').replace('-', '');
        }

        return ValidarCPF(cpf) ? null : { cpf: true };
    }

    static cnpj(c: FormControl) {
        var cnpj = String(c.value);
        while (cnpj.indexOf('.') > -1 || cnpj.indexOf('-') > -1 || cnpj.indexOf('/') > -1) {
            cnpj = cnpj.replace('.', '').replace('-', '').replace('/', '');
        }

        return ValidarCNPJ(cnpj) ? null : { cnpj: true };
    }

    static rg(c: FormControl) {
        var rg = String(c.value);

        return ValidarRG(rg) ? null : { rg: true };
    }

    static cnh(c: FormControl) {
        var cnh = String(c.value);
        while (cnh.indexOf('.') > -1 || cnh.indexOf('-') > -1 || cnh.indexOf('/') > -1) {
            cnh = cnh.replace('.', '').replace('-', '').replace('/', '');
        }

        return ValidarCNH(cnh) ? null : { cnh: true };
    }

    static date(c: FormControl) {
        if (c.value == null && c.value == undefined || c.value == '') {
            return null;
        }

        if (c.value.length > 0 && c.value.length < 8) {
            return { date: true };
        }
        var formatbr = `${c.value.substring(4, 8)}-${c.value.substring(2, 4)}-${c.value.substring(0, 2)}`
        var date = new Date(formatbr);
        if (date.toString() == 'Invalid Date')
            return { date: true };
        else
            return null;
    }

}

export function ValidarCPF(cpf) {
    var numeros, digitos, soma, i, resultado, digitos_iguais;
    digitos_iguais = 1;
    if (cpf.length < 11)
        return false;
    for (i = 0; i < cpf.length - 1; i++)
        if (cpf.charAt(i) != cpf.charAt(i + 1)) {
            digitos_iguais = 0;
            break;
        }
    if (!digitos_iguais) {
        numeros = cpf.substring(0, 9);
        digitos = cpf.substring(9);
        soma = 0;
        for (i = 10; i > 1; i--)
            soma += numeros.charAt(10 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;
        numeros = cpf.substring(0, 10);
        soma = 0;
        for (i = 11; i > 1; i--)
            soma += numeros.charAt(11 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return false;
        return true;
    }
    else
        return false;
}

export function ValidarCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    var tamanho = cnpj.length - 2
    var numeros = cnpj.substring(0, tamanho);
    var digitos = cnpj.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;
    for (var i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;
}

export function ValidarRG(numero) {
    var tamanho = numero.length;
    var vetor = new Array(tamanho);

    if (tamanho >= 1) {
        vetor[0] = parseInt(numero[0]) * 2;
    }
    if (tamanho >= 2) {
        vetor[1] = parseInt(numero[1]) * 3;
    }
    if (tamanho >= 3) {
        vetor[2] = parseInt(numero[2]) * 4;
    }
    if (tamanho >= 4) {
        vetor[3] = parseInt(numero[3]) * 5;
    }
    if (tamanho >= 5) {
        vetor[4] = parseInt(numero[4]) * 6;
    }
    if (tamanho >= 6) {
        vetor[5] = parseInt(numero[5]) * 7;
    }
    if (tamanho >= 7) {
        vetor[6] = parseInt(numero[6]) * 8;
    }
    if (tamanho >= 8) {
        vetor[7] = parseInt(numero[7]) * 9;
    }
    if (tamanho >= 9) {
        vetor[8] = parseInt(numero[8]) * 100;
    }

    var total = 0;

    if (tamanho >= 1) {
        total += vetor[0];
    }
    if (tamanho >= 2) {
        total += vetor[1];
    }
    if (tamanho >= 3) {
        total += vetor[2];
    }
    if (tamanho >= 4) {
        total += vetor[3];
    }
    if (tamanho >= 5) {
        total += vetor[4];
    }
    if (tamanho >= 6) {
        total += vetor[5];
    }
    if (tamanho >= 7) {
        total += vetor[6];
    }
    if (tamanho >= 8) {
        total += vetor[7];
    }
    if (tamanho >= 9) {
        total += vetor[8];
    }

    var resto = total % 11;

    return resto != 0;
}

export function ValidarCNH(cnh) {

    cnh = cnh.replace(/[^\d]+/g, '');

    if (cnh == '') return false;

    var v = 0, j = 9;

    for (var i = 0; i < 9; ++i, --j) {
        v += ((cnh.charAt(i) - 48) * j);
    }

    var dsc = 0, vl1 = v % 11;

    if (vl1 >= 10) {
        vl1 = 0;
        dsc = 2;
    }

    v = 0;
    j = 1;

    for (var i = 0; i < 9; ++i, ++j) {
        v += ((cnh.charAt(i) - 48) * j);
    }

    var x = v % 11;
    var vl2 = (x >= 10) ? 0 : x - dsc;

    return (vl1 + vl2 == cnh.substring(cnh.length - 2));
}