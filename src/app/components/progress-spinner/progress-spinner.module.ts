import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from 'src/app/app.material';
import { ProgressSpinnerComponent } from './progress-spinner.component';

@NgModule({
  declarations: [
    ProgressSpinnerComponent
  ],
  imports: [
    MatProgressSpinnerModule,
    CommonModule
  ],
  exports: [
    ProgressSpinnerComponent
  ]
})
export class ProgressSpinnerModule { }
