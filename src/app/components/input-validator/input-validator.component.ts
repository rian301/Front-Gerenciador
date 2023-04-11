import { Component, OnInit, Output, Input, AfterContentInit, EventEmitter, ContentChild } from '@angular/core';
import { NgModel, FormControlName } from '@angular/forms';
import { } from '../../models/index';

@Component({
    selector: 'input-validator',
    templateUrl: 'input-validator.component.html',
    styleUrls: ['./input-validator.component.css']
})
export class InputValidatorComponent implements OnInit, AfterContentInit {

    private _messages: any = null;
    @Input()
    set messages(value: any) {
        this._messages = value;
    };

    input: NgModel | FormControlName;

    get errorMessage(): string {
        try {
            if (this.input.errors == null)
                return null;
            // else
            //     return this._messages[Object.keys(this.input.errors)[0]];
            else {
                var message = '';
                var key = Object.keys(this.input.errors)[0];
                switch (key) {
                    case 'required':
                        message = 'O campo é obrigatório';
                        break;
                    case 'email':
                    case 'invalidEmail':
                        message = 'E-mail informado é inválido';
                        break;
                    case 'invalidPassword':
                        message = 'Senha informada é inválido';
                        break;
                    case 'confirmPasswordMatch':
                        message = 'Senhas estão divergentes';
                        break;
                    case 'cpf':
                        message = 'CPF informado é inválido';
                        break;
                    case 'cnpj':
                        message = 'CNPJ informado é inválido';
                        break;
                    case 'cnh':
                        message = 'CNH informado é inválido';
                        break;
                    case 'rg':
                        message = 'RG informado é inválido';
                        break;
                    case 'storeDocumentExisting':
                        message = 'Documento já existente';
                        break;
                    case 'storeUsernameNotExisting':
                        message = 'Username informado inválido';
                        break;
                    case 'storeUsernameExisting':
                        message = 'Username informado em uso';
                        break;
                    case 'userUsernameNotExisting':
                        message = 'Username informado inválido';
                        break;
                    case 'userUsernameExisting':
                        message = 'Username informado em uso';
                        break;
                    case 'minlength':
                        message = `Mínimo de ${this.input.errors['minlength'].requiredLength} caracteres obrigatório`;
                        break;
                    case 'maxlength':
                        message = 'Máximo de caracteres ultrapassado';
                        break;
                    case 'min':
                        message = `Mínimo ${this.input.errors['min'].min}`;
                        break;
                    case 'max':
                        message = `Máximo ${this.input.errors['max'].max}`;
                        break;
                    case 'Mask error':
                        message = 'Dado informado é inválido'
                        break;
                    case 'date':
                        message = 'Data inválida';
                        break;
                }
                return message;
            }
        } catch (error) { }
    }

    @ContentChild(NgModel) model: NgModel;
    @ContentChild(FormControlName) control: FormControlName;

    constructor() {
    }

    ngOnInit() { }

    ngAfterContentInit() {
        this.input = this.model || this.control;
        if (this.input === undefined) {
            throw new Error('Esse componente precisa ser usado com uma diretiva ngModel ou FormControlName')
        }
    }

    hasSuccess(): boolean {
        return this.input.valid && (this.input.dirty || this.input.touched);
    }

    hasError(): boolean {
        return this.input.invalid && (this.input.dirty || this.input.touched);
    }

}
