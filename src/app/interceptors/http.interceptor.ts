import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TokenModel } from '../models';
import { CookieService } from 'ngx-cookie-service';
import { UtilitariosService } from '../services';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  private get COOKIE_AUTH(): string { return '_fp'; }
  get isLogado() { return this._cookieService.check(this.COOKIE_AUTH) }
  get usuario(): TokenModel { return this.isLogado ? <TokenModel>JSON.parse(atob(this._cookieService.get(this.COOKIE_AUTH))) : null }

  constructor(private _cookieService: CookieService, private _utilitariosService: UtilitariosService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // var disabled = request.headers.get('x-disabled') == null;
    var headers = new HttpHeaders();

    if (this.isLogado) {
      headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.usuario.access_token
      });
    }

    if (headers != null && request.url.includes(environment.urlApiResource)) {
      request = request.clone({ headers: headers });
    }

    if (!request.headers.has('Content-Type') && !(request.body instanceof FormData)) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
      request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
    }

    return next.handle(request).pipe(

      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((response: HttpErrorResponse) => {
        if (response.error != null)
          this._utilitariosService.SnackAlert(response.error.errors.map(x => x.message).join('\n'), 'error');
          
        return throwError(response);
      }));
  }
}
