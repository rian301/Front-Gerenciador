import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';

import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { NgxMaskModule } from 'ngx-mask';

import { PublicPagesRoutingModule } from './public-pages.routing';

import { PublicModule } from '../../layouts/public/public.module';


@NgModule({
  imports: [
    CommonModule,
    PublicPagesRoutingModule,
    PublicModule,

    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatButtonToggleModule,
    MaterialFileInputModule,

    NgxMaskModule.forRoot()

  ],
  declarations: [
    // HomeComponent,
  ],
  providers: [    
  ]
})
export class PublicPagesModule { }
