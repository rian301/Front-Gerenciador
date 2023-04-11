import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemocaoDialogComponent } from './remocao-dialog.component';
import { MatDialogModule, MatButtonModule } from 'src/app/app.material';

@NgModule({
  declarations: [
    RemocaoDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    RemocaoDialogComponent
  ]
})
export class RemocaoDialogModule { }
