import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenModel, UserModel, UserPermissionModel } from 'src/app/models';
import { environment } from 'src/environments/environment';
import { AutenticacaoService } from '../auth/autenticacao.service';
import { RefreshTokenModel } from 'src/app/models/refresh-token.model';
import { CookieService } from 'ngx-cookie-service';
import { ChangePasswordModel } from 'src/app/models/change-password.model';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient,
    private _autenticacaoService: AutenticacaoService,
    private _cookieService: CookieService,
  ) { }

  private get COOKIE_AUTH(): string { return '_fp'; }
  get usuario(): TokenModel { return <TokenModel>JSON.parse(atob(this._cookieService.get(this.COOKIE_AUTH))) }

  get(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(
      `${environment.urlApiResource}/users`,
    );
  }

  find(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(
      `${environment.urlApiResource}/users/${id}`,
    );
  }

  save(model: UserModel): Observable<UserModel> {
    if (model.id != null && model.id > 0)
      return this.put(model);
    else
      return this.post(model);
  }

  put(model: UserModel): Observable<UserModel> {
    model.token = this.usuario.access_token;

    return this.http.put<UserModel>(
      `${environment.urlApiResource}/users`, model
    );
  }

  post(model: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(
      `${environment.urlApiResource}/users`, model
    );
  }

  changePasswordAdmin(model: ChangePasswordModel): Observable<boolean> {
    return this.http.put<boolean>(`${environment.urlApiResource}/users/change-password/admin`, model);
  }

  changePassword(model: ChangePasswordModel): Observable<boolean> {
    return this.http.put<boolean>(`${environment.urlApiResource}/users/change-password`, model);
  }

  refreshToken(code: string, idUser: number, idAccount: number): Promise<TokenModel> {
    var model = new RefreshTokenModel(code, idUser, idAccount);
    return new Promise((resolve, error) => {
      this.http.post<TokenModel>(`${environment.urlApiResource}/auth/refresh-token`, model)
        .toPromise()
        .then(ret => {
          this._autenticacaoService.AdicionarSessao(ret);
          resolve(ret);
        })
        .catch(er => error(er));
    });

  }

}
