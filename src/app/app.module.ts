import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData, DatePipe, DecimalPipe } from '@angular/common';
import localept from '@angular/common/locales/pt';
registerLocaleData(localept, 'pt');

//Animations Module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSnackBarModule } from 'src/app/app.material';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { PublicPagesModule } from './pages/public/public-pages.module';
import { AuthPagesModule } from './pages/auth/auth-pages.module';
import { AppComponent } from './app.component';
import { LoadingService, AuthGuard, AutenticacaoService, NavigationService, UtilitariosService } from './services';
import { Init } from './_config';
import { RemocaoDialogModule } from './components/remocao-dialog/remocao-dialog.module';
import { RemocaoDialogComponent } from './components/remocao-dialog/remocao-dialog.component';
import { PermissionService } from './services/admin/permission.service';
import { HttpRequestInterceptor } from './interceptors/http.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SignalRService } from './services/admin/signalr.service';
import { AlertCustomDialogModule } from './components/alert-custom-dialog/alert-custom-dialog.module';
import { AlertCustomDialogComponent } from './components/alert-custom-dialog/alert-custom-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import '@fortawesome/fontawesome-free/js/all.js';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PublicPagesModule,
    AuthPagesModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    RemocaoDialogModule,
    AlertCustomDialogModule,
  ],
  entryComponents: [
    RemocaoDialogComponent,
    AlertCustomDialogComponent
  ],
  providers: [
    AuthGuard,
    Init,
    LoadingService,
    AutenticacaoService, 
    PermissionService,
    NavigationService,
    UtilitariosService,
    SignalRService,
    DatePipe,
    DecimalPipe,
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // Usado para utilizar o Angular em pt-BR
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }, // Usado para utilizar o Material em pt-BR
    // { provide: LocationStrategy, useClass: HashLocationStrategy }, // Usado para habilitar a /#/ na url
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }, // Usado para configurar o tempo que a snackbar permanece na tela\
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
