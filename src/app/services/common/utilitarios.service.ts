import { Injectable } from '@angular/core';

import { NavigationService } from './navigation.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { JsonRetornoModel } from '../../models';
import { HttpErrorCodeEnum } from '../../enums';
import { MatSnackBar } from 'src/app/app.material';
import { ViaCepModel } from '../../models/via-cep.model';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable()
export class UtilitariosService {

    constructor(private _navigationService: NavigationService,
                private _snackBar: MatSnackBar,
                private _http: HttpClient) {
    }

    HttpErrorReturn(response: HttpErrorResponse, callback: (mensagem: string, ret: JsonRetornoModel<string>) => void, mensagemPadrao: string = null, redirectLogin: boolean = true) {
        var defaultMsg = mensagemPadrao != null ? mensagemPadrao : 'Ocorreu um erro ao tentar processar a solicitação.';
        try {
            if (response.status == HttpErrorCodeEnum.BadRequest) {
                try {
                    var retorno = <JsonRetornoModel<string>>response.error;
                    callback(retorno.errors.map(x => x.message).join(', '), retorno);
                } catch (error) {
                    callback(defaultMsg, null);
                }
            }
            else if (response.status == HttpErrorCodeEnum.Unauthorized) {
                callback('Você não tem permissão para utilizar esse recurso.', null);
                if (redirectLogin)
                    this._navigationService.login();
            }
            else {
                callback(defaultMsg, null);
            }
        } catch (error) {
            callback(defaultMsg, null);
        }
    }

    SnackAlert(mensagem: string, tipo: 'default'|'success'|'error'|'warn', duracao: number = 10000) {
        this._snackBar.open(mensagem, 'Fechar', 
            { 
                panelClass: `snack-${tipo}`, 
                duration: duracao,
                verticalPosition: 'bottom',
                horizontalPosition: 'center'
            }
        );
    }

    BuscarCep(cep: string){
        let url: string = `https://viacep.com.br/ws/${cep.replace('-','').replace('.', '')}/json`;
        return this._http.get<ViaCepModel>(url);
    }

    ValidacoesForm(form: FormGroup) {
        Object.keys(form.controls).forEach((campo) => {
            const controle = form.get(campo);
            controle.markAsDirty();
            if (controle instanceof FormGroup) {
                this.ValidacoesForm(controle);
            }
        });
    }

}
