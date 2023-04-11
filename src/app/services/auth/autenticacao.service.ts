import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { TokenModel, LoginModel, UserModel, UserPermissionModel, JsonRetornoPadraoModel } from '../../models';
import { environment } from '../../../environments/environment';
import { NavigationService } from '../common/navigation.service';
import { Observable } from 'rxjs';
import { ResetPasswordModel } from 'src/app/models/reset-password.model';

@Injectable()
export class AutenticacaoService {
  private get COOKIE_AUTH(): string { return '_fp'; }
  private get COOKIE_FORM(): string { return '_fu'; }

  atualizarImagemENomeUsuario: EventEmitter<UserModel> = new EventEmitter<UserModel>();

  get isLogado() { return this._cookieService.check(this.COOKIE_AUTH) }
  get isFormularioSalvo() { return this._cookieService.check(this.COOKIE_FORM) }
  get usuario(): TokenModel { return this.isLogado ? <TokenModel>JSON.parse(atob(this._cookieService.get(this.COOKIE_AUTH))) : null }
  get imagem(): string { return this.isLogado ? this._cookieService.get('imagem') : null }

  constructor(
    private _http: HttpClient,
    private _cookieService: CookieService,
    private _navigationService: NavigationService) {
  }

  getToken(usuario: LoginModel) {
    return this._http.post<TokenModel>(`${environment.urlApiResource}/auth`, JSON.stringify(usuario), { headers: this.contentHeader() });
  }

  AdicionarSessao(usuario: TokenModel) {
    this._cookieService.set(this.COOKIE_AUTH, btoa(JSON.stringify(usuario)), new Date(usuario.expiration));
    this._cookieService.set('name', usuario.name, new Date(usuario.expiration));

    let usuarioModel = new UserModel();
    usuarioModel.nome = usuario.name;

    this.atualizarImagemENomeUsuario.emit(usuarioModel);
  }

  RemoverSessao(redirectLogin: boolean = true) {
    this._cookieService.delete(this.COOKIE_AUTH);
    this._cookieService.delete('name');

    if (redirectLogin) this._navigationService.login();
  }

  public contentHeader(): HttpHeaders {
    var headers = new HttpHeaders();
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return headers;
  }

  public contentHeaderToken(): HttpHeaders {
    var headers = new HttpHeaders();
    if (this.isLogado) {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.usuario.access_token
      });
    }
    return headers;
  }

  SalvarFormUsuario(usuario: LoginModel) {
    this._cookieService.set(this.COOKIE_FORM, btoa(JSON.stringify(usuario)))
  }

  ObterFormUsuario(): LoginModel {
    if (this._cookieService.check(this.COOKIE_FORM))
      return <LoginModel>JSON.parse(atob(this._cookieService.get(this.COOKIE_FORM)));
  }

  loadUserPermissions(): Observable<UserPermissionModel[]> {
		return this._http.get<UserPermissionModel[]>(
			`${environment.urlApiResource}/users/permissions`);
	}

  ForgotPassword(email: string) {
    let data = { email: email };
    return this._http.post<JsonRetornoPadraoModel>(`${environment.urlApiResource}/auth/recover-password`, JSON.stringify(data), { headers: this.contentHeader() });
  }

  ResetPassword(model: ResetPasswordModel) {
    return this._http.post<JsonRetornoPadraoModel>(`${environment.urlApiResource}/auth/reset-password`, JSON.stringify(model), { headers: this.contentHeader() });
  }
}
