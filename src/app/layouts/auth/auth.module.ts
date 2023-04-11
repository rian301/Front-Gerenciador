import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatProgressSpinnerModule } from 'src/app/app.material';

import { AuthComponent } from './auth.component';

import { NavbarModule } from '../../components/navbar/navbar.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NavbarModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    AuthComponent
  ]
})
export class AuthModule { }
