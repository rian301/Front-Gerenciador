import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AutenticacaoService } from "..";
import * as signalR from "@aspnet/signalr";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";

@Injectable()
export class SignalRService {

    private appHub: signalR.HubConnection;
    public conexaoExistente: boolean = false;
    public signalrSubscriptions: Subscription = new Subscription();
    dialogRef: any;

    public conexaoEstabelecidaHub: EventEmitter<boolean>;
    

    constructor(
        private _autenticacaoService: AutenticacaoService,
        private _dialog: MatDialog) {
        this.conexaoEstabelecidaHub = new EventEmitter<boolean>();
    }

    public init() {
        let sub = this.conexaoEstabelecidaHub
            .subscribe(conexao => {
                if (conexao) {
                    this.InscreverEventoSignal();
                }
            });

        this.signalrSubscriptions.add(sub);

        this.iniciarInstanciaSignal();
    }

    private InscreverEventoSignal(): void {
        
    }

    public iniciarInstanciaSignal() {
        if (!this._autenticacaoService.isLogado)
            return;

        let userToken = this._autenticacaoService.usuario.access_token;
        var options = { accessTokenFactory: () => userToken };
        this.appHub = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.urlApiResource}/apphub`, options)
            .build();
        this.iniciarConexao();
    }

    public iniciarConexao(): void {

        this.RegistrarEventosServidor();

        this.appHub.start()
            .then(() => {
                this.conexaoExistente = true;
                this.conexaoEstabelecidaHub.emit(true);
            })
            .catch((err) => {
                setTimeout(() => this.iniciarInstanciaSignal(), 5000);
            });

        this.appHub.onclose(() => {
            this.conexaoExistente = false;
            this.conexaoEstabelecidaHub.emit(false);
            this.iniciarInstanciaSignal();
        });
    }

    private RegistrarEventosServidor(): void {
        
    }
}