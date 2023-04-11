import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PublicComponent } from './public.component';

import { NavbarModule } from '../../components/navbar/navbar.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NavbarModule
  ],
  declarations: [
    PublicComponent
  ]
})
export class PublicModule { }
