import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
} from 'src/app/app.material';

import { AuthRoutingModule } from './auth-pages.routing';

import { AuthModule } from '../../layouts/auth/auth.module';
import { LoginComponent } from './login/login.component';
import { LoadingService, AutenticacaoService, NavigationService, UtilitariosService } from 'src/app/services';
import { CookieService } from 'ngx-cookie-service';
import { MatCheckboxModule } from 'src/app/app.material';
import { NgxMaskModule } from 'ngx-mask';
import { InputValidatorModule } from 'src/app/components/input-validator/input-validator.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    AuthModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxMaskModule.forRoot(),
    InputValidatorModule
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  providers: [
    LoadingService,
    CookieService,
    AutenticacaoService,
    NavigationService,
    UtilitariosService
  ]
})
export class AuthPagesModule { }
