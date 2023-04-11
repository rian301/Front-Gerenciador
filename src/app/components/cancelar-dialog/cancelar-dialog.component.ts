import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cancelar-dialog',
  templateUrl: './cancelar-dialog.component.html',
  styleUrls: ['./cancelar-dialog.component.scss']
})
export class CancelarDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<CancelarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
