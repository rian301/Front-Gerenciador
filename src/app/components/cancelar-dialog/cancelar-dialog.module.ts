import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatButtonModule } from 'src/app/app.material';
import { CancelarDialogComponent } from './cancelar-dialog.component';

@NgModule({
  declarations: [
    CancelarDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    CancelarDialogComponent
  ]
})
export class CancelarDialogModule { }
